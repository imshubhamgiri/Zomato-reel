import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ProfileDropdown from '../components/ProfileDropdown';
import axios from 'axios';

function Home() {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [isLoggedIn, setisLoggenIn] = useState(false);
  const [userType] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.userType : 'user';
  });
  const [user, setuser] = useState({});
  const [videos, setVideos] = useState([]);
  
  // Refs for scrolling and video management
  const videoFeedRef = useRef(null);
  const videoRefs = useRef([]);
  
  // Track the currently active video ID for UI updates (like the counter)
  const [currentVideoId, setCurrentVideoId] = useState(null);

  // ---------------------------------------------------------------------------
  // DATA FETCHING
  // ---------------------------------------------------------------------------
  useEffect(() => {
    async function getdata() {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/loginCheck', {
          withCredentials: true
        });
        
        if (response.status === 200) {
          setisLoggenIn(true);
          console.table(response.data);
          
          setuser({
            name: response.data.name || 'User',
            email: response.data.email || 'N/A',
            restaurantName: response.data.restaurantName || 'N/A',
            userType: response.data.userType || 'user'
          });
          localStorage.setItem(response.data.userType, JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setisLoggenIn(false);
      }
    }
    getdata();

    async function fetchVideos() {
      try {
        const res = await axios.get('http://localhost:3000/api/food/list',{
          withCredentials: true
        });
        const foodItems = res.data.fooditems || [];
        setVideos(foodItems);
        console.table(foodItems);
        // Initialize current video ID if videos exist
        if (foodItems.length > 0) {
            setCurrentVideoId(foodItems[0]._id);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    }
    fetchVideos();
  }, []);

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


  // ---------------------------------------------------------------------------
  // MOCK DATA & HELPERS
  // ---------------------------------------------------------------------------
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

      {/* Header with Profile Dropdown (Only shown when NOT logged in) */}
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
      {isLoggedIn && videos.length > 0 ? (
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
                  muted={false} // Allow sound by default
                  onClick={(e) => {
                    // Toggle play/pause on click
                    if (e.target.paused) {
                      e.target.play();
                    } else {
                      e.target.pause();
                    }
                  }}
                />

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
          <div className="absolute top-24 right-4 z-30 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full pointer-events-none">
            <span className="text-white text-sm font-medium">
              {displayIndex} / {videos.length}
            </span>
          </div>
        </div>
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
