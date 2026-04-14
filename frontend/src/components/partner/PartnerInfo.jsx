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
      <div className="bg-white/90 dark:bg-slate-900/60 rounded-3xl shadow-xl shadow-blue-900/10 dark:shadow-[#030637]/50 border border-blue-100/50 dark:border-[#430A5D]/30 overflow-hidden mb-8 backdrop-blur-xl transition-all duration-300">
        <div className="bg-[#430A5D] dark:bg-[#030637] px-8 py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl font-black text-[#430A5D] shadow-2xl uppercase border-4 border-white/20">
              {displayData?.restaurantName?.charAt(0) || displayData?.name?.charAt(0) || 'R'}
            </div>
            <div className="text-center md:text-left text-white">
              <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-white">{displayData?.restaurantName || displayData?.name}</h1>
              <p className="text-blue-100 font-semibold text-lg tracking-wide">Owner: {displayData?.name}</p>
              <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-sm transition-transform hover:scale-105 duration-300">
                  Restaurant Partner
                </span>
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-green-500/20 backdrop-blur-md border border-green-500/30 text-green-50 shadow-sm transition-transform hover:scale-105 duration-300">
                  <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                  Active Account
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-blue-100/50 dark:bg-[#430A5D]/30">
          <div className="bg-white/90 dark:bg-slate-900/80 p-8 text-center backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 transition-colors duration-300">
            <p className="text-4xl font-black text-blue-600 dark:text-blue-400">0</p>
            <p className="text-xs font-bold text-slate-400 dark:text-indigo-300 mt-2 uppercase tracking-[0.2em]">Orders</p>
          </div>
          <div className="bg-white/90 dark:bg-slate-900/80 p-8 text-center backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 transition-colors duration-300">
            <p className="text-4xl font-black text-[#430A5D] dark:text-indigo-300">?0</p>
            <p className="text-xs font-bold text-slate-400 dark:text-indigo-300 mt-2 uppercase tracking-[0.2em]">Revenue</p>
          </div>
          <div className="bg-white/90 dark:bg-slate-900/80 p-8 text-center backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 transition-colors duration-300">
            <p className="text-4xl font-black text-emerald-500 flex items-center justify-center gap-1">
              4.5 <svg className="w-6 h-6 text-emerald-500 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </p>
            <p className="text-xs font-bold text-slate-400 dark:text-indigo-300 mt-2 uppercase tracking-[0.2em]">Rating</p>
          </div>
          <div className="bg-white/90 dark:bg-slate-900/80 p-8 text-center backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 transition-colors duration-300">
            <p className="text-4xl font-black text-blue-500 dark:text-blue-300">0</p>
            <p className="text-xs font-bold text-slate-400 dark:text-indigo-300 mt-2 uppercase tracking-[0.2em]">Reviews</p>
          </div>
        </div>
      </div>
      
      {/* Contact Details Card */}
      <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-6 pl-2 tracking-tight">Contact Information</h3>
      <div className="bg-white/90 dark:bg-slate-900/60 rounded-3xl shadow-lg shadow-blue-900/5 dark:shadow-[#030637]/50 border border-blue-100/50 dark:border-[#430A5D]/30 backdrop-blur-xl p-8 mb-8 transition-all duration-300">
        {loading ? (
          <div className="flex justify-center p-8">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#430A5D] dark:border-blue-500"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-5 hover:bg-blue-50/50 dark:hover:bg-[#430A5D]/10 p-3 rounded-2xl transition-colors duration-300">
              <div className="mt-1 p-3 bg-blue-50 dark:bg-[#430A5D]/30 rounded-xl text-blue-600 dark:text-blue-300 shadow-inner">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-indigo-200/70 font-bold uppercase tracking-wider mb-1">Registered Email</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">{displayData?.email || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-5 hover:bg-blue-50/50 dark:hover:bg-[#430A5D]/10 p-3 rounded-2xl transition-colors duration-300">
              <div className="mt-1 p-3 bg-blue-50 dark:bg-[#430A5D]/30 rounded-xl text-blue-600 dark:text-blue-300 shadow-inner">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-indigo-200/70 font-bold uppercase tracking-wider mb-1">Contact Number</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">{displayData?.phone || 'Not Provided'}</p>
              </div>
            </div>
            
            {displayData?.address && (
              <div className="flex items-start gap-5 md:col-span-2 hover:bg-blue-50/50 dark:hover:bg-[#430A5D]/10 p-3 rounded-2xl transition-colors duration-300">
                <div className="mt-1 p-3 bg-blue-50 dark:bg-[#430A5D]/30 rounded-xl text-blue-600 dark:text-blue-300 shadow-inner">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-indigo-200/70 font-bold uppercase tracking-wider mb-1">Restaurant Address</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white capitalize tracking-tight leading-snug">{displayData?.address}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
