const express = require('express');
const Feedback = require('../models/Feedback');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/analytics - Get all analytics data for charts
router.get('/', async (req, res) => {
  try {
    // Get all required analytics data in parallel
    const [
      npsDistribution,
      ratingDistribution,
      sentimentDistribution,
      npsCategories,
      summary
    ] = await Promise.all([
      // NPS Distribution (0-10)
      Feedback.aggregate([
        { $group: { _id: '$nps', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      
      // Rating Distribution (1-5)
      Feedback.aggregate([
        { $group: { _id: '$rating', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      
      // Sentiment Distribution
      Feedback.aggregate([
        { $group: { _id: '$sentiment', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      
      // NPS Categories (Promoters: 9-10, Passives: 7-8, Detractors: 0-6)
      Feedback.aggregate([
        {
          $addFields: {
            npsCategory: {
              $cond: [
                { $gte: ['$nps', 9] },
                'Promoter',
                {
                  $cond: [
                    { $gte: ['$nps', 7] },
                    'Passive',
                    'Detractor'
                  ]
                }
              ]
            }
          }
        },
        { $group: { _id: '$npsCategory', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      
      // Summary statistics
      Feedback.getStats()
    ]);

    // Ensure complete NPS distribution (0-10)
    const completeNpsDistribution = [];
    for (let i = 0; i <= 10; i++) {
      const found = npsDistribution.find(item => item._id === i);
      completeNpsDistribution.push({ score: i, count: found ? found.count : 0 });
    }

    // Ensure complete rating distribution (1-5)
    const completeRatingDistribution = [];
    for (let i = 1; i <= 5; i++) {
      const found = ratingDistribution.find(item => item._id === i);
      completeRatingDistribution.push({ rating: i, count: found ? found.count : 0 });
    }

    // Ensure complete sentiment distribution
    const completeSentimentDistribution = [];
    const sentiments = ['positive', 'neutral', 'negative'];
    sentiments.forEach(sentiment => {
      const found = sentimentDistribution.find(item => item._id === sentiment);
      completeSentimentDistribution.push({ sentiment, count: found ? found.count : 0 });
    });

    // Ensure complete NPS categories
    const completeNpsCategories = [];
    const categories = ['Detractor', 'Passive', 'Promoter'];
    categories.forEach(category => {
      const found = npsCategories.find(item => item._id === category);
      completeNpsCategories.push({ category, count: found ? found.count : 0 });
    });

    res.json({
      error: false,
      data: {
        npsDistribution: completeNpsDistribution,
        ratingDistribution: completeRatingDistribution,
        sentimentDistribution: completeSentimentDistribution,
        npsCategories: completeNpsCategories,
        summary: {
          totalFeedback: summary.totalFeedback,
          avgNps: parseFloat(summary.avgNps.toFixed(2)),
          avgRating: parseFloat(summary.avgRating.toFixed(2))
        }
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to retrieve analytics data'
    });
  }
});

module.exports = router;
