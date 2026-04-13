import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileDropdown from '../components/ProfileDropdown';
import { useAppContext } from '../context/AppContext';
import { ToastContainer } from 'react-toastify';
import PartnerSidebar from '../components/partner/PartnerSidebar';
import PartnerInfo from '../components/partner/PartnerInfo';
import PartnerMenu from '../components/partner/PartnerMenu';
import usePartnerFoodItems from '../hooks/usePartnerFoodItems';

function PartnerProfile() {
  const navigate = useNavigate();
  const { user, isAuthLoading, partnerLogout } = useAppContext();
  const [activeTab, setActiveTab] = useState('profile');
  // Use our new hook for food operations
  const { 
    foodItems, 
    deleteFoodItem, 
    updateFoodItem, 
    editLoading,
    refreshFoodItems
  } = usePartnerFoodItems(user?.id, activeTab === 'menu');

  useEffect(() => {
    // Only redirect if auth loading is complete and no user was found, 
    // or if the user is not a partner
    if (!isAuthLoading) {
      if (!user) {
        navigate('/partner/login');
      } else if (user.userType !== 'partner') {
        navigate('/user/profile');
      }
    }
  }, [user, isAuthLoading, navigate]);

  const handleLogout = async () => {
    try {
      if (partnerLogout) {
        await partnerLogout();
      }
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // While checking auth state on refresh, show a nice loading screen
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading your profile...</div>
      </div>
    );
  }

  // Double check user exists before trying to render properties
  if (!user || user.userType !== 'partner') {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-linear-to-b from-stone-950 dark:via-slate-950 dark:to-black">
      {/* Header with Profile Dropdown */}
      <div className="bg-linear-to-r from-slate-600 to-slate-600 shadow-sm border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-white hover:text-red-100 transition-colors">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            <ProfileDropdown user={user} type="partner" />
          </div>
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full lg:w-1/4 shrink-0">
             <PartnerSidebar 
                partner={user} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                logout={handleLogout}
              />
          </div>

          {/* Right Content Area */}
          <div className="flex-1 bg-white/85 dark:bg-slate-900/80 backdrop-blur-sm mb-20 rounded-2xl shadow-xl shadow-red-100/40 dark:shadow-black/30 border border-red-100/60 dark:border-slate-800 min-h-[600px] overflow-hidden">
             {activeTab === 'profile' && <PartnerInfo partner={user} />}
             
             {activeTab === 'menu' && (
                <PartnerMenu 
                  fetchFoodItems={refreshFoodItems}
                  foodItems={foodItems} 
                  deleteFoodItem={deleteFoodItem}
                  updateFoodItem={updateFoodItem}
                  editLoading={editLoading}
                />
             )}

             {activeTab === 'overview' && (
                <div className="p-8 text-center text-slate-500 dark:text-slate-300 py-20 flex flex-col items-center justify-center h-full">
                  <svg className="w-20 h-20 text-red-300 dark:text-red-500/50 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Dashboard Overview</h2>
                  <p className="text-slate-500 dark:text-slate-300 max-w-sm mb-6">Get insights into your restaurant's performance, recent activity, and key metrics here.</p>
                </div>
             )}

             {activeTab === 'orders' && (
                <div className="p-8 text-center text-slate-500 dark:text-slate-300 py-20 flex flex-col items-center justify-center h-full">
                  <svg className="w-20 h-20 text-red-300 dark:text-red-500/50 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Recent Orders</h2>
                  <p className="text-slate-500 dark:text-slate-300 max-w-sm mb-6">You don't have any recent orders. Make sure your menu is up to date!</p>
                </div>
             )}

             {activeTab === 'settings' && (
                <div className="p-8 text-center text-slate-500 dark:text-slate-300 py-20 flex flex-col items-center justify-center h-full">
                  <svg className="w-20 h-20 text-red-300 dark:text-red-500/50 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Account Settings</h2>
                  <p className="text-slate-500 dark:text-slate-300 max-w-sm mb-6">Manage your restaurant configuration, hours, and delivery zones here.</p>
                </div>
             )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default PartnerProfile;
