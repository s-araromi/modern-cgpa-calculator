import React, { useState } from 'react';
import { Send } from 'lucide-react';

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    message: '',
    rating: 5
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just log the feedback. Later we can add backend integration
    console.log('Feedback submitted:', feedback);
    // Clear the form
    setFeedback({ name: '', email: '', message: '', rating: 5 });
    alert('Thank you for your feedback!');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/50 backdrop-blur-md rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Share Your Feedback</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={feedback.name}
            onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Your name"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={feedback.email}
            onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
            Rating
          </label>
          <select
            id="rating"
            value={feedback.rating}
            onChange={(e) => setFeedback({ ...feedback, rating: Number(e.target.value) })}
            className="w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} Star{num !== 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Feedback
          </label>
          <textarea
            id="message"
            value={feedback.message}
            onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={4}
            placeholder="Share your thoughts, suggestions, or report issues..."
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Send className="w-4 h-4" />
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
