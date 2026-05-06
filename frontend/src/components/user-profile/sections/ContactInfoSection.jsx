import React from 'react';
import FormInput from '../../ui/FormInput';
import Skeleton from '../../ui/Skeleton';

export default function ContactInfoSection({
  isEditingEmail,
  isEditingPhone,
  formData,
  isSaving,
  isLoading = false,
  onStartEmailEdit,
  onStartPhoneEdit,
  onCancelEmail,
  onCancelPhone,
  onChangeField,
  onSaveEmail,
  onSavePhone,
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Contact Information</h2>

      <div className="space-y-6">
        <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
          <div>
            {isEditingEmail ? (
              <div className="flex gap-3 mt-2 items-end">
                <FormInput
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => onChangeField('email', e.target.value)}
                  className="w-64"
                />
                <button
                  disabled={isSaving}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium text-sm disabled:opacity-60"
                  onClick={onSaveEmail}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={onCancelEmail} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Cancel</button>
              </div>
            ) : (
              <>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Email Address
                </label>
                {isLoading ? (
                  <Skeleton height="h-7" width="w-64" />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium text-lg">{formData.email || '-'}</p>
                )}
              </>
            )}
          </div>
          {!isEditingEmail ? (
            <button
              onClick={onStartEmailEdit}
              className="text-sm font-medium text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Change
            </button>
          ) : null}
        </div>

        <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
          <div>
            {isEditingPhone ? (
              <div className="flex gap-3 mt-2 items-end">
                <FormInput
                  label="Mobile Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => onChangeField('phone', e.target.value)}
                  placeholder="+91"
                  className="w-64"
                />
                <button
                  disabled={isSaving}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium text-sm disabled:opacity-60"
                  onClick={onSavePhone}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={onCancelPhone} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Cancel</button>
              </div>
            ) : (
              <>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Mobile Number
                </label>
                {isLoading ? (
                  <Skeleton height="h-7" width="w-40" />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium text-lg">{formData.phone || 'Not added yet'}</p>
                )}
              </>
            )}
          </div>
          {!isEditingPhone ? (
            <button
              onClick={onStartPhoneEdit}
              className="text-sm font-medium text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {formData.phone ? 'Update' : 'Add Number'}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
