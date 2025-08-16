import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Star, TrendingUp, Trash2 } from 'lucide-react';
import { feedbackAPI } from '../utils/api';
import toast from 'react-hot-toast';
import SearchFilterBar from '../components/SearchFilterBar';
import FeedbackTable from '../components/FeedbackTable';

const AdminDashboard = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: '',
    product: '',
    rating: '',
    sentiment: '',
    from: '',
    to: ''
  });

  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      const response = await feedbackAPI.getAll(filters);
      
      // Handle both successful responses and empty data gracefully
      if (response.data && response.data.error === false) {
        setFeedback(response.data.data || []);
      } else {
        setFeedback([]);
        console.warn('No feedback data received');
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      
      // Handle different types of errors gracefully
      if (error.response?.status === 400) {
        toast.error('Invalid filter parameters. Please check your search criteria.');
      } else if (error.response?.status === 401) {
        toast.error('Authentication required. Please log in again.');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error('Failed to fetch feedback. Please try again.');
      }
      
      // Set empty feedback array on error
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await feedbackAPI.delete(id);
        toast.success('Feedback deleted successfully!');
        setFeedback(feedback.filter((item) => item._id !== id));
      } catch (error) {
        console.error('Error deleting feedback:', error);
        toast.error('Failed to delete feedback');
      }
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feedback...</p>
        </div>
      </div>
    );
  }

  // Show empty state when no feedback
  if (!feedback || feedback.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage and view customer feedback</p>
          </div>

          <div className="card">
            <div className="card-body text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h3>
              <p className="text-gray-600 mb-6">
                Customer feedback will appear here once submitted through the feedback form.
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                View Feedback Form
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage and view customer feedback</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                  <MessageSquare className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                  <p className="text-2xl font-bold text-gray-900">{feedback.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center mr-4">
                  <Star className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length || 0).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="w-5 h-5 text-warning-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Positive Sentiment</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {feedback.filter(item => item.sentiment === 'positive').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-6">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <SearchFilterBar
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
              <Link 
                to="/analytics" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                View Analytics
              </Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Customer Feedback</h3>
          </div>
          <div className="card-body p-0">
            <FeedbackTable
              feedback={feedback}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
