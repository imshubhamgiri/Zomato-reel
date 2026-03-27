import React from 'react'

const VideoCard = ({ video , index , videoRefs , isMuted , setIsMuted }) => {
  return (
    <div key={video._id} 
    className="reel-item flex items-center justify-center bg-black">
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
    </div>
  )
}

export default VideoCard
