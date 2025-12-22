import React, { use, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileDropdown from '../components/ProfileDropdown';
import { authAPI } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import API_URL from '../config/Api';
function PartnerProfile() {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [foodItems, setFoodItems] = useState([]);
  const [formdata, setFormdata] = useState({});
  const [error, setError] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [edit, setEdit] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        const response = await authAPI.checkAuth();
        if (response.userType !== 'partner') {
          navigate('/user/profile');
          return;
        }
        setPartner(response);
      } catch (error) {
        console.error('Error fetching partner data:', error);
        navigate('/partner/login');
      } finally {
        setLoading(false);
      }
    };
    fetchPartnerData();


  }, [navigate]);



  useEffect(() => {
    let id;
    if (partner && partner.id) {
      id = partner.id;

    } else {
      return;
    }
    try {
      const fetchFoodItems = async () => {
        const response = await axios.get(`${API_URL}/api/food/getfood/${id}`, {
          withCredentials: true
        });
        setFoodItems(response.data.fooditems || []);
      }
      fetchFoodItems();
    } catch (error) {
      console.error('Error fetching food items:', error);
      setError(error.message || 'Failed to fetch food items.');

    }
  }, [partner]);

  function handleEdit(foodId) {
    setEdit(foodId);
    const food = foodItems.find(item => item._id === foodId);
    setFormdata({id: food._id, name: food.name, description: food.description, price: food.price });
    // console.log(foodItems.find(item => item._id === foodId));
    console.log('Editing food item:', formdata);
    setTimeout(() => {
      const element = document.querySelector('.EditVideo');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  
  }

  function handleCancelEdit() {
    setEdit(null);
    const menu = document.getElementById('managemenu');
    setTimeout(() => {
      if (menu) {
        menu.scrollIntoView({ behavior: 'smooth' });
      }

    }, 100);
  }

 const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function deleteVideo(foodId) {
    axios.delete(`${API_URL}/api/food/delete`, {
      data: { foodId },
      withCredentials: true
    }).then(() => {
      setFoodItems(prevItems => prevItems.filter(item => item._id !== foodId));
      toast.success('Food item deleted successfully');
    }).catch(error => {
      console.error('Error deleting food item:', error);
      toast.error('Failed to delete food item');
    });
  }

  function handlesubmit(e){
    e.preventDefault();
    console.log(formdata)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!partner) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Profile Dropdown */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            <ProfileDropdown user={partner} type="partner" />
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-linear-to-r from-gray-800 to-gray-900 px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {partner.restaurantName.charAt(0)}
                </div>
                <div className="text-white">
                  <h1 className="text-3xl font-bold">{partner.restaurantName}</h1>
                  <p className="text-gray-300 mt-1">Owner: {partner.name}</p>
                  <p className="text-gray-400 text-sm mt-1">Restaurant Partner</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-8 py-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">0</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Orders</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">5.0</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Rating</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">0</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Reviews</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-8 py-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Restaurant Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Email Address
                  </label>
                  <p className="text-gray-900 dark:text-white">{partner.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Phone Number
                  </label>
                  <p className="text-gray-900 dark:text-white">{partner.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Restaurant Address
                  </label>
                  <p className="text-gray-900 dark:text-white">{partner.address}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
                  Edit Restaurant Info
                </button>
                <button className="px-6 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg border-2 border-gray-300 dark:border-gray-600 transition-colors">
                  Manage Menu
                </button>
                <button className="px-6 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg border-2 border-gray-300 dark:border-gray-600 transition-colors">
                  View Orders
                </button>
                <button className="px-6 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg border-2 border-gray-300 dark:border-gray-600 transition-colors">
                  Analytics
                </button>
                <Link to={'/partner/addfood'} className='px-6 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg border-2 border-gray-300 dark:border-gray-600 transition-colors'>
                  Add Food
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manage Menu Section */}
      <div className="px-8 py-8   space-y-6 text-white" id='managemenu'>
        <div className='w-fit bg-black border-b border-gray-700 p-3 m-auto'>
          Manage Menu
        </div>
        <div className='grid md:grid-cols-3 gap-6'>
          {!foodItems.length && <p className='text-white'>No food items found. Please add some food items to display here.</p>}
          {foodItems.map((item) => (
            <div key={item._id} className="group bg-white relative overflow-hidden h-fit dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
              <video
                className="w-full  h-80 object-cover"
                src={item.video}
                poster={item.image}
                type="video/mp4"
                // ref={el => videoRefs.current[item._id] = el}
                preload="metadata"
                playsInline
                loop
              />
              <button
                onMouseEnter={() => setOpenDropdown(item._id)}
                onMouseLeave={() => setOpenDropdown(null)}
                // onClick={() => setOpenDropdown((prev) => prev === item._id ? null : item._id)}
                className="absolute  opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-3 right-3 p-2 rounded-full bg-black bg-opacity-60 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-red-500"
                type="button">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
                {openDropdown === item._id && (
                  <div className='absolute bg-gray-900 text-white rounded-md p-2 -top-20 right-0 w-24 flex flex-col gap-2 z-10'>
                    <div className='px-2 py-1 hover:bg-red-700 rounded text-sm'
                      onClick={() => { setDeleteConfirm(item._id); setOpenDropdown(null); }}>
                      Delete
                    </div>
                    <div className='px-2 py-1 hover:bg-gray-700 rounded text-sm'
                      onClick={() => { handleEdit(item._id); setOpenDropdown(null); }}>
                      Edit
                    </div>
                  </div>
                )}
              </button>
              <h3 className="text-lg z-2 font-semibold text-gray-900 dark:text-white">{item.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
              <p className="text-red-600 dark:text-red-400 font-bold">₹{item.price}</p>
            </div>
          ))}
        </div>
      </div>

      {deleteConfirm && (
        <div className='fixed inset-0  bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md mx-4 '>
            <div className='flex items-center justify-center mb-4'>
              <div className='w-14 h-14 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center'>
                <svg className='w-7 h-7 text-red-600 dark:text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                </svg>
              </div>
            </div>
            <h3 className='text-xl font-bold text-gray-900 dark:text-white text-center mb-2'>
              Delete Food Item?
            </h3>
            <p className='text-gray-600 dark:text-gray-400 text-center text-sm mb-6'>
              Are you sure? This action cannot be undone.
            </p>
            <div className='flex gap-3'>
              <button
                onClick={() => setDeleteConfirm(null)}
                className='flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-medium'
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteVideo(deleteConfirm);
                  setDeleteConfirm(null);
                }}
                className='flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {edit && (
        <div className=' EditVideo   bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md mx-4 '>
            <h3 className='text-xl font-bold text-gray-900 dark:text-white text-center mb-2'>
              Edit Food Item {edit}
            </h3>
            <form action="" className='my-2' onSubmit={handlesubmit}>
              <div>
              <video
                src={foodItems.find(item => item._id === edit)?.video}
                className='w-full h-70 object-fit rounded-2xl'
                controls
              />
              </div>
               <div className='space-y-6'>
                {/* Food Name */}
                <div>
                  <label htmlFor="name" className='flex items-center gap-2 text-sm font-bold text-black dark:text-gray-500 mb-3'>
                    <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formdata?.name}
                    onChange={handleInputChange}
                    placeholder='e.g., Butter Chicken'
                    className='w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all text-white font-medium placeholder:text-gray-500'
                    required
                  />
                </div>

              
                <div>
                  <label htmlFor="description" className='flex items-center gap-2 text-sm font-bold text-black dark:text-gray-500 mb-3'>
                    <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formdata?.description}
                    onChange={handleInputChange}
                    placeholder='Describe your dish, ingredients, and what makes it special...'
                    rows="4"
                    className='w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all text-white resize-none placeholder:text-gray-500'
                    required
                  />
                </div>

               
                <div>
                  <label htmlFor="price" className='flex items-center gap-2 text-sm font-bold text-black dark:text-gray-500 mb-3'>
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    Price (₹) *
                  </label>
                  <div className='relative'>
                    <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg'>₹</span>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formdata?.price}
                      onChange={handleInputChange}
                      placeholder='299'
                      min="0"
                      step="1"
                      className='w-full pl-10 pr-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all text-white font-bold text-lg placeholder:text-gray-500'
                      required
                    />
                  </div>
                </div>
                </div>
                <button type='submit' className='w-full my-3 h-10 rounded-xl bg-black text-white px-3 py-1 bg-opacity-20'
                 >Submit</button>
            </form>
            <button className='text-center bg-black p-3 text-white' onClick={handleCancelEdit}>cancel</button>
          </div>
        </div>
      )}
      {/* {edit && scrolltoEdit()} */}
      <ToastContainer />
    </div>
  );
}

export default PartnerProfile;
