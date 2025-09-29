
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, Download } from 'lucide-react';

interface ProcessButtonProps {
  label: string;
  status: 'idle' | 'processing' | 'success' | 'error';
  downloadUrl: string;
  onProcess: () => void;
  fileName: string;
}

export function ProcessButton({ label, status, downloadUrl, onProcess, fileName }: ProcessButtonProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex gap-4"
    >
      <Button
        onClick={onProcess}
        disabled={status === 'processing'}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {status === 'processing' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {label}
      </Button>
      {downloadUrl && (
        <Button asChild variant="outline" className="w-full">
          <a href={downloadUrl} download={fileName}>
            <Download className="mr-2 h-4 w-4" />
            {t('downloadButton')}
          </a>
        </Button>
      )}
    </motion.div>
  );
}
