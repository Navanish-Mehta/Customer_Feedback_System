const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Feedback = require('../models/Feedback');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateFeedback = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name is required and must be between 1-100 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('product')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Product name is required and must be between 1-100 characters'),
  
  body('nps')
    .isInt({ min: 0, max: 10 })
    .withMessage('NPS score must be a whole number between 0-10'),
  
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be a whole number between 1-5'),
  
  body('feedbackText')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Feedback text must be between 10-1000 characters'),
  
  body('sentiment')
    .isIn(['positive', 'neutral', 'negative'])
    .withMessage('Sentiment must be positive, neutral, or negative')
];

const validateQuery = [
  query('q').optional().trim().customSanitizer(value => value === '' ? undefined : value),
  query('product').optional().trim().customSanitizer(value => value === '' ? undefined : value),
  query('rating').optional().customSanitizer(value => {
    if (value === '' || value === undefined) return undefined;
    const num = parseInt(value);
    return isNaN(num) ? undefined : num;
  }).isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1-5'),
  query('sentiment').optional().customSanitizer(value => value === '' ? undefined : value).isIn(['positive', 'neutral', 'negative']),
  query('from').optional().customSanitizer(value => value === '' ? undefined : value).isISO8601(),
  query('to').optional().customSanitizer(value => value === '' ? undefined : value).isISO8601(),
  query('skip').optional().isInt({ min: 0 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
];

// POST /api/feedback - Submit feedback (public)
router.post('/', validateFeedback, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: true,
        message: 'Validation failed',
        details: errors.array()
      });
    }

    // Create new feedback
    const feedback = new Feedback(req.body);
    await feedback.save();

    res.status(201).json({
      error: false,
      message: 'Feedback submitted successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to submit feedback'
    });
  }
});

// GET /api/feedback - Get all feedback (protected, with search/filter)
router.get('/', authenticateToken, validateQuery, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: true,
        message: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      q, product, rating, sentiment, from, to, skip = 0, limit = 50
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (q && q.trim() !== '') {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { product: { $regex: q, $options: 'i' } },
        { feedbackText: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (product && product.trim() !== '') {
      filter.product = { $regex: product, $options: 'i' };
    }
    
    if (rating !== undefined && rating !== null) {
      filter.rating = parseInt(rating);
    }
    
    if (sentiment && sentiment.trim() !== '') {
      filter.sentiment = sentiment;
    }
    
    if (from || to) {
      filter.createdAt = {};
      if (from && from.trim() !== '') filter.createdAt.$gte = new Date(from);
      if (to && to.trim() !== '') filter.createdAt.$lte = new Date(to);
    }

    // Execute query with pagination
    const [feedback, total] = await Promise.all([
      Feedback.find(filter)
        .sort({ createdAt: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .lean(),
      Feedback.countDocuments(filter)
    ]);

    // Always return a valid response, even if no feedback found
    res.json({
      error: false,
      data: feedback || [],
      pagination: {
        total: total || 0,
        skip: parseInt(skip),
        limit: parseInt(limit),
        hasMore: (total || 0) > parseInt(skip) + (feedback ? feedback.length : 0)
      }
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    // Return empty data instead of error for better UX
    res.json({
      error: false,
      data: [],
      pagination: {
        total: 0,
        skip: parseInt(req.query.skip || 0),
        limit: parseInt(req.query.limit || 50),
        hasMore: false
      }
    });
  }
});

// GET /api/feedback/:id - Get single feedback (protected)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({
        error: true,
        message: 'Feedback not found'
      });
    }

    res.json({
      error: false,
      data: feedback
    });
  } catch (error) {
    console.error('Get single feedback error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to retrieve feedback'
    });
  }
});

// DELETE /api/feedback/:id - Delete feedback (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({
        error: true,
        message: 'Feedback not found'
      });
    }

    res.json({
      error: false,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to delete feedback'
    });
  }
});

module.exports = router;
