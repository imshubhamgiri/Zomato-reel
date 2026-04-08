import React, { useEffect, useState } from 'react';
import PersonalDetailsSection from './profile/PersonalDetailsSection';
import ContactInfoSection from './profile/ContactInfoSection';
import ProfileFaqSection from './profile/ProfileFaqSection';
import useUserProfileForm from '../hooks/useUserProfileForm';

export default function ProfileInfo({ user }) {
  const [isEditingData, setIsEditingData] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const {
    formData,
    isLoadingProfile,
    isSaving,
    errorMessage,
    setField,
    resetFields,
    fetchProfile,
    saveProfile,
  } = useUserProfileForm(user);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSavePersonal = async () => {
    const result = await saveProfile(['name', 'gender']);
    if (result.ok) {
      setIsEditingData(false);
    }
  };

  const handleSaveEmail = async () => {
    const result = await saveProfile(['email']);
    if (result.ok) {
      setIsEditingEmail(false);
    }
  };

  const handleSavePhone = async () => {
    const result = await saveProfile(['phone']);
    if (result.ok) {
      setIsEditingPhone(false);
    }
  };

  const handleCancelPersonal = () => {
    resetFields(['name', 'gender']);
    setIsEditingData(false);
  };

  const handleCancelEmail = () => {
    resetFields(['email']);
    setIsEditingEmail(false);
  };

  const handleCancelPhone = () => {
    resetFields(['phone']);
    setIsEditingPhone(false);
  };

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
        {isLoadingProfile ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">Fetching latest profile...</div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
            {errorMessage}
          </div>
        ) : null}

        <PersonalDetailsSection
          isEditing={isEditingData}
          formData={formData}
          isSaving={isSaving}
          onToggleEdit={() => (isEditingData ? handleCancelPersonal() : setIsEditingData(true))}
          onChangeField={setField}
          onSave={handleSavePersonal}
        />

        <div className="h-px bg-gray-100 dark:bg-gray-700 w-full" />

        <ContactInfoSection
          isEditingEmail={isEditingEmail}
          isEditingPhone={isEditingPhone}
          formData={formData}
          isSaving={isSaving}
          onStartEmailEdit={() => setIsEditingEmail(true)}
          onStartPhoneEdit={() => setIsEditingPhone(true)}
          onCancelEmail={handleCancelEmail}
          onCancelPhone={handleCancelPhone}
          onChangeField={setField}
          onSaveEmail={handleSaveEmail}
          onSavePhone={handleSavePhone}
        />

        <div className="h-px bg-gray-100 dark:bg-gray-700 w-full" />

        <ProfileFaqSection />

      </div>
    </div>
  );
}

