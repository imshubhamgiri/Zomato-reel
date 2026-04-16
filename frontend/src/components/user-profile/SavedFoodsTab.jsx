import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { profileAPI } from '../../services/api';

export default function SavedFoodsTab() {
  const [savedFoods, setSavedFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSavedFoods = async () => {
      try {
        setIsLoading(true);
        const response = await profileAPI.getSavedFoods();
        setSavedFoods(response.data || []);
      } catch (err) {
        console.error('Failed to fetch saved foods', err);
        setError('Failed to load saved foods. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedFoods();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 text-slate-500 dark:text-slate-300">Loading saved foods...</div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      </div>
    );
  }

  if (!savedFoods.length) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-300 py-20 flex flex-col items-center justify-center h-full">
        <svg className="w-20 h-20 text-blue-300 dark:text-blue-500/50 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Saved Reels & Foods</h2>
        <p className="text-slate-500 dark:text-slate-300 max-w-sm">You have not saved anything yet. Start exploring and save your favorites.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Saved Reels & Foods</h2>
        <p className="text-slate-500 dark:text-slate-300 mt-1">Your saved list, newest first.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {savedFoods.map((savedItem) => {
          const food = savedItem.food;
          return (
            <article key={savedItem.saveId} className="rounded-2xl overflow-hidden border border-blue-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-40 bg-slate-100 dark:bg-slate-800">
                {food.image ? (
                  <img src={food.image} alt={food.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-400">No image</div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-1">{food.name}</h3>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Rs {food.price}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{food.description}</p>
                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  Saved on {new Date(savedItem.savedAt).toLocaleDateString()}
                </div>
                <div className="mt-4">
                  <Link
                    to={`/profile/foodpartner/${food.foodPartner}`}
                    className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    View Restaurant
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
