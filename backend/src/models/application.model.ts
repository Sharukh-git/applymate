import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  resumeText: { type: String, required: true },
  jobDescription: { type: String, required: true },
  matchScore: Number,
  weakSkills: [String],
  suggestedImprovements: [String],
  suggestedCourses: [String],
  
  
  status: {
    type: String,
    enum: ['pending', 'processing', 'done'],
    default: 'pending',
  },
  coverLetter: String,
  coverLetterStatus: {
    type: String,
    enum: ['not_requested', 'pending', 'done'],
    default: 'not_requested',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Application', applicationSchema);
