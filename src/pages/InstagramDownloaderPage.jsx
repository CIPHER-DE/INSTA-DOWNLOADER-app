import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import InstagramUrlForm from '@/components/InstagramUrlForm';
import VideoDisplay from '@/components/VideoDisplay';
import AppGuide from '@/components/AppGuide';
import TrendingVideos from '@/components/TrendingVideos';
import BatchDownloader from '@/components/BatchDownloader';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { fetchInstagramVideo } from '@/lib/instagramApi';
import { isValidInstagramUrl } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';
import { ListVideo, Download } from 'lucide-react';

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
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);
  const [isBatchMode, setIsBatchMode] = useState(false);

  const fetchTrending = async () => {
    setIsTrendingLoading(true);
    try {
      const { data, error: dbError } = await supabase
        .from('downloaded_videos')
        .select('id, video_url, video_title, thumbnail_url, download_count')
        .order('download_count', { ascending: false })
        .order('last_downloaded_at', { ascending: false })
        .limit(5);

      if (dbError) {
        console.error("Error fetching trending videos:", dbError);
        toast({ 
          title: 'Error', 
          description: 'Could not load trending videos.', 
          variant: 'destructive' 
        });
        setTrendingVideos([]);
      } else {
        const formattedVideos = (data || []).map(video => ({
          id: video.id,
          videoUrl: video.video_url,
          title: video.video_title || 'Instagram Video',
          thumbnailUrl: video.thumbnail_url || '',
          downloadCount: video.download_count || 0
        }));
        setTrendingVideos(formattedVideos);
      }
    } catch (err) {
      console.error("Unexpected error fetching trending:", err);
      setTrendingVideos([]);
    } finally {
      setIsTrendingLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
  }, []);

  const handleSubmit = async (submittedUrl) => {
    setError(null);
    setVideoInfo(null);
    setUrl(submittedUrl);

    if (!submittedUrl.trim()) {
      setError('Please enter an Instagram video URL.');
      toast({ 
        title: 'Input Error', 
        description: 'URL field cannot be empty.', 
        variant: 'destructive', 
        duration: 3000 
      });
      return;
    }

    if (!isValidInstagramUrl(submittedUrl)) {
      setError('Invalid Instagram URL. Please provide a link to a specific Reel, Post, or TV video.');
      toast({ 
        title: 'Invalid URL', 
        description: 'Please use a valid Instagram video link (reel, post, or tv).', 
        variant: 'destructive', 
        duration: 4000 
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await fetchInstagramVideo(submittedUrl);
      setVideoInfo(data);
      toast({ 
        title: 'Success!', 
        description: 'Your video is ready for download.', 
        className: 'bg-gradient-to-r from-green-500 to-teal-500 text-white', 
        duration: 3000 
      });
      fetchTrending();
    } catch (err) {
      setError(err.message);
      toast({ 
        title: 'Download Failed', 
        description: err.message, 
        variant: 'destructive', 
        duration: 5000 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUrl('');
    setVideoInfo(null);
    setError(null);
    if (!isBatchMode) {
      toast({ 
        title: 'Form Cleared', 
        description: 'You can now enter a new URL.', 
        duration: 2000 
      });
    }
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
      <div className="w-full max-w-2xl mb-8 flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => {
            setIsBatchMode(!isBatchMode);
            handleReset();
          }}
          className="border-pink-500 text-pink-300 hover:bg-pink-500/90 hover:text-slate-900 transition-all duration-300 group"
        >
          {isBatchMode ? <Download size={18} className="mr-2" /> : <ListVideo size={18} className="mr-2" />}
          {isBatchMode ? "Single Download" : "Batch Download"}
        </Button>
      </div>

      {isBatchMode ? (
        <BatchDownloader fetchTrending={fetchTrending} />
      ) : (
        <>
          <InstagramUrlForm
            url={url}
            setUrl={setUrl}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            onReset={handleReset}
            error={error}
          />
          <VideoDisplay videoInfo={videoInfo} />
        </>
      )}

      <TrendingVideos 
        videos={trendingVideos} 
        isLoading={isTrendingLoading} 
        onVideoSelect={(selectedUrl) => {
          if (isBatchMode) {
            toast({ 
              title: 'Info', 
              description: 'Switch to Single Download mode to use Trending Videos.', 
              duration: 3000 
            });
          } else {
            setUrl(selectedUrl);
            handleSubmit(selectedUrl);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      <div className="w-full max-w-2xl mt-12">
        <AppGuide {...appGuideData} />
      </div>
    </motion.div>
  );
};

export default InstagramDownloaderPage;
