import React from 'react';
import { Link } from 'react-router-dom';
import ProfileDropdown from '../components/ProfileDropdown';

function PartnerProfile() {
  // Mock partner data - will be replaced with actual API data
  const partner = {
    restaurantName: 'Delicious Bites',
    ownerName: 'Jane Smith',
    name: 'Jane Smith',
    email: 'partner@deliciousbites.com',
    phone: '+1 (555) 987-6543',
    address: '456 Restaurant Ave, NY 10002',
    memberSince: 'March 2023',
    status: 'Active',
    totalOrders: 1234,
  };

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
            <ProfileDropdown user={partner} type="partner" />
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-linear-to-r from-gray-800 to-gray-900 px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {partner.restaurantName.charAt(0)}
                </div>
                <div className="text-white">
                  <h1 className="text-3xl font-bold">{partner.restaurantName}</h1>
                  <p className="text-gray-300 mt-1">Owner: {partner.ownerName}</p>
                  <p className="text-gray-400 text-sm mt-1">Partner since {partner.memberSince}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {partner.status}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-8 py-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{partner.totalOrders}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Orders</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">4.8</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Rating</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">856</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Reviews</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-8 py-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Restaurant Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Email Address
                  </label>
                  <p className="text-gray-900 dark:text-white">{partner.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Phone Number
                  </label>
                  <p className="text-gray-900 dark:text-white">{partner.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Restaurant Address
                  </label>
                  <p className="text-gray-900 dark:text-white">{partner.address}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
                  Edit Restaurant Info
                </button>
                <button className="px-6 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg border-2 border-gray-300 dark:border-gray-600 transition-colors">
                  Manage Menu
                </button>
                <button className="px-6 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg border-2 border-gray-300 dark:border-gray-600 transition-colors">
                  View Orders
                </button>
                <button className="px-6 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg border-2 border-gray-300 dark:border-gray-600 transition-colors">
                  Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnerProfile;
