import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileDropdown from '../components/ProfileDropdown';
import { authAPI } from '../services/api';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authAPI.checkAuth();
        if (response.userType !== 'user') {
          navigate('/partner/profile');
          return;
        }
        setUser(response);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/user/login');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Profile Dropdown */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            <ProfileDropdown user={user} type="user" />
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-linear-to-r from-red-500 to-orange-500 px-8 py-12">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-red-600 dark:text-red-400">
                {user.name.charAt(0)}
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-red-100 mt-1">Food Lover</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-8 py-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Personal Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Email Address
                  </label>
                  <p className="text-gray-900 dark:text-white">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Phone Number
                  </label>
                  <p className="text-gray-900 dark:text-white">{user.phone || 'Not added Yet/N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Delivery Address
                  </label>
                  <p className="text-gray-900 dark:text-white">{user.address}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
                  Edit Profile
                </button>
                <button className="px-6 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg border-2 border-gray-300 dark:border-gray-600 transition-colors">
                  Change Password
                </button>
                <button className="px-6 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg border-2 border-gray-300 dark:border-gray-600 transition-colors">
                  Order History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
