import React from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatusDisplayProps {
  status: 'idle' | 'processing' | 'success' | 'error';
  message: string;
  progress?: number;
}

export function StatusDisplay({ status, message, progress = 0 }: StatusDisplayProps) {
  if (status === 'idle') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border p-4"
    >
      <div className="flex items-center gap-3">
        {status === 'processing' && (
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        )}
        {status === 'success' && (
          <CheckCircle className="h-5 w-5 text-green-500" />
        )}
        {status === 'error' && (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
        <p className="text-sm">{message}</p>
      </div>
      
      {status === 'processing' && (
        <div className="mt-3">
          <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {Math.round(progress)}%
          </p>
        </div>
      )}
    </motion.div>
  );
}