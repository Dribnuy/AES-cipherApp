import React from 'react';
import { motion } from 'framer-motion';
import { FileText, HardDrive, Clock, Shield } from 'lucide-react';

interface FileStatsProps {
  file: File;
  encrypted?: boolean;
}

export function FileStats({ file, encrypted = false }: FileStatsProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileExtension = () => {
    const parts = file.name.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'N/A';
  };

  const estimateEncryptionTime = () => {
    const sizeMB = file.size / (1024 * 1024);
    const timeSeconds = Math.max(0.1, sizeMB * 0.05);
    return timeSeconds < 1 ? '< 1s' : `~${Math.round(timeSeconds)}s`;
  };

  const stats = [
    {
      icon: FileText,
      label: 'File Type',
      value: getFileExtension(),
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      icon: HardDrive,
      label: 'File Size',
      value: formatBytes(file.size),
      color: 'text-green-400',
      bg: 'bg-green-500/10'
    },
    {
      icon: Clock,
      label: 'Est. Time',
      value: estimateEncryptionTime(),
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    {
      icon: Shield,
      label: 'Status',
      value: encrypted ? 'Encrypted' : 'Ready',
      color: encrypted ? 'text-green-400' : 'text-yellow-400',
      bg: encrypted ? 'bg-green-500/10' : 'bg-yellow-500/10'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 gap-3 mt-4"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className={`${stat.bg} border border-border rounded-lg p-3 flex items-center gap-3`}
        >
          <div className={`p-2 rounded-lg ${stat.bg}`}>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className={`text-sm font-semibold ${stat.color} truncate`}>
              {stat.value}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}