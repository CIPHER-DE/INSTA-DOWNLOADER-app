export const API_BASE_URL = 'https://apis.davidcyriltech.my.id/instagram?url=';

    export const fetchInstagramVideo = async (url) => {
      try {
        const response = await fetch(`${API_BASE_URL}${encodeURIComponent(url)}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "An unknown error occurred while fetching." }));
          throw new Error(errorData.message || `Failed to fetch video. Server responded with status: ${response.status}`);
        }
        const data = await response.json();
    
        if (data.success && data.downloadUrl) {
          return data;
        } else {
          throw new Error(data.message || 'Could not retrieve download link. The API might not support this content or the URL is incorrect.');
        }
      } catch (err) {
        let errorMessage = err.message || 'An unexpected error occurred. Please try again.';
        if (errorMessage.toLowerCase().includes("failed to fetch")) {
           errorMessage = "Network error. Could not connect to the download service. Please check your internet connection or try again later.";
        } else if (errorMessage.includes("The API might not support this content")) {
           errorMessage = "This Instagram link might not be a downloadable video, or it could be private/unavailable.";
        }
        throw new Error(errorMessage);
      }
    };
