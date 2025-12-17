import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ProfileDropdown from '../components/ProfileDropdown';
import axios from 'axios';
import API_URL from '../config/Api.js';

function Home() {
const [isLoggedIn, setisLoggenIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [userType] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.userType : 'user';
  });
  const [user, setuser] = useState({});
  const [videos, setVideos] = useState([]);
  const videoFeedRef = useRef(null);
  const videoRefs = useRef([]);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  

  const [isMuted, setIsMuted] = useState(true);

 useEffect(() => {
    async function getdata() {
      try {
        const response = await axios.get(`${API_URL}/api/auth/loginCheck`, {
          withCredentials: true
        });
        
        if (response.status === 200) {
          setuser({
            name: response.data.name || 'User',
            email: response.data.email || 'N/A',
            restaurantName: response.data.restaurantName || 'N/A',
            userType: response.data.userType || 'user'
          });
          localStorage.setItem(response.data.userType, JSON.stringify(response.data));
          localStorage.setItem('isLoggedIn', 'true');
          setisLoggenIn(true);
        } 
      } catch (error) {
        console.error('Error fetching user:', error.response.data); 
      }
    }
    getdata();
    
    async function fetchVideos() {

      try {
        const res = await axios.get(`${API_URL}/api/food/listfood`,{
          withCredentials: true
        });
        const foodItems = res.data.fooditems || [];
     
        const itemsWithState = foodItems.map(item => ({
            ...item,
            likeCount: item.likeCount || 0,
            saveCount: item.saveCount || 0
        }));

        setVideos(itemsWithState);
        // console.table(itemsWithState);
        // Initialize current video ID if videos exist
        if (itemsWithState.length > 0) {
            setCurrentVideoId(itemsWithState[0]._id);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    }
    fetchVideos();
  }, [isLoggedIn]);

  const handleLike = async (e, foodId) => {
    e.stopPropagation(); // Prevent video play/pause toggle
    if (!isLoggedIn) {
      
        return;
    }

    // Optimistic UI Update
    setVideos(prev => prev.map(v => {
        if (v._id === foodId) {
            const newIsLiked = !v.isLiked;
            return {
                ...v,
                isLiked: newIsLiked,
                likeCount: newIsLiked ? v.likeCount + 1 : v.likeCount - 1
            };
        }
        return v;
    }));

    try {
        await axios.post(`${API_URL}/api/actions/like`, { foodId }, { withCredentials: true });
    } catch (error) {
        console.error("Like failed:", error);
        // Revert on error
        setVideos(prev => prev.map(v => {
            if (v._id === foodId) {
                const newIsLiked = !v.isLiked;
                return {
                    ...v,
                    isLiked: newIsLiked,
                    likeCount: newIsLiked ? v.likeCount + 1 : v.likeCount - 1
                };
            }
            return v;
        }));
    }
  };

  const handleSave = async (e, foodId) => {
    e.stopPropagation(); 
    if (!isLoggedIn) {
        return;
    }

    // Optimistic UI Update
    setVideos(prev => prev.map(v => {
        if (v._id === foodId) {
            const newIsSaved = !v.isSaved;
            return {
                ...v,
                isSaved: newIsSaved,
                saveCount: newIsSaved ? v.saveCount + 1 : v.saveCount - 1
            };
        }
        return v;
    }));

    try {
        await axios.post(`${API_URL}/api/actions/save`, { foodId }, { withCredentials: true });
    } catch (error) {
        console.error("Save failed:", error);
        // Revert on error
        setVideos(prev => prev.map(v => {
            if (v._id === foodId) {
                const newIsSaved = !v.isSaved;
                return {
                    ...v,
                    isSaved: newIsSaved,
                    saveCount: newIsSaved ? v.saveCount + 1 : v.saveCount - 1
                };
            }
            return v;
        }));
    }
  };

  // ---------------------------------------------------------------------------
  // SCROLL & PLAYBACK LOGIC
  // ---------------------------------------------------------------------------
  
  /**
   * Debounce utility to limit how often the scroll handler runs.
   * This improves performance by preventing the check from running on every single pixel scroll.
   */
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
  };

  /**
   * Finds the visible video in the viewport and controls its playback.
   * - Plays the video that is most visible (centered).
   * - Pauses all other videos to save resources and prevent audio overlap.
   */
  const updateVideoPlayback = useCallback(() => {
    let foundVisibleId = null;

    videoRefs.current.forEach((videoElement) => {
        if (!videoElement) return;

        const rect = videoElement.getBoundingClientRect();
        // Check if the video is mostly centered in the viewport
        // We consider it "visible" if its top is near the top of the viewport
        const isVisible = rect.top >= -window.innerHeight / 2 && rect.bottom <= window.innerHeight * 1.5;
        
        if (isVisible) {
            // This video is visible and should be playing
            if (videoElement.paused) {
                videoElement.play().catch(e => console.log('Autoplay blocked or playback error:', e));
            }
            // Store the ID from the data attribute
            foundVisibleId = videoElement.dataset.id;
        } else {
            // This video is not visible and should be paused
            if (!videoElement.paused) {
                videoElement.pause();
            }
        }
    });

    // Update state to track the visible video's ID
    if (foundVisibleId !== null) {
        setCurrentVideoId(foundVisibleId);
    }
  }, []);

  // Effect to set up the scroll listener on the feed container
  useEffect(() => {
    const feed = videoFeedRef.current;
    if (feed && videos.length > 0) {
        // Use debounced function for performance
        const handleScroll = debounce(updateVideoPlayback, 50);
        feed.addEventListener('scroll', handleScroll);

        // Initial setup: attempt to play the first video immediately
        // We need a small timeout to ensure the DOM is ready
        setTimeout(() => {
             updateVideoPlayback();
        }, 100);

        // Cleanup function to remove listener when component unmounts or updates
        return () => {
            feed.removeEventListener('scroll', handleScroll);
        };
    }
  }, [videos, updateVideoPlayback]);


 const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  const mockPartner = {
    restaurantName: 'Delicious Bites',
    name: 'Jane Smith',
    email: 'partner@deliciousbites.com',
  };

  const currentUser = userType === 'partner' ? mockPartner : user;

  // Calculate current index for the counter
  const currentIndex = videos.findIndex(v => v._id === currentVideoId);
  const displayIndex = currentIndex !== -1 ? currentIndex + 1 : 1;

  // ---------------------------------------------------------------------------
  // STYLES (CSS Scroll Snap)
  // ---------------------------------------------------------------------------
  const customStyles = `
    .video-feed {
        scroll-snap-type: y mandatory; 
        overflow-y: scroll;
        height: 100vh;
        /* Hide scrollbar for cleaner look */
        -ms-overflow-style: none;
        scrollbar-width: none;
        scroll-behavior: smooth;
    }
    .video-feed::-webkit-scrollbar {
        display: none;
    }
    .reel-item {
        scroll-snap-align: start;
        height: 100vh;
        width: 100%;
        position: relative;
    }
  `;

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      {/* Inject custom scroll snap CSS */}
      <style>{customStyles}</style>
      {!isLoggedIn && (
        <div className="bg-white/80 h-20 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm fixed top-0 w-full z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link to="/" className="text-2xl font-bold text-red-600">
                Zomato
              </Link>
              {!isLoggedIn && <div className='text-white'>Hello You Not Logged in</div>}
              {isLoggedIn && <ProfileDropdown user={currentUser} type={userType} />}
            </div>
          </div>
        </div>
      )}

      {/* Reel View with Smooth Scrolling */}
      {isLoggedIn ? (
        videos.length > 0 ? (
        <div className="relative h-screen w-full bg-black overflow-hidden">
            
          {/* Fixed Header on Reel */}
          <div className="absolute top-0 left-0 right-0 z-30 bg-linear-to-b from-black/70 to-transparent p-4 pointer-events-none">
            <div className="flex justify-between items-center pointer-events-auto">
              <Link to="/" className="text-2xl font-bold text-white">
                Zomato
              </Link>
              <ProfileDropdown user={currentUser} type={userType} />
            </div>
          </div>

          {/* Scrollable Video Container */}
          <div 
            ref={videoFeedRef}
            className="video-feed"
          >
            {videos.map((video, index) => (
              <div 
                key={video._id} 
                className="reel-item flex items-center justify-center bg-black"
              >
                {/* Video */}
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  data-id={video._id}
                  className="h-full w-full object-cover md:object-contain"
                  src={video.video}
                  loop
                  playsInline
                  muted={isMuted} 
                  onClick={(e) => {
                    if (isMuted) {
                        setIsMuted(false);
                    } else {
                        if (e.target.paused) e.target.play();
                        else e.target.pause();
                    }
                  }}
                />

                {/* Mute Indicator */}
                {isMuted && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/40 p-4 rounded-full pointer-events-none backdrop-blur-sm animate-pulse z-10">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                  </div>
                )}

                <div className="absolute bottom-24 right-4 z-40 flex flex-col items-center gap-6">
                    {/* Like Button */}
                    <button 
                        onClick={(e) => handleLike(e, video._id)}
                        className="flex flex-col items-center gap-1 group cursor-pointer"
                    >
                        <div className={`p-3 rounded-full bg-black/20 backdrop-blur-sm transition-all ${video.isLiked ? 'text-red-500' : 'text-white group-hover:bg-black/40'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={video.isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={video.isLiked ? "0" : "2"} className="w-8 h-8 transition-transform active:scale-75">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        </div>
                        <span className="text-white text-xs font-bold drop-shadow-md">{video.likeCount}</span>
                    </button>

                    {/* Save Button */}
                    <button 
                        onClick={(e) => handleSave(e, video._id)}
                        className="flex flex-col items-center gap-1 group cursor-pointer"
                    >
                        <div className={`p-3 rounded-full bg-black/20 backdrop-blur-sm transition-all ${video.isSaved ? 'text-yellow-400' : 'text-white group-hover:bg-black/40'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={video.isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={video.isSaved ? "0" : "2"} className="w-8 h-8 transition-transform active:scale-75">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                            </svg>
                        </div>
                        <span className="text-white text-xs font-bold drop-shadow-md">{video.saveCount}</span>
                    </button>
                    
                    {/* Share Button (Placeholder) */}
                    <button className="flex flex-col items-center gap-1 group cursor-pointer">
                        <div className="p-3 rounded-full bg-black/20 backdrop-blur-sm text-white group-hover:bg-black/40 transition-all">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                            </svg>
                        </div>
                        <span className="text-white text-xs font-bold drop-shadow-md">Share</span>
                    </button>
                </div>

                {/* Video Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 z-20 bg-linear-to-t from-black/90 via-black/50 to-transparent p-6 pb-20 md:pb-8 pointer-events-none">
                  <div className="max-w-md pointer-events-auto">
                    <h2 className="text-white text-xl font-bold mb-2 flex items-center gap-2">
                     <Link to={'/profile/foodpartner/'+ video.foodPartner?._id} className="hover:underline flex items-center gap-2"> 
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      {video.foodPartner?.name || video.foodPartner?.restrauntName || 'Restaurant'}
                     </Link>
                    </h2>
                    
                    <h3 className="text-white text-2xl font-extrabold mb-2">
                      {video.name}
                    </h3>

                    <p className="text-gray-200 text-sm mb-3 line-clamp-2">
                      {video.description}
                    </p>

                    <div className="flex items-center gap-4">
                      <span className="text-green-400 text-lg font-bold">
                        ₹{video.price}
                      </span>
                      <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-semibold transition-colors cursor-pointer">
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Video Counter */}
          {/* <div className="absolute top-24 right-4 z-30 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full pointer-events-none">
            <span className="text-white text-sm font-medium">
              {displayIndex} / {videos.length}
            </span>
          </div> */}
        </div>
        ) : (
            <div className="h-screen w-full bg-black relative animate-pulse">
                {/* Skeleton Header */}
                <div className="absolute top-0 left-0 right-0 z-30 p-4 flex justify-between items-center">
                    <div className="h-8 w-24 bg-gray-800 rounded"></div>
                    <div className="h-10 w-10 bg-gray-800 rounded-full"></div>
                </div>

                {/* Skeleton Right Actions */}
                <div className="absolute bottom-24 right-4 z-40 flex flex-col items-center gap-6">
                    <div className="h-12 w-12 bg-gray-800 rounded-full"></div>
                    <div className="h-12 w-12 bg-gray-800 rounded-full"></div>
                    <div className="h-12 w-12 bg-gray-800 rounded-full"></div>
                </div>

                {/* Skeleton Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-6 pb-20 md:pb-8">
                    <div className="max-w-md space-y-4">
                        <div className="h-6 w-48 bg-gray-800 rounded"></div>
                        <div className="h-8 w-64 bg-gray-800 rounded"></div>
                        <div className="h-4 w-full max-w-xs bg-gray-800 rounded"></div>
                        <div className="flex items-center gap-4">
                            <div className="h-6 w-16 bg-gray-800 rounded"></div>
                            <div className="h-10 w-32 bg-gray-800 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
      ) : (
        /* Login/Signup View */
        <div className="flex items-center justify-center px-4 pt-20" style={{ minHeight: '100vh' }}>
          <div className="max-w-4xl w-full text-center space-y-12">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
                Welcome to <span className="text-red-600">Zomato</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover the best food & drinks in your city
              </p>
            </div>
            <div className="space-y-8">
              <div className="w-24 h-1 bg-red-600 mx-auto rounded"></div>
            </div>
            {!isLoggedIn && (
              <>
                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                          For Food Lovers
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Order your favorite meals
                        </p>
                      </div>
                      <div className="space-y-3">
                        <Link
                          to="/user/login"
                          className="block w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                        >
                          Login
                        </Link>
                        <Link
                          to="/user/register"
                          className="block w-full py-3 px-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-red-600 dark:text-red-400 font-medium rounded-lg border-2 border-red-600 dark:border-red-400 transition-colors"
                        >
                          Sign Up
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                          For Restaurants
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Grow your business with us
                        </p>
                      </div>
                      <div className="space-y-3">
                        <Link
                          to="/partner/login"
                          className="block w-full py-3 px-4 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                        >
                          Partner Login
                        </Link>
                        <Link
                          to="/partner/register"
                          className="block w-full py-3 px-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg border-2 border-gray-900 dark:border-gray-600 transition-colors"
                        >
                          Register Restaurant
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>Join thousands of food lovers and restaurant partners</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
