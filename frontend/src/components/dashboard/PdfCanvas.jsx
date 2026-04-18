import { motion } from 'framer-motion';
import { apiService } from '../../services/api';

export default function PdfCanvas({ activeChartUrl }) {
  const proxyUrl = apiService.getProxyUrl(activeChartUrl);
  
  // Mobile browsers (Android/iOS) natively block inline PDFs in iframes, showing a blank screen or a download button.
  // We use the Google Docs Viewer wrapper as a fallback specifically for mobile devices to force inline rendering.
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const finalSrc = isMobile 
    ? `https://docs.google.com/gview?url=${encodeURIComponent(proxyUrl)}&embedded=true` 
    : proxyUrl;

  return (
    <motion.div
      key={activeChartUrl}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{ width: '100%', height: '100%' }}
    >
      <iframe
        src={finalSrc}
        width="100%"
        height="100%"
        style={{ border: 'none', display: 'block', backgroundColor: '#e0e0e0' }}
        title="PDF Viewer"
      />
    </motion.div>
  );
}
