import React from 'react';

export default function ProfileSidebar({ user, activeTab, setActiveTab }) {
  const menuGroups = [
    {
      title: 'Dashboard',
      items: [
        { id: 'profile', label: 'Profile Information', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
      ]
    },
    {
      title: 'Food & Orders',
      items: [
        { id: 'orders', label: 'My Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
        { id: 'saved', label: 'Saved Reels & Foods', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
      ]
    },
    {
      title: 'Account Settings',
      items: [
        { id: 'addresses', label: 'Manage Addresses', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z' },
        { id: 'payments', label: 'Payment Methods', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white/85 dark:bg-slate-900/75 rounded-2xl p-6 shadow-lg shadow-blue-100 dark:shadow-black/30 border border-blue-100/70 dark:border-slate-700 backdrop-blur-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-slate-600 flex items-center justify-center text-white text-2xl font-bold uppercase ">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-300 font-medium uppercase tracking-wider mb-1">Hello,</p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{user?.name}</h2>
        </div>
      </div>

      <div className="bg-white/85 dark:bg-slate-900/75 rounded-2xl shadow-lg shadow-sky-200 dark:shadow-black/30 border border-blue-100/70 dark:border-slate-700 overflow-hidden backdrop-blur-sm">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className={`${groupIdx !== 0 ? 'border-t border-blue-100 dark:border-slate-700' : ''}`}>
            <h3 className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest bg-blue-50/50 dark:bg-slate-800/60">
              {group.title}
            </h3>
            <div className="flex flex-col">
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-4 px-6 py-4 transition-all duration-200 text-left hover:text-white hover:bg-blue-600 dark:hover:bg-sky-800 group ${
                      isActive
                        ? 'dark:bg-gray-800 bg-blue-500 text-white border-r-4 border-blue-500'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 transition-colors ${isActive ? 'text-emerald-500' : 'text-slate-400 group-hover:text-emerald-400'}`}
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

        <div className="border-t border-emerald-100 dark:border-slate-700">
          <button className="flex items-center gap-4 px-6 py-4 w-full text-left text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group">
            <svg className="w-5 h-5 text-slate-400 group-hover:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
