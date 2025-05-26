import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { TrendingUp, Download, ImageOff, Loader2 } from 'lucide-react';
    
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    };
    
    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    };
    
    const TrendingVideos = ({ videos, isLoading, onVideoSelect }) => {
      if (isLoading) {
        return (
          <div className="w-full max-w-2xl mt-12 bg-slate-800/70 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl border border-blue-500/40">
            <div className="flex items-center text-blue-400 mb-6">
              <Loader2 size={28} className="mr-3 animate-spin" />
              <h2 className="text-2xl sm:text-3xl font-bold">Loading Trending Videos...</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-700/50 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        );
      }
    
      if (!videos || videos.length === 0) {
        return null; 
      }
    
      return (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-2xl mt-12 bg-slate-800/70 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl border border-blue-500/40"
        >
          <div className="flex items-center text-blue-400 mb-6">
            <TrendingUp size={32} className="mr-3" />
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400">
              Trending Videos
            </h2>
          </div>
          <motion.ul variants={containerVariants} className="space-y-4">
            {videos.map((video) => (
              <motion.li
                key={video.id}
                variants={itemVariants}
                className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/60 hover:border-blue-500/70 transition-colors duration-300 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 flex-grow min-w-0">
                  {video.thumbnail_url ? (
                    <img  
                      src={video.thumbnail_url} 
                      alt={video.video_title || 'Video thumbnail'} 
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md border border-slate-500"
                     src="https://images.unsplash.com/photo-1647964186073-51a605191343" />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-600 rounded-md flex items-center justify-center text-slate-400 border border-slate-500">
                      <ImageOff size={30} />
                    </div>
                  )}
                  <div className="flex-grow min-w-0">
                    <p 
                      className="text-sm sm:text-base font-medium text-blue-300 truncate" 
                      title={video.video_title || video.video_url}
                    >
                      {video.video_title || video.video_url}
                    </p>
                    <p className="text-xs text-gray-400">
                      Downloads: {video.download_count}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => onVideoSelect(video.video_url)}
                  variant="outline"
                  size="sm"
                  className="border-blue-500 text-blue-300 hover:bg-blue-500/90 hover:text-slate-900 transition-all duration-300 group w-full sm:w-auto flex-shrink-0"
                >
                  <Download size={16} className="mr-2 group-hover:animate-bounce" />
                  Get Video
                </Button>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      );
    };
    
    export default TrendingVideos;
