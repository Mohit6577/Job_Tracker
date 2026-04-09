import express from 'express';
const router = express.Router();
import Job from '../models/Job.js';
import protect from '../middleware/authMiddleware.js';

//CREATE JOB
router.post('/', protect, async (req, res, next) => {
  try {
    const { companyName, role } = req.body;

    if (!companyName || !role) {
      res.status(400);
      throw new Error('Company and role required');
    }
    const job = new Job({
      ...req.body,
      user: req.user.id,
    });
    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (err) {
    next(err);
  }
});
//GET ALL JOBS
router.get('/', protect, async (req, res, next) => {
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
    const jobs = await Job.find({ ...queryObj, user: req.user.id })
      .sort({ dateApplied: -1 })
      .skip(skip)
      .limit(limit);

    //TOTAL COUNT
    const total = await Job.countDocuments({ ...queryObj, user: req.user.id });

    res.json({
      total,
      page,
      limit,
      jobs,
    });
  } catch (err) {
    next(err);
  }
});

//DELETE JOBS
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    //Check ownership
    if (job.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized');
    }
    await job.deleteOne();
    res.json({ message: 'Job deleted' });
  } catch (err) {
    next(err);
  }
});

//UPDATE JOBS
router.put('/:id', protect, async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    // 🔐 Ownership check
    if (job.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized');
    }
    const updatedJob = await Job.findById(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedJob);
  } catch (err) {
    next(err);
  }
});

export default router;
