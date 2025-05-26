import React from 'react';
    import { motion } from 'framer-motion';
    import { Zap } from 'lucide-react';

    const Footer = () => {
      return (
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-slate-900/60 backdrop-blur-md text-slate-300 py-6 px-4 text-center border-t border-purple-500/30"
        >
          <div className="container mx-auto">
            <div className="flex items-center justify-center mb-2">
              <Zap size={18} className="text-purple-400 mr-2" />
              <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                Powered by HACKERPRO
              </p>
            </div>
            <p className="text-xs">
              &copy; {new Date().getFullYear()} InstaVideo Downloader. All rights reserved.
            </p>
            <p className="text-xs mt-1">
              This service is not affiliated with Instagram. Please respect content creators' rights.
            </p>
          </div>
        </motion.footer>
      );
    };

    export default Footer;
