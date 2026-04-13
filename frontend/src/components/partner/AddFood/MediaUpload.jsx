import React from 'react';

const MediaUpload = ({ formData, videoPreview, onMediaChange }) => {
  const isStandard = formData.type === 'standard';

  return (
    <div className='bg-white dark:bg-[#31363F] p-6 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-gray-200 dark:border-gray-700/50'>
      <div className='mb-6'>
        <h3 className='text-2xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent'>
          Upload Media
        </h3>
        <p className='text-sm text-gray-500 dark:text-gray-300 mt-2'>
          Showcase your delicious dish to the world.
        </p>
      </div>

      <div className='space-y-6'>
        <div>
          <label className='flex items-center gap-2 text-sm font-semibold text-black dark:text-white mb-4'>
            <span className="p-1.5 rounded-md bg-sky-50 text-sky-500 dark:bg-sky-500/10 dark:text-sky-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </span>
            Upload {isStandard ? 'Image' : 'Video'} <span className="text-sky-500">*</span>
          </label>
          <div className='relative group'>
            <input
              type="file"
              accept={isStandard ? 'image/*' : 'video/*'}
              onChange={onMediaChange}
              className='hidden'
              id='media-upload'
              required
            />
            <label
              htmlFor='media-upload'
              className='flex flex-col items-center justify-center w-full min-h-[320px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer bg-gray-50 dark:bg-[#222831] hover:bg-sky-50/50 dark:hover:bg-[#1a1e25] group-hover:border-sky-400 dark:group-hover:border-sky-500 transition-all duration-300 overflow-hidden relative'
            >
              {videoPreview ? (
                <div className='absolute inset-0 w-full h-full'>
                  {isStandard ? (
                    <img
                      src={videoPreview}
                      alt="Preview"
                      className='w-full h-full object-cover rounded-xl'
                    />
                  ) : (
                    <video
                      src={videoPreview}
                      className='w-full h-full object-cover rounded-xl'
                      controls
                    />
                  )}
                  <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                    <span className='bg-primary-500 text-white bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold border border-white/40 shadow-lg'>
                      Change {isStandard ? 'Image' : 'Video'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className='text-center p-8'>
                  <div className='w-20 h-20 bg-sky-50 dark:bg-[#31363F] border border-transparent dark:border-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-sm'>
                    <svg className="w-10 h-10 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className='text-lg font-bold text-black dark:text-white mb-2'>
                    Click to browse files
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-400 max-w-[200px] mx-auto leading-relaxed'>
                    {isStandard ? 'Supports JPG, PNG, GIF (Max. 5MB)' : 'Supports MP4, MOV, AVI (Max. 100MB)'}
                  </p>
                </div>
              )}
            </label>
          </div>
          <p className='text-xs font-medium text-gray-500 dark:text-gray-400 mt-4 text-center'>
            {isStandard ? 'For best results, upload an appetizing, high-resolution picture.' : 'Upload a short, engaging video showcasing your dish.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MediaUpload;
