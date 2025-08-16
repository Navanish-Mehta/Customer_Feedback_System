import React from 'react';
import { Star, Trash2 } from 'lucide-react';

const FeedbackTable = ({ feedback, onDelete }) => {
  if (!feedback || feedback.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No feedback found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead className="table-header">
          <tr>
            <th className="table-header-cell">Name</th>
            <th className="table-header-cell">Product</th>
            <th className="table-header-cell">Rating</th>
            <th className="table-header-cell">NPS</th>
            <th className="table-header-cell">Sentiment</th>
            <th className="table-header-cell">Date</th>
            <th className="table-header-cell">Actions</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {feedback.map((item) => (
            <tr key={item._id} className="table-row">
              <td className="table-cell">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.email}</p>
                </div>
              </td>
              <td className="table-cell">
                <span className="font-medium text-gray-900">{item.product}</span>
              </td>
              <td className="table-cell">
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < item.rating ? 'text-warning-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">({item.rating}/5)</span>
                </div>
              </td>
              <td className="table-cell">
                <span className="font-medium text-gray-900">{item.nps}/10</span>
              </td>
              <td className="table-cell">
                <span
                  className={`badge ${
                    item.sentiment === 'positive'
                      ? 'badge-success'
                      : item.sentiment === 'neutral'
                      ? 'badge-warning'
                      : 'badge-danger'
                  }`}
                >
                  {item.sentiment}
                </span>
              </td>
              <td className="table-cell">
                {new Date(item.createdAt).toLocaleDateString()}
              </td>
              <td className="table-cell">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onDelete(item._id)}
                    className="text-danger-600 hover:text-danger-900 transition-colors duration-200"
                    title="Delete Feedback"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackTable;
