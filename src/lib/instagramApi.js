import { supabase } from '@/lib/supabaseClient';

const API_BASE_URL = "https://apis.davidcyriltech.my.id/instagram?url=";

export const fetchInstagramVideo = async (url) => {
  try {
    const response = await fetch(`${API_BASE_URL}${encodeURIComponent(url)}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Network response was not ok." }));
      throw new Error(errorData.message || `Failed to fetch video. Status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.success || !data.downloadUrl) {
      throw new Error(data.message || "Video not found or API error.");
    }

    await logDownloadedVideo(url, data.filename, data.type);

    return {
      downloadUrl: data.downloadUrl,
      filename: data.filename || `instagram_video.${data.type || 'mp4'}`,
      type: data.type || 'mp4',
      creator: data.creator
    };
  } catch (error) {
    console.error("Error fetching Instagram video:", error);
    throw new Error(error.message || "An unexpected error occurred while fetching the video.");
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
          last_downloaded_at: new Date().toISOString() 
        })
        .eq('id', existingVideo.id);
      if (updateError) {
        console.error('Error updating download count:', updateError);
      }
    } else {
      const { error: insertError } = await supabase
        .from('downloaded_videos')
        .insert({ 
          video_url: videoUrl, 
          video_title: videoTitle || 'Instagram Video',
          last_downloaded_at: new Date().toISOString() 
        });
      if (insertError) {
        console.error('Error inserting new video log:', insertError);
      }
    }
  } catch (error) {
    console.error('Error logging downloaded video:', error);
  }
};
