import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileDropdown from '../components/ProfileDropdown';
import ProfileSidebar from '../components/user-profile/ProfileSidebar';
import ProfileInfo from '../components/user-profile/ProfileInfo';
import { useAppContext } from '../context/AppContext';
import AddressInfo from '../components/user-profile/AddressInfo';
import SavedFoodsTab from '../components/user-profile/SavedFoodsTab';

function UserProfile() {
  const navigate = useNavigate();
  const { user, isAuthLoading } = useAppContext();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // Only redirect if auth loading is complete and no user was found
    if (!isAuthLoading && !user) {
      navigate('/user/login');
    }
  }, [user, isAuthLoading, navigate]);

  // While checking auth state on refresh, show a nice loading screen
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-emerald-50 via-white to-cyan-50 dark:from-stone-950 dark:via-slate-950 dark:to-black">
        <div className="text-slate-600 dark:text-slate-300">Loading your profile...</div>
      </div>
    );
  }

  // Double check user exists before trying to render properties
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-linear-to-b from-stone-950 dark:via-slate-950 dark:to-black">
      {/* Header with Profile Dropdown */}
      <div className="bg-linear-to-r from-white/90 to-emerald-50/80 dark:from-stone-900/90 dark:to-slate-950/90 backdrop-blur-xl shadow-sm border-b border-emerald-100/70 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            <ProfileDropdown user={user} type="user" />
          </div>
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full lg:w-1/4 shrink-0">
             <ProfileSidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Right Content Area */}
          <div className="flex-1 bg-white/85 dark:bg-slate-900/80 backdrop-blur-sm mb-20 rounded-2xl shadow-xl shadow-blue-100/40 dark:shadow-black/30 border border-blue-100/60 dark:border-slate-800 min-h-[600px] overflow-hidden">
             {activeTab === 'profile' && <ProfileInfo user={user} />}
             
             {activeTab === 'orders' && (
                <div className="p-8 text-center text-slate-500 dark:text-slate-300 py-20 flex flex-col items-center justify-center h-full">
                  <svg className="w-20 h-20 text-blue-300 dark:text-blue-500/50 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">My Orders</h2>
                  <p className="text-slate-500 dark:text-slate-300 max-w-sm mb-6">You haven't placed any orders yet. Discover some amazing food!</p>
                  <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-linear-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-white/25 transition-all">
                      Browse Food
                    </button>
                </div>
             )}
             
             {activeTab === 'saved' && (
                <SavedFoodsTab />
             )}
             
             {activeTab === 'addresses' && (
               <AddressInfo />
             )}
             
             {activeTab === 'payments' && (
                <div className="p-8 text-center text-slate-500 dark:text-slate-300 py-20 flex flex-col items-center justify-center h-full">
                  <svg className="w-20 h-20 text-blue-300 dark:text-blue-500/50 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Methods</h2>
                  <p className="text-slate-500 dark:text-slate-300 max-w-sm">Manage your saved cards, UPI, and other payment options for a faster checkout experience.</p>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

