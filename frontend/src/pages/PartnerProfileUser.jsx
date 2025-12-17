import React, { useState, useEffect , useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../config/Api.js'

const PartnerProfileUser = () => {
  const { id } = useParams();
  const [partnerProfile, setPartnerProfile] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const videoRefs = useRef({});

  useEffect(() => {
    const fetchPartnerProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/profile/foodpartner/${id}`);
        setPartnerProfile(response.data);
      } catch (error) {
        console.error('Error fetching partner profile:', error);
      }
    };

    const fetchFoodItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/food/getfood/${id}`,{
          withCredentials: true
        });
        // const partnerFoods = response.data.fooditems?.filter(item => item.foodPartner._id === id) || [];
        setFoodItems(response.data.fooditems || []);
      } catch (error) {
        console.error('Error fetching food items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerProfile();
    fetchFoodItems();
  }, [id]);

  const handleVideoClick = (itemId) => {
    const videoElement = videoRefs.current[itemId];
    if(!videoElement) return;

    if (itemId === playingVideoId) {
      videoElement.pause();
      setPlayingVideoId(null);
    } else {
      
      if (playingVideoId && videoRefs.current[playingVideoId]) {
        videoRefs.current[playingVideoId].pause();
      }
      videoElement.play();
      setPlayingVideoId(itemId);
    }
  };

  const VideoSkeleton = () => (
    <div className="relative aspect-9/16 bg-linear-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-2xl overflow-hidden shadow-lg">
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 dark:via-gray-600/50 to-transparent animate-shimmer"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg sticky top-0 z-10 border-b border-red-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <Link to="/" className="inline-flex items-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold text-lg transition-all hover:gap-3 gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>

    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {partnerProfile ? (
          <>
            
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden mb-10">
             
              <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-r from-red-500 via-orange-500 to-pink-500 opacity-20 dark:opacity-30"></div>
              
              <div className="relative p-6 md:p-10">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                 
                  <div className="shrink-0 relative group">
                    <div className="absolute inset-0 bg-linear-to-br from-red-400 to-orange-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative w-28 h-28 md:w-40 md:h-40 rounded-full bg-linear-to-br from-red-500 via-orange-500 to-pink-500 flex items-center justify-center text-white text-5xl md:text-6xl font-black shadow-2xl ring-4 ring-white dark:ring-gray-700">
                      {(partnerProfile.restaurantName || partnerProfile.restrauntName || partnerProfile.name || 'R')[0].toUpperCase()}
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-block px-4 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-semibold mb-3">
                      Partner Restaurant
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-3 bg-linear-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
                      {partnerProfile.restaurantName || partnerProfile.restrauntName || 'Restaurant'}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                      <svg className="w-5 h-5 text-orange-500 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        Chef {partnerProfile.name}
                      </p>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <p className="text-gray-600 dark:text-gray-300">
                        {partnerProfile.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-10 pt-8 border-t-2 border-red-100 dark:border-gray-700">
                  <div className="bg-linear-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl p-5 text-center hover:scale-105 transition-transform">
                    <div className="text-4xl font-black text-red-600 dark:text-red-400 mb-2">
                      {foodItems.length}
                    </div>
                    <div className="text-sm font-semibold text-red-800 dark:text-red-300">Menu Items</div>
                  </div>
                  <div className="bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-5 text-center hover:scale-105 transition-transform">
                    <div className="text-4xl font-black text-orange-600 dark:text-orange-400 mb-2">
                      {foodItems.length * 15}
                    </div>
                    <div className="text-sm font-semibold text-orange-800 dark:text-orange-300">Meals Served</div>
                  </div>
                  <div className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-5 text-center hover:scale-105 transition-transform">
                    <div className="text-4xl font-black text-green-600 dark:text-green-400 mb-2">
                      {foodItems.length * 8}
                    </div>
                    <div className="text-sm font-semibold text-green-800 dark:text-green-300">Customers</div>
                  </div>
                  <div className="bg-linear-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-2xl p-5 text-center hover:scale-105 transition-transform">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <div className="text-4xl font-black text-yellow-600 dark:text-yellow-400">4.5</div>
                      <svg className="w-6 h-6 text-yellow-500 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">Rating</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="p-3 bg-linear-to-br from-red-500 to-orange-500 rounded-xl shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                  </div>
                  <span className="bg-linear-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">Menu Videos</span>
                </h2>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full font-semibold text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  {foodItems.length} Videos
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, index) => (
                    <VideoSkeleton key={index} />
                  ))}
                </div>
              ) : foodItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {foodItems.map((item) => (
                    <div key={item._id} 
                    onClick={() => handleVideoClick(item._id)}
                    className="group relative aspect-9/16 bg-black dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer ring-2 ring-transparent hover:ring-red-500 dark:hover:ring-red-400">
                      <video
                        className="w-full h-full object-cover"
                        src={item.video}
                        poster={item.image}
                        type="video/mp4"
                        ref={el => videoRefs.current[item._id] = el}
                        preload="metadata"
                        playsInline
                        loop
                      />
                      
                     
                      <div className="absolute top-3 right-3 px-3 py-1 bg-red-600 dark:bg-red-500 text-white rounded-full text-xs font-bold shadow-lg z-10">
                        ₹{item.price}
                      </div>
                      
                      <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <div className="bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/20 dark:border-white/10">
                            <h3 className="text-white font-black text-lg mb-2 line-clamp-1">
                              {item.name}
                            </h3>
                            <p className="text-gray-200 dark:text-gray-300 text-xs mb-3 line-clamp-2">
                              {item.description}
                            </p>
                            <button className="w-full py-2 bg-linear-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 dark:from-red-500 dark:to-orange-500 dark:hover:from-red-600 dark:hover:to-orange-600 text-white rounded-full text-sm font-bold transition-all shadow-lg">
                              Order Now
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-20 h-20 bg-red-600/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
                          <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border-2 border-dashed border-red-200 dark:border-gray-700">
                  <div className="w-24 h-24 mx-auto mb-6 bg-linear-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-red-400 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-xl font-bold mb-2">No videos uploaded yet</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm">Check back later for delicious content!</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="animate-pulse">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shimmer Animation CSS */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}

export default PartnerProfileUser
