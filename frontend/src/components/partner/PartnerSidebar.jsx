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
      <div className="bg-white/90 dark:bg-slate-900/60 rounded-3xl p-6 shadow-xl shadow-blue-900/10 dark:shadow-[#030637]/60 border border-blue-100/50 dark:border-[#430A5D]/30 backdrop-blur-xl flex items-center gap-4 transition-all duration-300">
        <div className="w-16 h-16 rounded-full bg-blue-700 dark:bg-[#430A5D] flex items-center justify-center text-white text-2xl font-black uppercase shadow-inner">
          {partner?.restaurantName?.charAt(0) || 'R'}
        </div>
        <div>
          <p className="text-xs text-blue-500 dark:text-indigo-300 font-bold uppercase tracking-widest mb-1">Partner</p>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white truncate max-w-[150px] tracking-tight">{partner?.restaurantName || partner?.name}</h2>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white/90 dark:bg-slate-900/60 rounded-3xl shadow-xl shadow-blue-900/10 dark:shadow-[#030637]/60 border border-blue-100/50 dark:border-[#430A5D]/30 overflow-hidden backdrop-blur-xl transition-all duration-300">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className={`${groupIdx !== 0 ? 'border-t border-blue-100/50 dark:border-[#430A5D]/30' : ''}`}>
            <h3 className="px-6 py-4 text-[11px] font-extrabold text-slate-400 dark:text-indigo-300/80 uppercase tracking-[0.2em] bg-blue-50/50 dark:bg-slate-800/40">
              {group.title}
            </h3>
            <div className="flex flex-col">
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-4 px-6 py-4 transition-all duration-300 text-left hover:bg-blue-50 dark:hover:bg-[#430A5D]/20 group ${
                      isActive 
                        ? 'bg-blue-50 dark:bg-[#430A5D] dark:text-white border-r-4 border-[#030637] dark:border-blue-400 shadow-md' 
                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-200'
                    }`}
                  >
                    <svg 
                      className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110 text-blue-200 dark:text-white' : 'text-slate-400 group-hover:text-blue-500 dark:group-hover:text-indigo-300 group-hover:scale-110'}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={item.icon} />
                    </svg>
                    <span className={`text-sm ${isActive ? 'font-bold tracking-wide' : 'font-semibold tracking-wide'}`}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        
        {/* Logout */}
        <div className="border-t border-blue-100/50 dark:border-[#430A5D]/30">
          <button 
            onClick={logout}
            className="flex items-center gap-4 px-6 py-4 w-full text-left text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-[#430A5D]/10 hover:text-red-500 dark:hover:text-red-400 transition-all duration-300 group">
            <svg className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-semibold tracking-wide group-hover:font-bold">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}