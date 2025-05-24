import React from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Download, Loader2, Link as LinkIcon, Film, AlertTriangle, RefreshCw, MessageSquare } from 'lucide-react';
    
    const cardVariants = {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "backOut" } },
      exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "backIn" } }
    };
    
    const InstagramUrlForm = ({ url, setUrl, isLoading, onSubmit, onReset, error }) => {
      const handleSubmitForm = (e) => {
        e.preventDefault();
        onSubmit(url);
      };
    
      const contactLink = "https://wa.me/+233557488116";
    
      return (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-2xl bg-slate-800/70 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl border border-purple-500/40 mb-12"
        >
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0.5, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 180, damping: 12 }}
              className="inline-block p-3.5 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-full mb-5 shadow-lg hover:shadow-pink-500/50 transition-shadow"
            >
              <Film size={36} className="text-white" />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 mb-2">
              InstaReel Downloader
            </h1>
            <p className="text-gray-400/90 mt-2 text-sm sm:text-base">
              Paste any public Instagram Reel, Post, or TV video link to download.
            </p>
          </div>
    
          <form onSubmit={handleSubmitForm} className="space-y-5">
            <div className="relative flex items-center">
              <LinkIcon size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g., https://www.instagram.com/reel/..."
                className="bg-slate-700/80 border-slate-600/70 text-gray-200 focus:ring-pink-500 focus:border-pink-500 h-12 pl-11 pr-12 text-base rounded-lg shadow-sm transition-colors focus:bg-slate-700"
                aria-label="Instagram Video URL"
              />
              {url && (
                <motion.button
                  type="button"
                  onClick={onReset}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-400 p-1"
                  aria-label="Clear input"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  whileHover={{ rotate: 90 }}
                >
                  <RefreshCw size={18} />
                </motion.button>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] focus:ring-4 focus:ring-purple-400/50 flex items-center justify-center shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 size={24} className="animate-spin mr-2.5" /> Processing...
                </>
              ) : (
                <>
                  <Download size={22} className="mr-2.5" /> Get Video
                </>
              )}
            </Button>
          </form>
    
          <AnimatePresence>
            {error && (
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-6 p-4 bg-red-900/30 border border-red-600/50 rounded-lg text-red-300 flex flex-col items-center space-y-3 shadow-md"
                role="alert"
              >
                <div className="flex items-start space-x-3 w-full">
                  <AlertTriangle size={24} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-200">Download Error</h3>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
                <a
                  href={contactLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-yellow-400/80 text-yellow-300 hover:bg-yellow-500/90 hover:text-slate-900 font-medium transition-all duration-300 group py-2.5 text-sm flex items-center justify-center"
                  >
                    <MessageSquare size={18} className="mr-2" />
                    Can't find your video? Contact Me
                  </Button>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      );
    };
    
    export default InstagramUrlForm;
