import React, { useState, useEffect } from 'react';
import { partnerAPI } from '../../services/api';

export default function PartnerInfo({ partner }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (partner?.id) {
        try {
          const res = await partnerAPI.getProfile(partner.id);
          if (res.success && res.data) {
            setProfileData(res.data);
          }
        } catch (error) {
          console.error("Failed to fetch partner profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfile();
  }, [partner?.id]);

  if (!partner) return null;

  // Use fetched profile data if available, fallback to basic auth context data
  const displayData = profileData || partner;

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
        <div className="bg-linear-to-r from-sky-900 to-sky-700 px-8 py-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-red-600 shadow-xl uppercase">
              {displayData?.restaurantName?.charAt(0) || displayData?.name?.charAt(0) || 'R'}
            </div>
            <div className="text-center md:text-left text-white">
              <h1 className="text-3xl font-bold mb-2">{displayData?.restaurantName || displayData?.name}</h1>
              <p className="text-red-100 font-medium">Owner: {displayData?.name}</p>
              <div className="mt-3 flex items-center justify-center md:justify-start gap-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md border border-white/30 text-white">
                  Restaurant Partner
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 backdrop-blur-md border border-green-500/30 text-green-50">
                  <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                  Active Account
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 dark:bg-gray-700">
          <div className="bg-white dark:bg-gray-800 p-6 text-center">
            <p className="text-3xl font-black text-red-600 dark:text-red-400">0</p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">Orders</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 text-center">
            <p className="text-3xl font-black text-orange-500 dark:text-orange-400">?0</p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">Revenue</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 text-center">
            <p className="text-3xl font-black text-green-500 flex items-center justify-center gap-1">
              4.5 <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">Rating</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 text-center">
            <p className="text-3xl font-black text-blue-500">0</p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">Reviews</p>
          </div>
        </div>
      </div>
      
      {/* Contact Details Card */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h3>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
        {loading ? (
          <div className="flex justify-center p-4">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-red-50 dark:bg-gray-700 rounded-lg text-red-600 dark:text-red-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Registered Email</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{displayData?.email || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-red-50 dark:bg-gray-700 rounded-lg text-red-600 dark:text-red-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Contact Number</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{displayData?.phone || 'Not Provided'}</p>
              </div>
            </div>
            
            {displayData?.address && (
              <div className="flex items-start gap-4 md:col-span-2">
                <div className="mt-1 p-2 bg-red-50 dark:bg-gray-700 rounded-lg text-red-600 dark:text-red-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Restaurant Address</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{displayData?.address}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
