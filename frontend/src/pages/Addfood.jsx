import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer,Flip, toast } from 'react-toastify';
import API_URL from '../config/Api.js';
const Addfood = () => {
  const [videoPreview, setVideoPreview] = useState(null)
  const [loading, setloading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    video: null
  })

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, video: file })
      const videoURL = URL.createObjectURL(file)
      setVideoPreview(videoURL)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setloading(true)
    const submitData = new FormData()
    submitData.append('name', formData.name)
    submitData.append('description', formData.description)
    submitData.append('price', formData.price)
    if (formData.video) {
      submitData.append('video', formData.video)
    }

    axios.post(`${API_URL}/api/food/add`, submitData, {
      withCredentials: true,
    })
      .then(() => {  
        setFormData({
          name: '',
          description: '',
          price: '',
          video: null
        })
        toast.success('Dish added successfully!');
        setVideoPreview(null)
      })
      .catch(error => {
        console.error('Error submitting form:', error)
        toast.error('Failed to add dish. Please try again.');
      }).finally(() => {
        setloading(false)
      })
  }

  return (<>
    <div className='min-h-screen dark:bg-linear-to-br from-gray-900 via-gray-800 to-black' >

      <div className="dark:bg-gray-900/90 backdrop-blur-md shadow-2xl sticky top-0 z-10 border-b border-red-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <Link to="/partner/profile" className="inline-flex items-center text-black dark:text-red-500 hover:text-red-400 font-bold text-lg transition-all hover:gap-3 gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Profile
            </Link>
            <h1 className="text-2xl font-black bg-black dark:bg-linear-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Add New Dish
            </h1>
          </div>
        </div>
      </div>

  
      <div className='flex justify-center items-start py-12 px-4'>
        <div className='w-full max-w-5xl'>
          <form onSubmit={handleSubmit} className='dark:bg-gray-800 border rounded-3xl shadow-2xl overflow-hidden border-gray-700' style={{ backgroundImage: 'url(https://assets.clevelandclinic.org/transform/LargeFeatureImage/5912aac1-d867-42b3-a2e0-d1263a1a35b8/fastFoods1-1199461884-770x533-1_jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
           
            <div className='bg-linear-to-r from-blue-100 to-cyan-100 dark:bg-linear-to-r dark:from-red-600 dark:via-orange-600 dark:to-pink-600 p-8 text-white'>
              <h2 className='text-3xl font-black mb-2 text-black/55 dark:text-white'>Upload Your Delicious Creation</h2>
              <p className='text-black/55 dark:text-red-50'>Share your culinary masterpiece with the world</p>
            </div>

            <div className='p-8 md:p-12 grid md:grid-cols-2 gap-8'>
             
              <div className='space-y-6'>
                <div>
                  <label className='flex items-center gap-2 text-sm font-bold text-black dark:text-gray-100 mb-3 '>
                    <svg className="w-5 h-5 text-black dark:text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    Upload Video *
                  </label>
                  <div className='relative'>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className='hidden'
                      id='video-upload'
                      required
                    />
                    <label
                      htmlFor='video-upload'
                      className='flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-red-500/50 rounded-2xl cursor-pointer bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900 hover:border-red-500 transition-all duration-300 group'
                    >
                      {videoPreview ? (
                        <div className='relative w-full h-full'>
                          <video
                            src={videoPreview}
                            className='w-full h-full object-cover rounded-2xl'
                            controls
                          />
                          <div className='absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold'>
                            Change Video
                          </div>
                        </div>
                      ) : (
                        <div className='text-center p-6'>
                          <svg className="w-16 h-16 text-blue-300 dark:text-red-500 mx-auto mb-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className='text-lg font-bold dark:text-red-500 mb-2'>Click to upload video</p>
                          <p className='text-sm text-black/55 dark:text-gray-400'>MP4, MOV, AVI (MAX. 100MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                  <p className='text-xs text-gray-400 mt-2'>Upload a short video showcasing your dish</p>
                </div>
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
                    value={formData.name}
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
                    value={formData.description}
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
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder='299'
                      min="0"
                      step="1"
                      className='w-full pl-10 pr-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all text-white font-bold text-lg placeholder:text-gray-500'
                      required
                    />
                  </div>
                </div>

                <button
                  disabled={loading}
                  type='submit'
                  className='w-full bg-linear-to-r from-blue-600 to-blue-300 hover:from-blue-700 hover:to-green-700 text-white font-black py-4 px-6 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-3 text-lg 
                  group disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-400 disabled:shadow-none disabled:hover:shadow-none disabled:cursor-not-allowed disabled:opacity-75'
                >{loading ? ( 
                  <svg className="animate-spin w-6 h-6 mr-3 size-5 text-white  " viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Add to Menu
                  </>
                )}
                </button>
              </div>
            </div>
          </form>
          <div className='mt-8 text-center'>
            <p className='text-gray-400 text-sm'>
              Need help? <a href="#" className='text-red-500 font-semibold hover:text-red-400 hover:underline transition-colors'>View Guidelines</a>
            </p>
          </div>
        </div>
      </div>
    </div>
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      transition={Flip}
    />
  </>
  )
}

export default Addfood
