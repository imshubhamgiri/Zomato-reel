import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import VideoCard from '../components/ui/VideoCard';
import { foodAPI, useractions } from '../services/api'
import { useAppContext } from '../context/AppContext'

const Reel = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAuthLoading } = useAppContext();
  const [videos, setVideos] = useState([]);
  const videoFeedRef = useRef(null);
  const videoRefs = useRef([]);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [emptyStateMessage, setEmptyStateMessage] = useState('Loading reels...');
  const cursor = useRef('default');
  const hasMore = useRef(true);
  const isLoading = useRef(false);

  const getVideos = async (isInitialRequest = false) => {
    if (!hasMore.current || isLoading.current) return;
    const hadVideos = videos.length > 0;
    isLoading.current = true;
    if (isInitialRequest) {
      setIsInitialLoading(true);
      setEmptyStateMessage('Loading reels...');
    }

    const param = new URLSearchParams({
      limit: 2,
      ...(cursor.current?.id && { id: cursor.current.id }),
      ...(cursor.current?.lastCreatedAt && { lastCreatedAt: cursor.current.lastCreatedAt })
    });

    await foodAPI.getAllFoods(param).then((res) => {
      setVideos((prev) => {
        // Prevent duplicate videos if overlapping calls happen
        const existingIds = new Set(prev.map(v => v._id));
        const newVideos = (res.data || []).filter(v => !existingIds.has(v._id)); // Filter out duplicates
        return [...prev, ...newVideos];
      });
      hasMore.current = res.pagination.hasMore;
      cursor.current = res.pagination.nextCursor;
      const fooditems = res.data || [];
      if (fooditems.length > 0 && !currentVideoId) {
        setCurrentVideoId(fooditems[0]._id);
        setEmptyStateMessage('');
      }

      if (isInitialRequest && fooditems.length === 0) {
        setEmptyStateMessage('No reels available right now. Please check back in a few minutes.');
      }
    }).catch((err) => {
      console.error("Error fetching videos:", err);
      if (!hadVideos) {
        setEmptyStateMessage('We could not load reels right now. Please try again.');
      }
    }).finally(() => {
      isLoading.current = false;
      if (isInitialRequest) {
        setIsInitialLoading(false);
      }
    });
  }

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      getVideos(true);
    }
  }, [isAuthLoading, isAuthenticated])

  const handleLike = async (e, foodId) => {
    e.stopPropagation(); // Prevent video play/pause toggle
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
      await useractions.likeFood(foodId);
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
      await useractions.saveFood(foodId);
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

  useEffect(() => {
    if (videos.length === 0) return;

    const options = {
      root: videoFeedRef.current,
      threshold: [0, 0.5, 0.7, 1.0],
      rootMargin: '-10% 0px -10% 0px'
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;


          if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
            // Video is 70% visible - play it
            video.play().catch(e => console.log('Autoplay blocked:', e));
            setCurrentVideoId(video.dataset.id);
          } else {
            if (!video.paused) {
              video.pause();
            }
          }
        });
      }, options);


    videoRefs.current.forEach((video) => {
      if (video) {
        observer.observe(video);
      }
    });

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = videoFeedRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        getVideos();
      }
    };

    // Attach scroll listener for infinite scrolling 
    const currentScrollRef = videoFeedRef.current;
    if (currentScrollRef) { // Check if ref is available
      currentScrollRef.addEventListener('scroll', handleScroll);
    }

    return () => {  // Cleanup observer and event listener on unmount or when videos change
      videoRefs.current.forEach((video) => {
        if (video) {
          observer.unobserve(video);
        }
      });
      observer.disconnect();
      if (currentScrollRef) {
        currentScrollRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [videos]);

  const handleOrderNow = (video) => {
    navigate('/checkout', {
      state: {
        food: {
          _id: video._id,
          name: video.name,
          description: video.description,
          price: video.price,
          image: video.image,
          video: video.video,
          partnerName: video.foodPartner?.name,
          partnerId: video.foodPartner?._id,
        },
      },
    });
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 '>
      <div className='relative h-screen w-full bg-black overflow-hidden'>
        {isInitialLoading && videos.length === 0 ? (
          <div className="h-full w-full px-4 py-6 flex flex-col gap-4 animate-pulse">
            <div className="h-[70vh] rounded-2xl bg-zinc-800/80" />
            <div className="space-y-3 px-2">
              <div className="h-6 w-2/3 rounded bg-zinc-700/80" />
              <div className="h-4 w-full rounded bg-zinc-700/60" />
              <div className="h-4 w-4/5 rounded bg-zinc-700/60" />
              <div className="h-10 w-36 rounded-full bg-zinc-600/70 mt-2" />
            </div>
          </div>
        ) : null}

        {/* Authentication Required Card */}
        {!isAuthLoading && !isAuthenticated ? (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="relative max-w-sm w-full mx-4 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-8 shadow-2xl overflow-hidden">
              {/* Glassmorphism background elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -ml-20 -mb-20"></div>
              
              <div className="relative z-10 text-center space-y-6">
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  </div>
                </div>

                {/* Heading */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Sign in to Continue
                  </h2>
                  <p className="text-gray-200 text-sm">
                    Log in to view reels, like your favorite dishes, and place orders
                  </p>
                </div>

                {/* Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => navigate('/user/login')}
                    className="w-full px-4 py-3 rounded-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    User Login
                  </button>
                  
                  <button
                    onClick={() => navigate('/partner/login')}
                    className="w-full px-4 py-3 rounded-full border-2 border-white/30 hover:border-white/50 text-white font-semibold transition-all duration-200 hover:bg-white/10"
                  >
                    Partner Login
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/20"></div>
                  <span className="text-gray-300 text-xs">or</span>
                  <div className="flex-1 h-px bg-white/20"></div>
                </div>

                {/* Sign Up Link */}
                <p className="text-gray-200 text-sm">
                  Don't have an account?{' '}
                  <button
                    onClick={() => navigate('/user/register')}
                    className="text-blue-400 hover:text-blue-300 font-semibold underline"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {!isInitialLoading && videos.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center p-6">
            <div className="max-w-md w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-center">
              <h2 className="text-white text-xl font-semibold mb-2">Nothing to show yet</h2>
              <p className="text-gray-300 text-sm mb-5">{emptyStateMessage || 'No reels were found right now. Please try again shortly.'}</p>
              <button
                onClick={() => getVideos(true)}
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Retry
              </button>
            </div>
          </div>
        ) : null}

        {!isInitialLoading && videos.length > 0 ? (
          <div
            ref={videoFeedRef}
            className="video-feed"
          >
            {videos.map((video, index) => (
              <div
                key={video._id}
                className="reel-item flex items-center justify-center bg-black"
              >
                <VideoCard video={video} index={index} videoRefs={videoRefs} isMuted={isMuted} setIsMuted={setIsMuted} />
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
                      <Link to={'/profile/foodpartner/' + video.foodPartner?._id} className="hover:underline flex items-center gap-2">
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
                      <button
                        onClick={() => handleOrderNow(video)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-semibold transition-colors cursor-pointer">
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Reel
