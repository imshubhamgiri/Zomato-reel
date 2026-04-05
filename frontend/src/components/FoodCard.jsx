import React from 'react';
import { Star, Clock } from 'lucide-react';

const FoodCard = ({ product }) => {
  return (
    <div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-stone-700 cursor-pointer group">
      {/* Image container */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges/Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex gap-2">
            {product.tags.slice(0, 1).map((tag, index) => (
              <span key={index} className="bg-white/90 dark:bg-stone-900/90 text-xs font-bold px-2 py-1 flex items-center rounded-md text-red-600 dark:text-red-400 shadow-xs backdrop-blur-md">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Add/Favorite button over image */}
        <button className="absolute top-3 right-3 bg-white/90 dark:bg-stone-900/90 p-1.5 rounded-full shadow-xs text-gray-400 hover:text-red-500 transition-colors backdrop-blur-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name and Rating */}
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1 flex-1 pr-2">
            {product.name}
          </h3>
          <div className="flex items-center bg-green-600 text-white px-1.5 py-0.5 rounded-md text-xs font-bold gap-1 mt-0.5 shrink-0">
            <span>{product.rating}</span>
            <Star className="w-3 h-3 fill-white" />
          </div>
        </div>

        {/* Restaurant name */}
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 line-clamp-1 mb-2.5">
          {product.restaurant}
        </p>

        {/* Delivery time and extra details */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4 font-medium">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{product.deliveryTime}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-stone-600"></div>
          <span>Free Delivery</span>
        </div>

        {/* Divider */}
        <hr className="border-gray-100 dark:border-stone-700 mb-3" />

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400 line-through">₹{product.price + 50}</span>
            <span className="font-bold text-lg text-gray-900 dark:text-white">₹{product.price}</span>
          </div>
          
          <button className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/30 px-5 py-1.5 rounded-lg font-bold transition-colors">
            ADD
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;