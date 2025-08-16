import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';

const SearchFilterBar = ({ filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Debounced filter update
  const debouncedUpdate = useCallback(
    debounce((newFilters) => {
      onFiltersChange(newFilters);
    }, 300),
    [onFiltersChange]
  );

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Handle input changes with debouncing
  const handleInputChange = (field, value) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    debouncedUpdate(newFilters);
  };

  // Handle form submission to prevent page reload
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission is handled by the debounced input changes
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = {
      q: '',
      product: '',
      rating: '',
      sentiment: '',
      from: '',
      to: ''
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search feedback by name, product, or text..."
          value={localFilters.q}
          onChange={(e) => handleInputChange('q', e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 shadow-sm"
        />
      </form>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-100"
        >
          <Filter className="w-4 h-4" />
          <span className="font-medium">Advanced Filters</span>
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-red-50"
          >
            <X className="w-4 h-4" />
            <span className="font-medium">Clear All</span>
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
          {/* Product Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product
            </label>
            <input
              type="text"
              placeholder="Filter by product"
              value={localFilters.product}
              onChange={(e) => handleInputChange('product', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 shadow-sm"
            />
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <select
              value={localFilters.rating}
              onChange={(e) => handleInputChange('rating', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 shadow-sm bg-white"
            >
              <option value="">All Ratings</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>

          {/* Sentiment Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sentiment
            </label>
            <select
              value={localFilters.sentiment}
              onChange={(e) => handleInputChange('sentiment', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 shadow-sm bg-white"
            >
              <option value="">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>

          {/* Date From Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={localFilters.from}
              onChange={(e) => handleInputChange('from', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 shadow-sm"
            />
          </div>

          {/* Date To Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={localFilters.to}
              onChange={(e) => handleInputChange('to', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 shadow-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default SearchFilterBar;
