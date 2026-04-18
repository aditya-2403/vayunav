import { motion } from 'framer-motion';
import { apiService } from '../../services/api';

export default function PdfCanvas({ activeChartUrl }) {
  return (
    <motion.div
      key={activeChartUrl}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{ width: '100%', height: '100%' }}
    >
      <iframe
        src={apiService.getProxyUrl(activeChartUrl)}
        width="100%"
        height="100%"
        style={{ border: 'none', display: 'block', backgroundColor: '#e0e0e0' }}
        title="PDF Viewer"
      />
    </motion.div>
  );
}
