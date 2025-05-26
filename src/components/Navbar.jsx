import React, { useState } from 'react';
    import { Link, NavLink } from 'react-router-dom';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Menu, X, DownloadCloud, Send } from 'lucide-react';
    import { Button } from '@/components/ui/button';

    const Navbar = () => {
      const [isOpen, setIsOpen] = useState(false);

      const toggleMenu = () => setIsOpen(!isOpen);

      const navItems = [
        { name: 'Downloader', path: '/', icon: <DownloadCloud size={20} /> },
        { name: 'Contact', path: '/contact', icon: <Send size={20} /> },
      ];

      const menuVariants = {
        open: {
          opacity: 1,
          x: 0,
          transition: { type: 'spring', stiffness: 300, damping: 30 }
        },
        closed: {
          opacity: 0,
          x: "-100%",
          transition: { type: 'spring', stiffness: 300, damping: 30, delay: 0.1 }
        }
      };
      
      const navItemVariants = {
        hover: {
          scale: 1.05,
          color: "rgb(192, 132, 252)", 
          transition: { duration: 0.2 }
        },
        tap: {
          scale: 0.95
        }
      };

      const activeLinkStyle = "text-purple-400 font-semibold";
      const inactiveLinkStyle = "text-slate-200 hover:text-purple-400";

      return (
        <nav className="sticky top-0 z-40 bg-slate-900/60 backdrop-blur-lg shadow-xl py-3 px-4 md:px-8 border-b border-purple-500/30">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl md:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
              HACKERPRO
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <motion.div key={item.name} variants={navItemVariants} whileHover="hover" whileTap="tap">
                  <NavLink 
                    to={item.path} 
                    className={({ isActive }) => 
                      `${isActive ? activeLinkStyle : inactiveLinkStyle} transition-colors duration-300 flex items-center space-x-2 text-sm`
                    }
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                </motion.div>
              ))}
            </div>
            <div className="md:hidden">
              <Button onClick={toggleMenu} variant="ghost" size="icon" className="text-slate-200 hover:text-purple-400">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </Button>
            </div>
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="md:hidden fixed inset-0 bg-slate-900/95 backdrop-blur-xl p-8 space-y-6 z-50 flex flex-col items-center justify-center"
              >
                <Button onClick={toggleMenu} variant="ghost" size="icon" className="text-slate-200 hover:text-purple-400 absolute top-6 right-6">
                   <X size={32} />
                </Button>
                {navItems.map((item) => (
                  <motion.div 
                    key={item.name} 
                    variants={navItemVariants} 
                    whileHover="hover" 
                    whileTap="tap"
                    className="w-full text-center"
                  >
                    <NavLink
                      to={item.path}
                      onClick={toggleMenu}
                      className={({ isActive }) => 
                        `${isActive ? activeLinkStyle : inactiveLinkStyle} text-2xl transition-colors duration-300 flex items-center justify-center space-x-3 py-3`
                      }
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </NavLink>
                  </motion.div>
                ))}
                 <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute bottom-8 text-xs text-purple-400"
                  >
                    Made by HACKERPRO
                  </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      );
    };

    export default Navbar;
