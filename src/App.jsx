import React from 'react';
    import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
    import { Toaster } from '@/components/ui/toaster';
    import InstagramDownloaderPage from '@/pages/InstagramDownloaderPage';
    import ContactPage from '@/pages/ContactPage';
    import Navbar from '@/components/Navbar';
    import Footer from '@/components/Footer';
    import GalaxyBackground from '@/components/GalaxyBackground';
    import LoginPage from '@/pages/LoginPage';
    import RegisterPage from '@/pages/RegisterPage';
    
    function App() {
      return (
        <Router>
          <div className="flex flex-col min-h-screen text-slate-50 relative overflow-hidden dark">
            <GalaxyBackground />
            <div className="relative z-10 flex flex-col flex-grow">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<InstagramDownloaderPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster />
          </div>
        </Router>
      );
    }

    export default App;
