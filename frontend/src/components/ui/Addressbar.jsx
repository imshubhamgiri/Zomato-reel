import { EllipsisVertical } from 'lucide-react'
import React from 'react'
//  label?: AddressLabel;
//     fullName?: string;
//     phone?: string;
//     line1?: string;
//     city?: string;
//     state?: string;
//     postalCode?: string;
//     country?: string;
//     landmark?: string;
//     isDefault?: boolean;
const Addressbar = ({
    label,
    fullName,
    phone,
    country,
    landmark,
    isDefault,
    state,
    city,
    line1,
    postalCode,
    className,
    onDelete
}) => {
    return (
        <div className={`bg-white/70 dark:bg-gray-900/70 border border-gray-300  dark:border-gray-700 rounded-xl p-6 ${className}`}>
            <div className='flex justify-between items-center '>
                <div className='font-bold text-[12px] p-[2px] bg-gray-200 text-stone-500'>{label || 'HOME'}</div>
                <div><EllipsisVertical size={23} className='text-gray-400 ' onClick={onDelete}  /> </div>
            </div>
            {/* name and phone */}
            <div className='flex items-center gap-4 py-3'>
                <p className='font-medium text-gray-900 dark:text-white'>{fullName || 'John Doe'}</p>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{phone || '+1 (555) 123-4567'}</p>
            </div>

            {/* address details  should be written like this - PD House, Mouna banganj , daldali bazar, Chapra, Bihar - 841301*/}
            <div className='text-sm flex gap-2'>
                <p className='text-gray-600 dark:text-gray-400'>{line1 || '123 Main St'}</p>
                <p className='text-gray-600 dark:text-gray-400'>{city || 'New York'}, {state || 'NY'} - {postalCode || '10001'}</p>
                <p className='text-gray-600 dark:text-gray-400'>{country || 'United States'}</p>
                {landmark && (
                    <p className='text-gray-600 dark:text-gray-400'>Near {landmark}</p>
                )}
            </div>
        </div>
    )
}

export default Addressbar
