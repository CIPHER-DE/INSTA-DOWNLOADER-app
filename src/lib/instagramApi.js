import { supabase } from '@/lib/supabaseClient';

const API_BASE_URL = "https://api-aswin-sparky.koyeb.app/api/downloader/igdl?url=";

export const fetchInstagramVideo = async (url) => {
  try {
    const response = await fetch(`${API_BASE_URL}${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch video information');
    }

    const data = await response.json();
    
    if (!data.status || !data.data || data.data.length === 0) {
      throw new Error('No video found at this URL');
    }

    const videoData = data.data[0];
    const filename = `instagram_video_${Date.now()}.mp4`;
    
    // Log the download in Supabase
    await logDownloadedVideo(url, filename, videoData.type || 'video');

    return {
      videoUrl: videoData.url,
      thumbnailUrl: '', // Placeholder - you might want to generate one
      title: filename.replace('.mp4', ''),
      type: videoData.type || 'video',
      downloadUrl: videoData.url, // For backward compatibility
      filename: filename
    };
  } catch (error) {
    console.error("Error fetching Instagram video:", error);
    throw new Error(error.message || 'Failed to download video');
  }
};

const logDownloadedVideo = async (videoUrl, videoTitle, videoType) => {
  try {
    const { data: existingVideo, error: selectError } = await supabase
      .from('downloaded_videos')
      .select('id, download_count')
      .eq('video_url', videoUrl)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error checking for existing video:', selectError);
      return;
    }

    if (existingVideo) {
      const { error: updateError } = await supabase
        .from('downloaded_videos')
        .update({ 
          download_count: existingVideo.download_count + 1,
          last_downloaded_at: new Date().toISOString(),
          video_title: videoTitle // Update title if it changed
        })
        .eq('id', existingVideo.id);
      if (updateError) console.error('Error updating download count:', updateError);
    } else {
      const { error: insertError } = await supabase
        .from('downloaded_videos')
        .insert({
          video_url: videoUrl,
          video_title: videoTitle,
          thumbnail_url: '', // Store empty thumbnail for consistency
          download_count: 1,
          last_downloaded_at: new Date().toISOString()
        });
      if (insertError) console.error('Error inserting new video log:', insertError);
    }
  } catch (error) {
    console.error('Error logging downloaded video:', error);
  }
};
