import React from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Download, CheckCircle } from 'lucide-react';
    
    const cardVariants = {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "backOut" } },
      exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "backIn" } }
    };
    
    const VideoDisplay = ({ videoInfo }) => {
      if (!videoInfo) return null;
    
      return (
        <AnimatePresence>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-2xl bg-slate-800/70 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl border border-purple-500/40"
          >
            <div className="flex items-center text-green-400 mb-3.5">
              <CheckCircle size={28} className="mr-2.5 text-green-300" />
              <h2 className="text-xl sm:text-2xl font-semibold">Video Ready!</h2>
            </div>
            
            {videoInfo.filename && (
              <p className="text-gray-300/90 mb-1.5 text-sm truncate" title={videoInfo.filename}>
                <span className="font-medium text-purple-300">Filename:</span> {videoInfo.filename}
              </p>
            )}
            <p className="text-gray-300/90 mb-4 text-sm">
              <span className="font-medium text-purple-300">Type:</span> {videoInfo.type ? videoInfo.type.toUpperCase() : 'N/A'}
            </p>
            
            <a
              href={videoInfo.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={videoInfo.filename || `instagram_video.${videoInfo.type || 'mp4'}`}
              className="w-full block"
            >
              <Button className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 text-lg rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] focus:ring-4 focus:ring-green-400/50 flex items-center justify-center shadow-md hover:shadow-lg">
                <Download size={22} className="mr-2.5" /> Download Now
              </Button>
            </a>
            <p className="text-xs text-gray-500/80 mt-3 text-center">
              Tip: If download doesn't start, right-click the button and select "Save Link As...".
            </p>
          </motion.div>
        </AnimatePresence>
      );
    };
    
    export default VideoDisplay;
