
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { UploadCloud, File as FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileDropzoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export function FileDropzone({ file, onFileChange }: FileDropzoneProps) {
  const { t } = useTranslation();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.size > 500 * 1024 * 1024) {
        alert(t('errorFileTooLarge'));
        onFileChange(null);
      } else {
        onFileChange(selectedFile);
      }
    }
  }, [onFileChange, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: !!file,
    noKeyboard: !!file,
    multiple: false,
  });

  const resetFile = () => onFileChange(null);

  if (file) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-3 bg-secondary rounded-lg"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <FileIcon className="w-6 h-6 text-primary flex-shrink-0" />
          <span className="text-sm font-medium truncate">{file.name}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={resetFile}>{t('changeFile')}</Button>
      </motion.div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`p-10 border-2 border-dashed rounded-lg cursor-pointer flex flex-col items-center justify-center text-center transition-colors ${
        isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
      }`}
    >
      <input {...getInputProps()} />
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <UploadCloud className="w-12 h-12 text-muted-foreground" />
      </motion.div>
      <p className="mt-4 text-sm">{t('dropzone')}</p>
      <p className="text-xs text-muted-foreground mt-1">{t('maxFileSize')}</p>
    </div>
  );
}
