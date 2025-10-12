import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, Sprout } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-9xl font-bold text-gray-200 select-none">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sprout className="w-16 h-16 text-green-600" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The page you're looking for seems to have wandered off like a lost sheep in the field.
          </p>
          <p className="text-sm text-gray-500">
            Don't worry, even the best farmers sometimes lose track of their crops!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2 w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center space-x-2 w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            Looking for something specific? Try these popular pages:
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link
              to="/dashboard"
              className="text-green-600 hover:text-green-700 hover:underline"
            >
              Dashboard
            </Link>
            <Link
              to="/crops"
              className="text-green-600 hover:text-green-700 hover:underline"
            >
              Crop Monitoring
            </Link>
            <Link
              to="/marketplace"
              className="text-green-600 hover:text-green-700 hover:underline"
            >
              Marketplace
            </Link>
            <Link
              to="/forum"
              className="text-green-600 hover:text-green-700 hover:underline"
            >
              Community Forum
            </Link>
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center space-x-2 text-blue-700">
            <Search className="w-4 h-4" />
            <span className="text-sm font-medium">
              Try using the search feature or navigation menu
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
