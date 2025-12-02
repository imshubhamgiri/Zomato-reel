import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileDropdown from '../components/ProfileDropdown';

function Home() {
  // Mock logged-in state - replace with actual auth context/state
  const [isLoggedIn] = useState(true); // Change to false to test logged-out state
  const [userType] = useState('user'); // 'user' or 'partner'
  
  // Mock user data - will be replaced with actual user data from context/API
  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  const mockPartner = {
    restaurantName: 'Delicious Bites',
    name: 'Jane Smith',
    email: 'partner@deliciousbites.com',
  };

  const currentUser = userType === 'partner' ? mockPartner : mockUser;

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header with Profile Dropdown */}
      {isLoggedIn && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3">
              <Link to="/" className="text-2xl font-bold text-red-600">
                Zomato
              </Link>
              <ProfileDropdown user={currentUser} type={userType} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex items-center justify-center px-4" style={{ minHeight: isLoggedIn ? 'calc(100vh - 64px)' : '100vh' }}>
        <div className="max-w-4xl w-full text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
            Welcome to <span className="text-red-600">Zomato</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover the best food & drinks in your city
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* User Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  For Food Lovers
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Order your favorite meals
                </p>
              </div>
              <div className="space-y-3">
                <Link
                  to="/user/login"
                  className="block w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/user/register"
                  className="block w-full py-3 px-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-red-600 dark:text-red-400 font-medium rounded-lg border-2 border-red-600 dark:border-red-400 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>

          {/* Partner Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  For Restaurants
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Grow your business with us
                </p>
              </div>
              <div className="space-y-3">
                <Link
                  to="/partner/login"
                  className="block w-full py-3 px-4 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                >
                  Partner Login
                </Link>
                <Link
                  to="/partner/register"
                  className="block w-full py-3 px-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg border-2 border-gray-900 dark:border-gray-600 transition-colors"
                >
                  Register Restaurant
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>Join thousands of food lovers and restaurant partners</p>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
