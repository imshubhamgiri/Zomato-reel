import React from 'react';

export default function PartnerSidebar({ partner, activeTab, setActiveTab, logout }) {
  const menuGroups = [
    {
      title: 'Dashboard',
      items: [
        { id: 'profile', label: 'Restaurant Info', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { id: 'overview', label: 'Overview', icon: 'M4 6h16M4 12h16M4 18h16' },
      ]
    },
    {
      title: 'Menu & Operations',
      items: [
        { id: 'menu', label: 'Manage Menu', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
        { id: 'orders', label: 'Recent Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
      ]
    },
    {
      title: 'Account Settings',
      items: [
        { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Restaurant Info Card */}
      <div className="bg-white/85 dark:bg-slate-900/75 rounded-2xl p-6 shadow-lg shadow-blue-100 dark:shadow-black/30 border border-blue-100/70 dark:border-slate-700 backdrop-blur-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-red-600 dark:bg-red-800 flex items-center justify-center text-white text-2xl font-bold uppercase ">
          {partner?.restaurantName?.charAt(0) || 'R'}
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-300 font-medium uppercase tracking-wider mb-1">Partner,</p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{partner?.restaurantName || partner?.name}</h2>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white/85 dark:bg-slate-900/75 rounded-2xl shadow-lg shadow-red-100 dark:shadow-black/30 border border-red-100/70 dark:border-slate-700 overflow-hidden backdrop-blur-sm">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className={`${groupIdx !== 0 ? 'border-t border-red-100 dark:border-slate-700' : ''}`}>
            <h3 className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest bg-red-50/50 dark:bg-slate-800/60">
              {group.title}
            </h3>
            <div className="flex flex-col">
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-4 px-6 py-4 transition-all duration-200 text-left hover:text-white hover:bg-red-600 dark:hover:bg-red-800 group ${
                      isActive 
                        ? 'dark:bg-gray-800 bg-red-500 text-white border-r-4 border-red-500' 
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <svg 
                      className={`w-5 h-5 transition-colors ${isActive ? 'text-red-200' : 'text-slate-400 group-hover:text-red-200'}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={item.icon} />
                    </svg>
                    <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        
        {/* Logout */}
        <div className="border-t border-red-100 dark:border-slate-700">
          <button 
            onClick={logout}
            className="flex items-center gap-4 px-6 py-4 w-full text-left text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-colors group">
            <svg className="w-5 h-5 text-slate-400 group-hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}