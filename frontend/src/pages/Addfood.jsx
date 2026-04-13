import React, { useState } from 'react'
import { ToastContainer, Flip, toast } from 'react-toastify';
import { foodAPI } from '../services/api'
import AddFoodHeader from '../components/partner/AddFood/AddFoodHeader';
import MediaUpload from '../components/partner/AddFood/MediaUpload';
import FoodDetailsForm from '../components/partner/AddFood/FoodDetailsForm';

const Addfood = () => {
  const [mediaPreview, setMediaPreview] = useState(null)
  const [loading, setloading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    type: 'standard',
    media: null
  })

  const handleMediaChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, media: file })
      const mediaURL = URL.createObjectURL(file)
      setMediaPreview(mediaURL)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name || !formData.description || !formData.price || (!formData.media && !mediaPreview)) {
      toast.error('Please fill all required fields including media.');
      return;
    }

    setloading(true)
    const submitData = new FormData()
    submitData.append('name', formData.name)
    submitData.append('description', formData.description)
    submitData.append('price', formData.price)
    submitData.append('type', formData.type)
    if (formData.media) {
      submitData.append('media', formData.media)
    }
      console.log('Submitting form with data:', submitData.get('name'), submitData.get('description'), submitData.get('price'), submitData.get('type'), submitData.get('media'))
    foodAPI.addFood(submitData)
      .then(() => {  
        setFormData({
          name: '',
          description: '',
          price: '',
          type: 'standard',
          media: null
        })
        toast.success('Dish added successfully!');
        setMediaPreview(null)
      })
      .catch(error => {
        console.error('Error submitting form:', error)
        toast.error('Failed to add dish. Please try again.');
      }).finally(() => {
        setloading(false)
      })
  }

  return (
    <>
      <div className='min-h-screen pb-30 bg-gray-50 dark:bg-[#222831] font-sans text-black dark:text-white selection:bg-sky-500/30 transition-colors duration-300'>
        <AddFoodHeader />
    
        <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16'>
          <div className='max-w-4xl mx-auto'>
            {/* Header section */}
            <div className='text-center mb-10'>
              <h2 className='text-3xl md:text-4xl font-black mb-4 text-black dark:text-white tracking-tight'>
                Showcase Your <span className="text-sky-500">Culinary Magic</span>
              </h2>
              <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed'>
                Upload stunning photos or engaging reels of your dishes, write mouth-watering descriptions, and bring more hungry customers to your business.
              </p>
            </div>

            <form onSubmit={handleSubmit} className='grid lg:grid-cols-2 gap-8'>
              <MediaUpload 
                formData={formData} 
                videoPreview={mediaPreview} 
                onMediaChange={handleMediaChange} 
              />
              <FoodDetailsForm 
                formData={formData} 
                handleInputChange={handleInputChange} 
                handleSubmit={handleSubmit} 
                loading={loading} 
              />
            </form>

            <div className='mt-12 text-center'>
              <p className='text-gray-500 dark:text-gray-400 text-sm'>
                Need help with menus? <a href="#" className='text-sky-500 font-medium hover:text-blue-500 dark:hover:text-sky-400 hover:underline transition-colors'>View Best Practices</a>
              </p>
            </div>
          </div>
        </main>
      </div>
      
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
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
