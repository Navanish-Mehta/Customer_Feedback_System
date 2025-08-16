import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { feedbackAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { Star, Send, CheckCircle } from 'lucide-react';

const FeedbackForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const star = i + 1;
      return (
        <button
          key={star}
          type="button"
          onClick={() => setSelectedRating(star)}
          className="focus:outline-none transition-transform duration-150 hover:scale-110"
        >
          <Star
            className={`w-8 h-8 ${
              star <= selectedRating
                ? 'text-warning-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        </button>
      );
    });
  };

  const onSubmit = async (data) => {
    if (selectedRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Determine sentiment based on NPS score and rating
      let sentiment = 'neutral';
      if (data.nps >= 9 || selectedRating >= 4) {
        sentiment = 'positive';
      } else if (data.nps <= 6 || selectedRating <= 2) {
        sentiment = 'negative';
      }

      const payload = {
        ...data,
        rating: selectedRating,
        sentiment: sentiment
      };

      await feedbackAPI.submit(payload);
      toast.success('Thank you for your feedback!');
      
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        reset();
        setSelectedRating(0);
      }, 3000);

    } catch (error) {
      console.error('Feedback submission error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit feedback. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center card p-8 animate-bounce-in">
          <CheckCircle className="w-20 h-20 text-success-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Feedback Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Your feedback has been submitted successfully.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="btn-primary"
          >
            Submit Another Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Share Your Feedback
          </h1>
          <p className="text-lg text-gray-600">
            Help us improve by sharing your thoughts
          </p>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    {...register('name', { required: 'Name is required' })}
                    className={errors.name ? 'input-error' : 'input'}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="form-error">{errors.name.message}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    className={errors.email ? 'input-error' : 'input'}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="form-error">{errors.email.message}</p>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="product" className="form-label">Product/Service Name *</label>
                <input
                  type="text"
                  id="product"
                  {...register('product', { required: 'Product name is required' })}
                  className={errors.product ? 'input-error' : 'input'}
                  placeholder="Enter the product or service name"
                />
                {errors.product && <p className="form-error">{errors.product.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Overall Rating *</label>
                <div className="flex items-center space-x-2 mb-2">
                  {renderStars()}
                </div>
                <input
                  type="hidden"
                  {...register('rating', { required: 'Rating is required' })}
                  value={selectedRating}
                />
                {errors.rating && <p className="form-error">{errors.rating.message}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="nps" className="form-label">NPS Score (0-10) *</label>
                <input
                  type="number"
                  id="nps"
                  min="0"
                  max="10"
                  {...register('nps', { 
                    required: 'NPS score is required',
                    min: { value: 0, message: 'Score must be at least 0' },
                    max: { value: 10, message: 'Score cannot exceed 10' }
                  })}
                  className={errors.nps ? 'input-error' : 'input'}
                  placeholder="0-10"
                />
                {errors.nps && <p className="form-error">{errors.nps.message}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="feedbackText" className="form-label">Detailed Feedback *</label>
                <textarea
                  id="feedbackText"
                  rows={4}
                  {...register('feedbackText', { 
                    required: 'Feedback text is required',
                    minLength: { value: 10, message: 'Feedback must be at least 10 characters' }
                  })}
                  className={`resize-none ${errors.feedbackText ? 'input-error' : 'input'}`}
                  placeholder="Please share your detailed feedback..."
                />
                {errors.feedbackText && <p className="form-error">{errors.feedbackText.message}</p>}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-3 text-base font-medium disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : (
                    <div className="flex items-center justify-center">
                      <Send className="w-5 h-5 mr-2" />
                      Submit Feedback
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
