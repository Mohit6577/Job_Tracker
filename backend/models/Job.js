const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Rejected'],
    default: 'Applied',
  },
  dateApplied: { type: Date, default: Date.now },
  notes: {
    type: String,
  },
});
module.exports = mongoose.model('Job', jobSchema);
