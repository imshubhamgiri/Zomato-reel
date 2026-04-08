import React from 'react';
import FormInput from '../ui/FormInput';

export default function PersonalDetailsSection({
  isEditing,
  formData,
  isSaving,
  onToggleEdit,
  onChangeField,
  onSave,
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Details</h2>
        <button
          onClick={onToggleEdit}
          className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
        <div>
          {isEditing ? (
            <FormInput
              label="Full Name"
              value={formData.name}
              onChange={(e) => onChangeField('name', e.target.value)}
            />
          ) : (
            <>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Full Name
              </label>
              <p className="text-gray-900 dark:text-white font-medium text-lg">{formData.name || '-'}</p>
            </>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Gender
          </label>
          {isEditing ? (
            <div className="flex gap-4 mt-2 flex-wrap">
              {['Male', 'Female', 'Other'].map((option) => (
                <label key={option} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={formData.gender === option}
                    onChange={(e) => onChangeField('gender', e.target.value)}
                    className="text-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  {option}
                </label>
              ))}
            </div>
          ) : (
            <p className="text-gray-900 dark:text-white font-medium text-lg">{formData.gender || '-'}</p>
          )}
        </div>

        {isEditing ? (
          <div className="md:col-span-2 flex justify-end">
            <button
              disabled={isSaving}
              className="bg-linear-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-60"
              onClick={onSave}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
