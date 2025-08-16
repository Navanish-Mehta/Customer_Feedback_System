const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  product: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  nps: {
    type: Number,
    required: [true, 'NPS score is required'],
    min: [0, 'NPS score must be at least 0'],
    max: [10, 'NPS score cannot exceed 10'],
    validate: {
      validator: Number.isInteger,
      message: 'NPS score must be a whole number'
    }
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be a whole number'
    }
  },
  feedbackText: {
    type: String,
    required: [true, 'Feedback text is required'],
    trim: true,
    minlength: [10, 'Feedback must be at least 10 characters long'],
    maxlength: [1000, 'Feedback cannot exceed 1000 characters']
  },
  sentiment: {
    type: String,
    required: [true, 'Sentiment is required'],
    enum: {
      values: ['positive', 'neutral', 'negative'],
      message: 'Sentiment must be positive, neutral, or negative'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for NPS category
feedbackSchema.virtual('npsCategory').get(function() {
  if (this.nps >= 9) return 'Promoter';
  if (this.nps >= 7) return 'Passive';
  return 'Detractor';
});

// Virtual for rating category
feedbackSchema.virtual('ratingCategory').get(function() {
  if (this.rating >= 4) return 'High';
  if (this.rating >= 3) return 'Medium';
  return 'Low';
});

// Indexes for better query performance
feedbackSchema.index({ email: 1 });
feedbackSchema.index({ product: 1 });
feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ sentiment: 1 });
feedbackSchema.index({ rating: 1 });
feedbackSchema.index({ nps: 1 });

// Pre-save middleware to update updatedAt
feedbackSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to get aggregated statistics
feedbackSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalFeedback: { $sum: 1 },
        avgRating: { $avg: '$rating' },
        avgNps: { $avg: '$nps' },
        totalPromoters: {
          $sum: { $cond: [{ $gte: ['$nps', 9] }, 1, 0] }
        },
        totalPassives: {
          $sum: { $cond: [{ $and: [{ $gte: ['$nps', 7] }, { $lt: ['$nps', 9] }] }, 1, 0] }
        },
        totalDetractors: {
          $sum: { $cond: [{ $lt: ['$nps', 7] }, 1, 0] }
        },
        positiveSentiment: {
          $sum: { $cond: [{ $eq: ['$sentiment', 'positive'] }, 1, 0] }
        },
        neutralSentiment: {
          $sum: { $cond: [{ $eq: ['$sentiment', 'neutral'] }, 1, 0] }
        },
        negativeSentiment: {
          $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] }
        }
      }
    }
  ]);

  return stats[0] || {
    totalFeedback: 0,
    avgRating: 0,
    avgNps: 0,
    totalPromoters: 0,
    totalPassives: 0,
    totalDetractors: 0,
    positiveSentiment: 0,
    neutralSentiment: 0,
    negativeSentiment: 0
  };
};

module.exports = mongoose.model('Feedback', feedbackSchema);
