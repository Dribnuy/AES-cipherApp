
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';

interface StatusDisplayProps {
  status: 'idle' | 'processing' | 'success' | 'error';
  message: string;
}

export function StatusDisplay({ status, message }: StatusDisplayProps) {
  if (status === 'idle' || !message) return null;

  const statusConfig = {
    processing: {
      icon: <Loader2 className="w-5 h-5 animate-spin" />,
      classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    success: {
      icon: <ShieldCheck className="w-5 h-5" />,
      classes: 'bg-green-500/10 text-green-400 border-green-500/20',
    },
    error: {
      icon: <AlertTriangle className="w-5 h-5" />,
      classes: 'bg-red-500/10 text-red-400 border-red-500/20',
    },
  };

  const config = statusConfig[status];
  if (!config) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ delay: 0.2 }}
        className={`flex items-center gap-3 p-3 border rounded-md ${config.classes}`}
      >
        {config.icon}
        <p className="text-sm">{message}</p>
      </motion.div>
    </AnimatePresence>
  );
}
