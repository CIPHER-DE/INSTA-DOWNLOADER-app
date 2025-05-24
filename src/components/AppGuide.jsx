import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { ArrowDownToLine, Smartphone, Film, FileText, CheckCircle, Music } from 'lucide-react';
    
    const cardVariants = {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "backOut" } }
    };
    
    const iconMap = {
      Smartphone,
      Film,
      FileText,
      CheckCircle,
      Music,
      ArrowDownToLine
    };
    
    const AppGuide = ({ title, subtitle, icon, steps, downloadButtonText, appDownloadLink, themeColor = "green" }) => {
      const TitleIcon = iconMap[icon] || Film;
    
      const baseBorderColor = themeColor === "purple" ? "border-purple-500/40" : "border-green-500/40";
      const baseIconBgGradient = themeColor === "purple" 
        ? "from-purple-600 via-pink-600 to-orange-500" 
        : "from-green-500 via-teal-500 to-cyan-500";
      const baseTextGradient = themeColor === "purple"
        ? "from-purple-400 via-pink-500 to-orange-400"
        : "from-green-400 via-teal-400 to-cyan-400";
      const baseHoverShadow = themeColor === "purple" ? "hover:shadow-pink-500/50" : "hover:shadow-green-500/50";
      const stepHoverBorderColor = themeColor === "purple" ? "rgba(192, 132, 252, 0.5)" : "rgba(34, 197, 94, 0.5)";
      const stepIconColor = themeColor === "purple" ? "text-purple-400" : "text-green-400";
      const stepTitleColor = themeColor === "purple" ? "text-purple-300" : "text-green-300";
      const downloadBtnGradient = themeColor === "purple"
        ? "from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
        : "from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700";
      const downloadBtnShadow = themeColor === "purple" ? "hover:shadow-purple-500/40" : "hover:shadow-green-500/40";
      const downloadBtnRing = themeColor === "purple" ? "focus:ring-purple-400/50" : "focus:ring-green-400/50";
    
      return (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className={`w-full bg-slate-800/70 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl ${baseBorderColor}`}
        >
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0.5, rotate: 15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 180, damping: 12 }}
              className={`inline-block p-3.5 bg-gradient-to-br ${baseIconBgGradient} rounded-full mb-5 shadow-lg ${baseHoverShadow} transition-shadow`}
            >
              <TitleIcon size={36} className="text-white" />
            </motion.div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${baseTextGradient} mb-2`}>
              {title}
            </h2>
            <p className="text-gray-400/90 mt-2 text-sm sm:text-base">
              {subtitle}
            </p>
          </div>
    
          <div className="space-y-6 text-gray-300/90">
            {steps.map((step, index) => {
              const StepIcon = iconMap[step.icon] || FileText;
              return (
                <motion.div 
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600/60"
                  whileHover={{ borderColor: stepHoverBorderColor, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <StepIcon size={28} className={`${stepIconColor} mt-1 flex-shrink-0`} />
                  <div>
                    <h3 className={`font-semibold text-lg ${stepTitleColor} mb-1`}>{step.title}</h3>
                    <p className="text-sm" dangerouslySetInnerHTML={{ __html: step.description.replace(/<code>(.*?)<\/code>/g, '<code class="bg-slate-600 px-1.5 py-0.5 rounded text-xs text-pink-300">$1</code>') }}></p>
                  </div>
                </motion.div>
              );
            })}
          </div>
    
          <div className="mt-10 text-center">
            <a
              href={appDownloadLink}
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button 
                size="lg"
                className={`bg-gradient-to-r ${downloadBtnGradient} text-white font-bold py-4 px-8 text-xl rounded-lg shadow-lg ${downloadBtnShadow} transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:ring-4 ${downloadBtnRing} flex items-center justify-center group`}
              >
                <ArrowDownToLine size={26} className="mr-3 group-hover:animate-bounce" /> 
                {downloadButtonText}
              </Button>
            </a>
          </div>
        </motion.div>
      );
    };
    
    export default AppGuide;
