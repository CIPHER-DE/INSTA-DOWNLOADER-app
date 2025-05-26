import React, { useState, useCallback } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Textarea } from '@/components/ui/textarea';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { fetchInstagramVideo } from '@/lib/instagramApi';
    import { isValidInstagramUrl } from '@/lib/utils';
    import { X, Download, PlusCircle, Loader2, AlertTriangle, CheckCircle, Trash2, ListChecks } from 'lucide-react';
    
    const containerVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };
    
    const itemVariants = {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
    };
    
    const BatchDownloader = ({ fetchTrending }) => {
      const [urlsInput, setUrlsInput] = useState('');
      const [queue, setQueue] = useState([]);
      const { toast } = useToast();
    
      const handleAddUrlsToQueue = () => {
        const urls = urlsInput.split('\\n').map(url => url.trim()).filter(url => url);
        if (urls.length === 0) {
          toast({ title: "No URLs", description: "Please paste some Instagram video URLs.", variant: "destructive" });
          return;
        }
    
        const newQueueItems = urls.map(url => {
          if (!isValidInstagramUrl(url)) {
            return { id: Date.now() + Math.random(), url, status: 'failed', error: 'Invalid URL format.' };
          }
          if (queue.find(item => item.url === url)) {
            return { id: Date.now() + Math.random(), url, status: 'failed', error: 'Already in queue.' };
          }
          return { id: Date.now() + Math.random(), url, status: 'pending', videoInfo: null, error: null };
        });
    
        setQueue(prevQueue => [...prevQueue, ...newQueueItems.filter(item => !queue.find(q => q.url === item.url) || item.status === 'failed')]);
        setUrlsInput('');
        toast({ title: "URLs Added", description: `${newQueueItems.filter(i => i.status !== 'failed').length} valid URLs added to queue.`, className: "bg-blue-500 text-white" });
      };
    
      const processQueueItem = useCallback(async (itemId) => {
        setQueue(prevQueue => 
          prevQueue.map(item => item.id === itemId ? { ...item, status: 'fetching' } : item)
        );
    
        const itemToProcess = queue.find(item => item.id === itemId);
        if (!itemToProcess || !isValidInstagramUrl(itemToProcess.url)) {
           setQueue(prevQueue => 
            prevQueue.map(item => item.id === itemId ? { ...item, status: 'failed', error: itemToProcess && !isValidInstagramUrl(itemToProcess.url) ? 'Invalid URL' : 'Item not found' } : item)
          );
          return;
        }
    
        try {
          const videoData = await fetchInstagramVideo(itemToProcess.url);
          setQueue(prevQueue => 
            prevQueue.map(item => item.id === itemId ? { ...item, status: 'ready', videoInfo: videoData } : item)
          );
          toast({ title: "Video Ready", description: `${videoData.filename || 'Video'} is ready.`, className: "bg-green-500 text-white" });
          if (fetchTrending) fetchTrending();
        } catch (error) {
          setQueue(prevQueue => 
            prevQueue.map(item => item.id === itemId ? { ...item, status: 'failed', error: error.message } : item)
          );
          toast({ title: "Fetch Failed", description: `Could not fetch ${itemToProcess.url.substring(0,30)}...: ${error.message}`, variant: "destructive" });
        }
      }, [queue, toast, fetchTrending]);
    
      const processAllPending = () => {
        queue.forEach(item => {
          if (item.status === 'pending') {
            processQueueItem(item.id);
          }
        });
      };
    
      const removeFromQueue = (itemId) => {
        setQueue(prevQueue => prevQueue.filter(item => item.id !== itemId));
      };
    
      const handleDownload = (downloadUrl, filename) => {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', filename || 'instagram_video.mp4');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: 'Download Started', description: `Downloading ${filename}`, className: 'bg-purple-500 text-white' });
      };
    
      return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-2xl space-y-6">
          <div className="bg-slate-800/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-pink-500/40">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 flex items-center"><ListChecks size={28} className="mr-2"/> Batch Downloader</h2>
            <Textarea
              placeholder="Paste Instagram video URLs here, one per line..."
              value={urlsInput}
              onChange={(e) => setUrlsInput(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-gray-200 min-h-[120px] focus:border-pink-500"
              rows={5}
            />
            <Button onClick={handleAddUrlsToQueue} className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white group">
              <PlusCircle size={20} className="mr-2 group-hover:animate-spin-slow"/> Add URLs to Queue
            </Button>
          </div>
    
          {queue.length > 0 && (
            <div className="bg-slate-800/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-pink-500/40">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-pink-300">Download Queue ({queue.length})</h3>
                <Button onClick={processAllPending} variant="outline" size="sm" className="border-pink-500 text-pink-300 hover:bg-pink-500/20">
                  <Download size={16} className="mr-2"/> Process All Pending
                </Button>
              </div>
              <AnimatePresence>
                <motion.ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar-pink">
                  {queue.map((item) => (
                    <motion.li
                      key={item.id}
                      variants={itemVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      layout
                      className="p-3 bg-slate-700/60 rounded-lg border border-slate-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                    >
                      <div className="flex-grow min-w-0">
                        <p className="text-sm text-gray-300 truncate" title={item.url}>{item.url}</p>
                        {item.status === 'pending' && <p className="text-xs text-yellow-400 flex items-center"><Loader2 size={14} className="mr-1 animate-ping-slow"/>Pending...</p>}
                        {item.status === 'fetching' && <p className="text-xs text-blue-400 flex items-center"><Loader2 size={14} className="mr-1 animate-spin"/>Fetching...</p>}
                        {item.status === 'ready' && item.videoInfo && (
                           <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                            <p className="text-xs text-green-400 flex items-center"><CheckCircle size={14} className="mr-1"/>Ready: {item.videoInfo.filename.substring(0,30)}...</p>
                             <Button 
                                onClick={() => handleDownload(item.videoInfo.downloadUrl, item.videoInfo.filename)} 
                                size="xs" 
                                className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 h-auto text-xs"
                              >
                                <Download size={12} className="mr-1"/>Download
                              </Button>
                           </div>
                        )}
                        {item.status === 'failed' && <p className="text-xs text-red-400 flex items-center"><AlertTriangle size={14} className="mr-1"/>Failed: {item.error}</p>}
                      </div>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0 flex-shrink-0">
                        {item.status === 'pending' && (
                          <Button onClick={() => processQueueItem(item.id)} variant="ghost" size="icon" className="text-blue-400 hover:text-blue-300 h-8 w-8">
                            <Download size={16}/>
                          </Button>
                        )}
                        <Button onClick={() => removeFromQueue(item.id)} variant="ghost" size="icon" className="text-red-400 hover:text-red-300 h-8 w-8">
                          <Trash2 size={16}/>
                        </Button>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      );
    };
    
    export default BatchDownloader;
