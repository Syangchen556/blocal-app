'use client';

import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const FAQs = [
  {
    question: "How do I track my order?",
    answer: "You can track your order by going to 'My Orders' in your account dashboard. There you'll find all your orders and their current status."
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns within 7 days of delivery. Items must be unused and in their original packaging. Contact our support team to initiate a return."
  },
  {
    question: "Can I cancel an order after placing it?",
    answer: "Yes, you can cancel your order if it hasn't been shipped yet. Go to 'My Orders' and look for the cancel option next to eligible orders."
  }
];

const GettingStartedSteps = [
  {
    icon: "🔍",
    title: "Browse Products",
    description: "Use the main menu to explore categories."
  },
  {
    icon: "🛒",
    title: "Add to Cart",
    description: "Click \"Add to Cart\" under any item you wish to purchase."
  },
  {
    icon: "📦",
    title: "Track Orders",
    description: "Go to \"My Orders\" in your account dashboard."
  },
  {
    icon: "↩️",
    title: "Request Returns",
    description: "Use the return option next to delivered items."
  },
  {
    icon: "📞",
    title: "Need Help?",
    description: "Contact support at support@veggieshop.com"
  }
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // Filter FAQs based on search query
  const filteredFAQs = FAQs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter Getting Started steps based on search query
  const filteredSteps = GettingStartedSteps.filter(step =>
    step.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    step.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Help Center Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
        <p className="text-lg text-gray-600 mb-8">
          We're here to help. Search for a topic or browse common questions.
        </p>
        
        {/* Enhanced Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search help topics..."
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
          {searchFocused && searchQuery && (
            <div className="absolute w-full bg-white mt-1 rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="p-2 text-sm text-gray-500">
                Found {filteredFAQs.length + filteredSteps.length} results
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Results Summary */}
      {searchQuery && (
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <p className="text-gray-600">
            Showing results for "{searchQuery}"
          </p>
        </div>
      )}

      {/* Most Asked Questions */}
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Most Asked Questions
        </h2>
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
          {filteredFAQs.length === 0 && searchQuery && (
            <div className="text-center text-gray-500">
              No FAQs found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Getting Started
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {filteredSteps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 flex items-start space-x-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-2xl">{step.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
          {filteredSteps.length === 0 && searchQuery && (
            <div className="text-center text-gray-500 md:col-span-2">
              No getting started guides found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 