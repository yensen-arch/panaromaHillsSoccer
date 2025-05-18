import mongoose from 'mongoose';

const seasonSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  heading: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  bannerImage: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
seasonSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Season = mongoose.models.Season || mongoose.model('Season', seasonSchema); 