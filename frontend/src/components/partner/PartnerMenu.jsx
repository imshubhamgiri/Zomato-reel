import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
export default function PartnerMenu({ 
  fetchFoodItems,
  foodItems, 
  deleteFoodItem, 
  updateFoodItem,
  editLoading 
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [edit, setEdit] = useState(null);
  const [formdata, setFormdata] = useState({});
 const{user} = useAppContext();
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
  useEffect(() => {
    if (fetchFoodItems && user?.id) {
       fetchFoodItems();
    }
  }, [fetchFoodItems, user?.id]);
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
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Menu Items</h2>
        <Link 
          to="/partner/addfood" 
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Item
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="managemenu">
        {foodItems.map((item) => (
          <div key={item._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
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
                className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>

              {openDropdown === item._id && (
                <div className='absolute bg-gray-900 text-white rounded-md p-2 -top-10 right-8 w-24 flex flex-col gap-2 z-10 shadow-xl'>
                  <div className='px-2 py-1 hover:bg-red-700 rounded text-sm cursor-pointer'
                    onClick={() => { setDeleteConfirm(item._id); setOpenDropdown(null); }}>
                    Delete
                  </div>
                  <div className='px-2 py-1 hover:bg-gray-700 rounded text-sm cursor-pointer'
                    onClick={() => { handleEdit(item._id); setOpenDropdown(null); }}>
                    Edit
                  </div>
                </div>
              )}

              <div className="pr-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{item.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mt-1">{item.description}</p>
                <p className="text-red-600 dark:text-red-400 font-bold mt-2">₹{item.price}</p>
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
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-sm w-full'>
            <div className='mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-6'>
              <svg className='h-8 w-8 text-red-600 dark:text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-center text-gray-900 dark:text-white mb-2'>Delete Item?</h3>
            <p className='text-center text-gray-500 dark:text-gray-400 mb-8'>This action cannot be undone.</p>
            <div className='flex gap-4'>
              <button 
                onClick={() => setDeleteConfirm(null)}
                className='flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition'
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className='flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {edit && (
        <div className='EditVideo fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto'>
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-lg w-full my-auto'>
            <h3 className='text-xl font-bold text-gray-900 dark:text-white text-center mb-6'>Edit Food Item</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formdata.name || ''} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea 
                  name="description" 
                  value={formdata.description || ''} 
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                <input 
                  type="number" 
                  name="price" 
                  value={formdata.price || ''} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                  required
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-70"
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