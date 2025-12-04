import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProfileDropdown from '../components/ProfileDropdown';
import axios from 'axios';

function Home() {
  const [isLoggedIn, setisLoggenIn] = useState(false);
  const [userType] = useState('user');
  const [user, setuser] = useState({});
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const touchStartY = useRef(0);
  const isScrolling = useRef(false);
  
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
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setisLoggenIn(false);
      }
    }
    getdata();

    async function fetchVideos() {
      try {
        const res = await axios.get('http://localhost:3000/api/food/listfood');
        const foodItems = res.data.fooditems || [];
        setVideos(foodItems);
        console.table(foodItems);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    }
    fetchVideos();
  }, []);

  // Play video when it comes into view
  useEffect(() => {
    if (videoRefs.current[currentVideoIndex]) {
      videoRefs.current[currentVideoIndex].play();
    }
    
    // Pause other videos
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentVideoIndex) {
        video.pause();
      }
    });
  }, [currentVideoIndex]);

  // Handle wheel scroll for desktop
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      
      if (!isScrolling.current && videos.length > 0) {
        isScrolling.current = true;
        
        if (e.deltaY > 0 && currentVideoIndex < videos.length - 1) {
          setCurrentVideoIndex(prev => prev + 1);
        } else if (e.deltaY < 0 && currentVideoIndex > 0) {
          setCurrentVideoIndex(prev => prev - 1);
        }
        
        setTimeout(() => {
          isScrolling.current = false;
        }, 600);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [currentVideoIndex, videos.length]);

  // Handle touch scroll for mobile
  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (!isScrolling.current && videos.length > 0) {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY.current - touchEndY;

        if (Math.abs(diff) > 50) {
          isScrolling.current = true;

          if (diff > 0 && currentVideoIndex < videos.length - 1) {
            setCurrentVideoIndex(prev => prev + 1);
          } else if (diff < 0 && currentVideoIndex > 0) {
            setCurrentVideoIndex(prev => prev - 1);
          }

          setTimeout(() => {
            isScrolling.current = false;
          }, 600);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [currentVideoIndex, videos.length]);
  
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

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header with Profile Dropdown */}
      {!isLoggedIn && (
        <div className="bg-white/80 h-20 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link to="/" className="text-2xl font-bold text-red-600">
                Zomato
              </Link>
              {isLoggedIn && <div className='text-white'>Hello You are Logged in</div>}
              {isLoggedIn && <ProfileDropdown user={currentUser} type={userType} />}
            </div>
          </div>
        </div>
      )}

      {/* Reel View with Smooth Scrolling */}
      {isLoggedIn && videos.length > 0 ? (
        <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black">
          {/* Fixed Header on Reel */}
          <div className="absolute top-0 left-0 right-0 z-30 bg-linear-to-b from-black/70 to-transparent p-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-2xl font-bold text-white">
                Zomato
              </Link>
              <ProfileDropdown user={currentUser} type={userType} />
            </div>
          </div>

          {/* Scrollable Video Container */}
          <div 
            className="relative h-full w-full transition-transform duration-500 ease-out"
            style={{ 
              transform: `translateY(-${currentVideoIndex * 100}vh)` 
            }}
          >
            {videos.map((video, index) => (
              <div 
                key={video._id} 
                className="relative h-screen w-full flex items-center justify-center snap-start"
              >
                {/* Video */}
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  className="h-full w-full object-cover md:object-contain"
                  src={video.video}
                  loop
                  playsInline
                  preload=''
                  onClick={() => {
                    const videoEl = videoRefs.current[index];
                    if (videoEl.paused) {
                      videoEl.play();
                    } else {
                      videoEl.pause();
                    }
                  }}
                />

                {/* Video Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 z-20 bg-linear-to-t from-black/90 via-black/50 to-transparent p-6 pb-8">
                  <div className="max-w-md">
                    <h2 className="text-white text-xl font-bold mb-2 flex items-center gap-2">
                     <Link to={'/profile/foodpartner/'+ video.foodPartner?._id}> <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      
                      {video.foodPartner?.name || video.foodPartner?.restrauntName || 'Restaurant'}</Link>
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
                      <Link className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-semibold transition-colors">
                        Order Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute right-4 bottom-32 z-30 flex flex-col items-center gap-2 animate-bounce">
            <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="text-white/70 text-xs">Swipe</span>
          </div>

          {/* Video Counter */}
          <div className="absolute top-24 right-4 z-30 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-white text-sm font-medium">
              {currentVideoIndex + 1} / {videos.length}
            </span>
          </div>
        </div>
      ) : (
        /* Login/Signup View */
        <div className="flex items-center justify-center px-4" style={{ minHeight: isLoggedIn ? 'calc(100vh - 64px)' : '100vh' }}>
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
