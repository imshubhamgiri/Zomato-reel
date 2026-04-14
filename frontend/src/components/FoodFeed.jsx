import React from 'react';
import { ArrowRight } from 'lucide-react';
import { products } from '../data/products';
import FoodCard from './FoodCard';

const FoodFeed = () => {
  return (
    <section className="py-12 md:py-20 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8 md:mb-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Trending <span className="text-red-500">Deliciousness</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg font-medium max-w-2xl">
              Explore the most loved dishes right now. Freshly curated from top restaurants near you.
            </p>
          </div>
          
          <button className="hidden sm:flex items-center gap-2 text-red-500 font-bold hover:text-red-600 transition-colors bg-red-50 dark:bg-red-500/10 px-5 py-2.5 rounded-full">
            See all
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Grid Section */}
         <div className="grid grid-rows-2 grid-flow-col gap-4 overflow-x-auto pb-6 snap-x snap-mandatory md:grid-rows-none md:grid-flow-row md:grid-cols-3 lg:grid-cols-4 md:gap-8 auto-cols-[calc(50%-8px)] sm:auto-cols-[calc(33.333%-16px)] md:auto-cols-auto" style={{ scrollbarWidth: 'none' }}>
          {products.map((product) => (
            <div key={product.id} className="snap-start h-full">
              <FoodCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile See All Button */}
        <div className="mt-8 flex justify-center sm:hidden">
          <button className="flex items-center gap-2 text-red-500 font-bold bg-red-50 dark:bg-red-500/10 px-8 py-3 rounded-full hover:bg-red-100 transition-colors w-full justify-center">
            View All Trending Foods
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default FoodFeed;