import React from 'react';

export default function ProfileFaqSection() {
  return (
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
            Your login email will change. You will receive all account-related communications,
            invoices, and updates about your food reels on the new address.
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
  );
}
