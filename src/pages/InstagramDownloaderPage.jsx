import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import InstagramUrlForm from '@/components/InstagramUrlForm';
    import VideoDisplay from '@/components/VideoDisplay';
    import AppGuide from '@/components/AppGuide';
    import { useToast } from '@/components/ui/use-toast';
    import { fetchInstagramVideo } from '@/lib/instagramApi';
    import { isValidInstagramUrl } from '@/lib/utils';
    
    const pageVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "circOut" } },
      exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "circIn" } }
    };
    
    const InstagramDownloaderPage = () => {
      const [url, setUrl] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const [videoInfo, setVideoInfo] = useState(null);
      const [error, setError] = useState(null);
      const { toast } = useToast();
    
      const handleSubmit = async (submittedUrl) => {
        setError(null);
        setVideoInfo(null);
        setUrl(submittedUrl);
    
        if (!submittedUrl.trim()) {
          setError('Please enter an Instagram video URL.');
          toast({ title: 'Input Error', description: 'URL field cannot be empty.', variant: 'destructive', duration: 3000 });
          return;
        }
    
        if (!isValidInstagramUrl(submittedUrl)) {
          setError('Invalid Instagram URL. Please provide a link to a specific Reel, Post, or TV video.');
          toast({ title: 'Invalid URL', description: 'Please use a valid Instagram video link (reel, post, or tv).', variant: 'destructive', duration: 4000 });
          return;
        }
        
        setIsLoading(true);
        try {
          const data = await fetchInstagramVideo(submittedUrl);
          setVideoInfo(data);
          toast({ title: 'Success!', description: 'Your video is ready for download.', className: 'bg-gradient-to-r from-green-500 to-teal-500 text-white', duration: 3000 });
        } catch (err) {
          setError(err.message);
          toast({ title: 'Download Failed', description: err.message, variant: 'destructive', duration: 5000 });
        } finally {
          setIsLoading(false);
        }
      };
    
      const handleReset = () => {
        setUrl('');
        setVideoInfo(null);
        setError(null);
        toast({ title: 'Form Cleared', description: 'You can now enter a new URL.', duration: 2000 });
      };
    
      const appGuideData = {
        title: "Instagram Video Downloader App Guide",
        subtitle: "Scroll down & download our app below to get your favorite Instagram videos!",
        icon: "Film",
        steps: [
          {
            icon: "Smartphone",
            title: "1. Download the Video",
            description: "Use our app to download your desired Instagram videos (Reels, Posts, TV)."
          },
          {
            icon: "Film",
            title: "2. Check Your Gallery/Downloads",
            description: "After downloading, the video should appear in your phone's gallery or downloads folder."
          },
          {
            icon: "FileText",
            title: "3. If Not Found (App Folder)",
            description: "If the video isn't in your gallery: Open your phone's file manager. Locate the \"Instagram Downloader\" folder (or a similar name). Your downloaded videos will be there."
          },
          {
            icon: "CheckCircle",
            title: "4. Enjoy Your Video!",
            description: "The downloaded videos will be in standard MP4 format, ready to watch and share."
          }
        ],
        downloadButtonText: "Download Insta Reel Downloader App",
        appDownloadLink: "#",
        themeColor: "purple"
      };
    
      return (
        <motion.div 
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 selection:bg-purple-500 selection:text-white"
        >
          <InstagramUrlForm
            url={url}
            setUrl={setUrl}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            onReset={handleReset}
            error={error}
          />
          
          <VideoDisplay videoInfo={videoInfo} />
    
          <div className="w-full max-w-2xl mt-12">
            <AppGuide {...appGuideData} />
          </div>
        </motion.div>
      );
    };
    
    export default InstagramDownloaderPage;
