import { EllipsisVertical } from 'lucide-react'
import React, { useState } from 'react'

const Addressbar = ({
    id,
    label,
    fullName,
    phone,
    country,
    address,
    landmark,
    isDefault,
    state,
    city,
    locality,
    postalCode,
    className,
    onDelete,
    onEdit
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleEditClick = () => {
        onEdit({
            id,
            label,
            fullName,
            phone,
            locality,
            address,
            city,
            state,
            postalCode,
            country,
            landmark,
            isDefault
        });
        setIsMenuOpen(false);
    };

    const handleDeleteClick = () => {
        onDelete(id);
        setIsMenuOpen(false);
    };

    return (
        <div className={`bg-white/70 dark:bg-gray-900/70 border border-gray-300 hover:border-blue-400  dark:border-gray-700 rounded-xl p-6 ${className}`}>
            <div className='flex justify-between items-center '>
                <div className='font-bold text-0.5 p-0.5 bg-gray-200 text-stone-500'>{label || 'HOME'}</div>
                <div className='relative'>
                    <EllipsisVertical 
                        size={23} 
                        className='text-gray-400 cursor-pointer hover:text-gray-600' 
                        onClick={handleMenuClick}
                    />
                    {isMenuOpen && (
                        <div className='absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10'>
                            <button
                                onClick={handleEditClick}
                                className='w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors'
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                className='w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-200 dark:border-gray-600'
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {/* name and phone */}
            <div className='flex items-center gap-4 py-3'>
                <p className='font-medium text-gray-900 dark:text-white'>{fullName || 'John Doe'}</p>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{phone || '+1 (555) 123-4567'}</p>
            </div>

            {/* address details  should be written like this - PD House, Mouna banganj , daldali bazar, Chapra, Bihar - 841301*/}
            <div className='text-sm flex gap-2'>
                <p className='text-gray-600 dark:text-gray-400'>{address || ''}</p>
                <p className='text-gray-600 dark:text-gray-400'>{locality || ''}</p>
                <p className='text-gray-600 dark:text-gray-400'>{city || 'New '}, {state || ''} - {postalCode || ''}</p>
                <p className='text-gray-600 dark:text-gray-400'>{country || 'India'}</p>
                {landmark && (
                    <p className='text-gray-600 dark:text-gray-400'>Near {landmark}</p>
                )}
            </div>
        </div>
    )
}

export default Addressbar
