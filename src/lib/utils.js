import { clsx } from "clsx"
    import { twMerge } from "tailwind-merge"
     
    export function cn(...inputs) {
      return twMerge(clsx(inputs))
    }
    
    export const isValidInstagramUrl = (inputUrl) => {
      try {
        const parsedUrl = new URL(inputUrl);
        return parsedUrl.hostname.includes('instagram.com') && 
               (parsedUrl.pathname.includes('/reel/') || 
                parsedUrl.pathname.includes('/p/') || 
                parsedUrl.pathname.includes('/tv/'));
      } catch (e) {
        return false;
      }
    };
