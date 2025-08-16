import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import NPSDistributionChart from '../components/Charts/NPSDistributionChart';
import RatingDistributionChart from '../components/Charts/RatingDistributionChart';
import SentimentDistributionChart from '../components/Charts/SentimentDistributionChart';
import NPSCategoriesChart from '../components/Charts/NPSCategoriesChart';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getAll();
      
      // Handle both successful responses and empty data gracefully
      if (response.data && response.data.error === false) {
        setAnalytics(response.data.data);
      } else {
        console.warn('No analytics data received');
        toast.error('No analytics data available');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      
      // Handle different types of errors gracefully
      if (error.response?.status === 401) {
        toast.error('Authentication required. Please log in again.');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error('Failed to fetch analytics data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Gain insights from your customer feedback data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="card-body">
              <p className="text-sm font-medium text-gray-600">Total Feedback</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.summary.totalFeedback}</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.summary.avgRating}</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <p className="text-sm font-medium text-gray-600">Average NPS</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.summary.avgNps}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">NPS Score Distribution</h3>
            </div>
            <div className="card-body">
              <NPSDistributionChart data={analytics.npsDistribution} />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Rating Distribution</h3>
            </div>
            <div className="card-body">
              <RatingDistributionChart data={analytics.ratingDistribution} />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Sentiment Distribution</h3>
            </div>
            <div className="card-body">
              <SentimentDistributionChart data={analytics.sentimentDistribution} />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">NPS Categories</h3>
            </div>
            <div className="card-body">
              <NPSCategoriesChart data={analytics.npsCategories} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
