import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import usePartnerFoodItems from '../../hooks/usePartnerFoodItems';
export default function PartnerMenu({ partner }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [edit, setEdit] = useState(null);
  const [formdata, setFormdata] = useState({});

  const { 
    foodItems, 
    deleteFoodItem, 
    updateFoodItem, 
    editLoading,
    refreshFoodItems
  } = usePartnerFoodItems(partner?.id, true);


  const handleEdit = (foodId) => {
    setEdit(foodId);
    const food = foodItems.find(item => item._id === foodId);
    if (food) {
      setFormdata({
        foodId: food._id,
        name: food.name,
        description: food.description,
        price: food.price 
      });
      setTimeout(() => {
        const element = document.querySelector('.EditVideo');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };
  const handleCancelEdit = () => {
    setEdit(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormdata(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateFoodItem(formdata);
    if (result.success) {
      setEdit(null);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deleteFoodItem(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className='p-6'>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Manage Menu Items</h2>
        <Link 
          to="/partner/addfood" 
          className="inline-flex items-center px-5 py-2.5 bg-[#430A5D] text-white font-bold tracking-wide rounded-xl hover:bg-blue-800 transition-all duration-300 shadow-lg shadow-blue-900/20 dark:shadow-[#030637]/50 hover:shadow-xl hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add New Item
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="managemenu">
        {foodItems.map((item) => (
          <div key={item._id} className="bg-white/90 dark:bg-slate-900/80 rounded-2xl shadow-lg shadow-blue-900/5 dark:shadow-[#030637]/50 border border-blue-100/50 dark:border-[#430A5D]/30 p-5 space-y-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-inner">
              {item.type === 'standard' ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <video src={item.video} className="w-full h-full object-cover" controls />
              )}
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs font-medium text-white uppercase tracking-wider">
                {item.type || 'Media'}
              </div>
            </div>

            <div className="relative">
              <button 
                onClick={() => setOpenDropdown(openDropdown === item._id ? null : item._id)}
                className="absolute top-0 right-0 p-2 text-slate-400 hover:text-blue-600 dark:hover:text-[#430A5D] hover:bg-blue-50 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>

              {openDropdown === item._id && (
                <div className='absolute bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl p-2 -top-10 right-10 w-28 flex flex-col gap-1 z-10 shadow-xl border border-slate-100 dark:border-slate-700'>
                  <div className='px-3 py-2 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-lg text-sm font-semibold cursor-pointer transition-colors'
                    onClick={() => { setDeleteConfirm(item._id); setOpenDropdown(null); }}>
                    Delete
                  </div>
                  <div className='px-3 py-2 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 dark:hover:text-blue-300 rounded-lg text-sm font-semibold cursor-pointer transition-colors'
                    onClick={() => { handleEdit(item._id); setOpenDropdown(null); }}>
                    Edit
                  </div>
                </div>
              )}

              <div className="pr-10">
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white truncate tracking-tight">{item.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mt-2 leading-relaxed">{item.description}</p>
                <p className="text-blue-600 dark:text-[#430A5D] font-black text-lg mt-3">₹{item.price}</p>
              </div>
            </div>
          </div>
        ))}

        {foodItems.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
            No food items found. Start by adding some to your menu!
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className='fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all'>
          <div className='bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-sm w-full border border-red-100 dark:border-red-900/30'>
            <div className='mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-50 dark:bg-red-900/20 mb-6 shadow-inner'>
              <svg className='h-10 w-10 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
              </svg>
            </div>
            <h3 className='text-2xl font-extrabold text-center text-slate-800 dark:text-white mb-3 tracking-tight'>Delete Item?</h3>
            <p className='text-center text-slate-500 dark:text-slate-400 mb-10 text-sm font-medium'>This action cannot be undone and will remove it from your live menu.</p>
            <div className='flex gap-4'>
              <button 
                onClick={() => setDeleteConfirm(null)}
                className='flex-1 px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition-all'
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className='flex-1 px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-500/30'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {edit && (
        <div className='EditVideo fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto transition-all'>
          <div className='bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-blue-900/20 p-10 max-w-lg w-full my-auto border border-blue-50 dark:border-[#430A5D]/50'>
            <h3 className='text-2xl font-extrabold text-slate-800 dark:text-white text-center mb-8 tracking-tight'>Edit Food Item</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-indigo-300 uppercase tracking-widest mb-2">Item Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formdata.name || ''} 
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-indigo-300 uppercase tracking-widest mb-2">Description</label>
                <textarea 
                  name="description" 
                  value={formdata.description || ''} 
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-indigo-300 uppercase tracking-widest mb-2">Price (₹)</label>
                <input 
                  type="number" 
                  name="price" 
                  value={formdata.price || ''} 
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                  required
                />
              </div>
              
              <div className="flex gap-4 pt-6">
                <button 
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 px-5 py-3 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-bold tracking-wide"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 px-5 py-3 bg-[#430A5D] text-white rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 font-bold tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}