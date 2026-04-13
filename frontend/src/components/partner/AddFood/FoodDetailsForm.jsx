import React from 'react';

const FoodDetailsForm = ({ formData, handleInputChange, handleSubmit, loading }) => {
  return (
    <div className='bg-white dark:bg-[#31363F] p-6 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-gray-200 dark:border-gray-700/50'>
      <div className='mb-8'>
         <h3 className='text-2xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent'>
          Item Details
        </h3>
        <p className='text-sm text-gray-500 dark:text-gray-300 mt-2'>
          Fill in the details to list your food.
        </p>
      </div>

      <div className='space-y-6'>
        {/* Item Type */}
        <div>
          <label htmlFor="type" className='flex items-center gap-2 text-sm font-semibold text-black dark:text-white mb-2'>
            Item Type <span className="text-sky-500">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full bg-gray-50 dark:bg-[#222831] border border-gray-200 dark:border-gray-600 text-black dark:text-white rounded-xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 dark:focus:border-sky-500 p-3.5 outline-none transition-all shadow-sm"
            required
          >
            <option value="standard">Standard (Image)</option>
            <option value="reel">Reel (Video)</option>
          </select>
        </div>

        {/* Dish Name */}
        <div>
          <label htmlFor="name" className='flex items-center gap-2 text-sm font-semibold text-black dark:text-white mb-2'>
            Dish Name <span className="text-sky-500">*</span>
          </label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-500">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
               </svg>
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder='e.g., Crispy Butter Chicken'
              className='w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-[#222831] border border-gray-200 dark:border-gray-600 rounded-xl focus:border-sky-500 dark:focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none transition-all text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400 font-medium shadow-sm'
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className='flex items-center gap-2 text-sm font-semibold text-black dark:text-white mb-2'>
            Description <span className="text-sky-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder='Describe your dish, its ingredients, and what makes it special that your customers will love...'
            rows="4"
            className='w-full px-4 py-3.5 bg-gray-50 dark:bg-[#222831] border border-gray-200 dark:border-gray-600 rounded-xl focus:border-sky-500 dark:focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none transition-all text-black dark:text-white resize-none placeholder:text-gray-400 dark:placeholder:text-gray-400 font-medium shadow-sm'
            required
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className='flex items-center gap-2 text-sm font-semibold text-black dark:text-white mb-2'>
            Price <span className="text-sky-500">*</span>
          </label>
          <div className='relative'>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className='text-gray-500 font-bold'>₹</span>
            </div>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder='299'
              min="0"
              step="1"
              className='w-full pl-10 pr-4 py-3.5 bg-gray-50 dark:bg-[#222831] border border-gray-200 dark:border-gray-600 rounded-xl focus:border-sky-500 dark:focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none transition-all text-black dark:text-white font-bold text-lg placeholder:text-gray-400 dark:placeholder:text-gray-400 shadow-sm'
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          type='submit'
          onClick={handleSubmit}
          className='w-full mt-4 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-sky-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-600/40 transition-all duration-300 flex items-center justify-center gap-3 text-base group disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {loading ? (
            <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Publish to Menu
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FoodDetailsForm;
