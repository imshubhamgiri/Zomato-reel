import React, { useState } from 'react';

export default function ProfileInfo({ user }) {
  const [isEditingData, setIsEditingData] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          Profile Information
          <span className="bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold shadow-sm">
            Premium
          </span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your personal details and preferences.</p>
      </div>

      <div className="space-y-10">
        {/* Personal Details Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Details</h2>
            <button 
              onClick={() => setIsEditingData(!isEditingData)}
              className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              {isEditingData ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Full Name
              </label>
              {isEditingData ? (
                <input 
                  type="text" 
                  defaultValue={user?.name}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              ) : (
                <p className="text-gray-900 dark:text-white font-medium text-lg">{user?.name}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Gender
              </label>
              {isEditingData ? (
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input type="radio" name="gender" className="text-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600" /> Male
                  </label>
                  <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input type="radio" name="gender" className="text-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600" /> Female
                  </label>
                </div>
              ) : (
                <p className="text-gray-900 dark:text-white font-medium text-lg">-</p>
              )}
            </div>
            {isEditingData && (
              <div className="md:col-span-2 flex justify-end">
                <button className="bg-linear-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20">
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </section>

        <div className="h-px bg-gray-100 dark:bg-gray-700 w-full" />

        {/* Contact Information Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Contact Information</h2>
          
          <div className="space-y-6">
            {/* Email */}
            <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Email Address
                </label>
                {isEditingEmail ? (
                  <div className="flex gap-3 mt-2">
                    <input 
                      type="email" 
                      defaultValue={user?.email}
                      className="w-64 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium text-sm">Save</button>
                    <button onClick={() => setIsEditingEmail(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Cancel</button>
                  </div>
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium text-lg">{user?.email}</p>
                )}
              </div>
              {!isEditingEmail && (
                <button 
                  onClick={() => setIsEditingEmail(true)}
                  className="text-sm font-medium text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Change
                </button>
              )}
            </div>

            {/* Phone */}
            <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Mobile Number
                </label>
                {isEditingPhone ? (
                  <div className="flex gap-3 mt-2">
                    <input 
                      type="tel" 
                      defaultValue={user?.phone || ''}
                      placeholder="+91"
                      className="w-64 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium text-sm">Save</button>
                    <button onClick={() => setIsEditingPhone(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Cancel</button>
                  </div>
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium text-lg">{user?.phone || 'Not added yet'}</p>
                )}
              </div>
              {!isEditingPhone && (
                <button 
                  onClick={() => setIsEditingPhone(true)}
                  className="text-sm font-medium text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {user?.phone ? 'Update' : 'Add Number'}
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="h-px bg-gray-100 dark:bg-gray-700 w-full" />

        {/* FAQs */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">FAQs & Help</h2>
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <details className="group border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/30">
              <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-gray-900 dark:text-gray-200">
                What happens when I update my email address?
                <svg className="h-5 w-5 transition-transform group-open:-rotate-180" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </summary>
              <div className="px-4 pb-4 leading-relaxed">
                Your login email will change. You'll receive all account-related communications, invoices, and updates about your food reels on the new address.
              </div>
            </details>
            <details className="group border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/30">
              <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-gray-900 dark:text-gray-200">
                How do I delete my account?
                <svg className="h-5 w-5 transition-transform group-open:-rotate-180" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </summary>
              <div className="px-4 pb-4 leading-relaxed">
                If you wish to permanently delete your food exploration profile, please contact support through the Help Center. 
              </div>
            </details>
          </div>
        </section>

      </div>
    </div>
  );
}

