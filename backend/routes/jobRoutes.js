const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
//CREATE JOB
router.post('/', async (req, res) => {
  try {
    const queryObj = {};

    const job = new Job(req.body);
    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//GET ALL JOBS
router.get('/', async (req, res) => {
  try {
    const queryObj = {};
    //FILTER
    if (req.query.status) {
      queryObj.status = req.query.status;
    }
    //SEARCH
    if (req.query.search) {
      queryObj.$or = [
        { companyName: { $regex: req.query.search, $options: 'i' } },
        { role: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    //PAGINATION
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    //QUERY EXECUTION
    const jobs = await Job.find(queryObj)
      .sort({ dateApplied: -1 })
      .skip(skip)
      .limit(limit);

    //TOTAL COUNT
    const total = await Job.countDocuments(queryObj);

    res.json({
      total,
      page,
      limit,
      jobs,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//DELETE JOBS
router.delete('/:id', async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//UPDATE JOBS
router.put('/:id', async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
