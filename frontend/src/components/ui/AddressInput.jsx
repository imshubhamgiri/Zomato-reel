import { Eye } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import FormInput from './FormInput';

const AddressInput = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    pincode: '',
    locality: '',
    line1: '',
    city: '',
    state: '',
    landmark: '',
    alternatePhone: '',
    label: 'HOME', // Home or Work
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || '',
        phone: initialData.phone || '',
        pincode: initialData.postalCode || '',
        locality: initialData.locality || '',
        line1: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        landmark: initialData.landmark || '',
        alternatePhone: initialData.alternatePhone || '',
        label: initialData.label || 'HOME',
      });
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUseCurrentLocation = () => {
    // Get user's current geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // You can reverse geocode the coordinates to get address
          console.log('Location:', position.coords);
          // This would typically call a reverse geocoding API
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.fullName || !formData.phone || !formData.line1 || !formData.city || !formData.state || !formData.pincode) {
      alert('Please fill all required fields');
      return;
    }
    onSave(formData);
  };

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'NY', 'CA', 'TX'
  ];

  return (
    <div className='bg-white dark:bg-gray-950 rounded-lg p-8 shadow-lg max-w-2xl mx-auto'>
      {/* Header */}
      <h2 className='text-lg font-bold text-blue-600 mb-6'>{initialData ? 'EDIT ADDRESS' : 'ADD A NEW ADDRESS'}</h2>

      {/* Use Current Location Button */}
      <button
        onClick={handleUseCurrentLocation}
        className='w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 mb-8 transition-colors'
      >
        <Eye size={18} />
        Use my current location
      </button>

      {/* Form Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6'>
        {/* Name */}
        <FormInput
          label='Name'
          placeholder='Name'
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
        />

        {/* Phone */}
        <FormInput
          label='Phone'
          type='tel'
          placeholder='10-digit mobile number'
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
        />

        {/* Pincode */}
        <FormInput
          label='Pincode'
          placeholder='Pincode'
          value={formData.pincode}
          onChange={(e) => handleInputChange('pincode', e.target.value)}
        />

        {/* Locality */}
        <FormInput
          label='Locality'
          placeholder='Locality'
          value={formData.locality}
          onChange={(e) => handleInputChange('locality', e.target.value)}
        />
      </div>

      {/* Address (Full Width) */}
      <div className='mb-6'>
        <label className='block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2'>
          Address (Area and Street)
        </label>
        <textarea
          placeholder='Address (Area and Street)'
          value={formData.line1}
          onChange={(e) => handleInputChange('line1', e.target.value)}
          rows='3'
          className='w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none'
        />
      </div>

      {/* City and State */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6'>
        {/* City */}
        <FormInput
          label='City/District/Town'
          placeholder='City/District/Town'
          value={formData.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
        />

        {/* State Dropdown */}
        <div>
          <label className='block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2'>
            State
          </label>
          <select
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className='w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all'
          >
            <option value=''>--Select State--</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Landmark and Alternate Phone */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6'>
        {/* Landmark */}
        <FormInput
          label='Landmark (Optional)'
          placeholder='Landmark (Optional)'
          value={formData.landmark}
          onChange={(e) => handleInputChange('landmark', e.target.value)}
        />

        {/* Alternate Phone */}
        <FormInput
          label='Alternate Phone (Optional)'
          type='tel'
          placeholder='Alternate Phone (Optional)'
          value={formData.alternatePhone}
          onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
        />
      </div>

      {/* Address Type Radio Buttons */}
      <div className='mb-8'>
        <label className='block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3'>
          Address Type
        </label>
        <div className='flex items-center gap-6'>
          <label className='flex items-center gap-3 cursor-pointer'>
            <input
              type='radio'
              name='addressType'
              value='HOME'
              checked={formData.label === 'HOME'}
              onChange={(e) => handleInputChange('label', e.target.value)}
              className='w-5 h-5 text-blue-600 cursor-pointer'
            />
            <span className='text-gray-900 dark:text-gray-300'>Home</span>
          </label>
          <label className='flex items-center gap-3 cursor-pointer'>
            <input
              type='radio'
              name='addressType'
              value='WORK'
              checked={formData.label === 'WORK'}
              onChange={(e) => handleInputChange('label', e.target.value)}
              className='w-5 h-5 text-blue-600 cursor-pointer'
            />
            <span className='text-gray-900 dark:text-gray-300'>Work</span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <button
          onClick={handleSave}
          className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors'
        >
          SAVE
        </button>
        <button
          onClick={onCancel}
          className='flex-1 sm:flex-auto text-blue-600 hover:text-blue-700 font-bold py-3 transition-colors'
        >
          CANCEL
        </button>
      </div>
    </div>
  );
};

export default AddressInput;
