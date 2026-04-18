import { motion } from 'framer-motion';
import { apiService } from '../../services/api';

export default function PdfCanvas({ activeChartUrl }) {
  const proxyUrl = apiService.getProxyUrl(activeChartUrl);
  
  // We use our locally hosted Mozilla PDF.js viewer which gives full controls (zoom, print, download)
  // and has a built-in loader, ensuring a robust inline viewing experience on both desktop and mobile platforms.
  const finalSrc = `/pdfjs/web/viewer.html?file=${encodeURIComponent(proxyUrl)}`;

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
