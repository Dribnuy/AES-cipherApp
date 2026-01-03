import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileDropzone } from '@/components/FileDropzone';
import { KeyInput } from '@/components/KeyInput';
import { ProcessButton } from '@/components/ProcessButton';
import { StatusDisplay } from '@/components/StatusDisplay';
import { FileStats } from '@/components/FileStats';
import { addOperationToHistory } from '@/components/OperationHistory';
import { hexToBytes, bytesToHex, generateRandomKey } from '@/lib/utils';

export function EncryptView() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setKey(bytesToHex(generateRandomKey()));
  }, []);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setStatus('idle');
    setMessage('');
    setDownloadUrl('');
    setProgress(0);
  };

  const handleEncrypt = async () => {
    if (!file) {
      setStatus('error');
      setMessage(t('errorNoFile'));
      return;
    }
    if (!key) {
      setStatus('error');
      setMessage(t('errorNoKey'));
      return;
    }
    if (!/^[0-9a-fA-F]{32}$/.test(key)) {
      setStatus('error');
      setMessage(t('errorInvalidKey'));
      return;
    }

    setStatus('processing');
    setMessage(t('processingFile'));
    setDownloadUrl('');
    setProgress(0);

    try {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const keyBytes = hexToBytes(key);
      
      const worker = new Worker(
        new URL('./encryption.worker.ts', import.meta.url), 
        { type: 'module' }
      );
      
      worker.onmessage = (e) => {
        const { success, data, error, progress: workerProgress, isProgressUpdate } = e.data;
        
        if (isProgressUpdate) {
          setProgress(workerProgress);
        } else if (success) {
          const encryptedBlob = new Blob([data], { type: 'application/octet-stream' });
          setDownloadUrl(URL.createObjectURL(encryptedBlob));
          setStatus('success');
          setMessage(t('statusSuccessEncrypt'));
          setProgress(100);
          addOperationToHistory('encrypt', file.name);
          worker.terminate();
        } else {
          setStatus('error');
          setMessage(error || t('errorEncryption'));
          worker.terminate();
        }
      };

      worker.postMessage({ fileBuffer, keyBytes });

    } catch (err) {
      setStatus('error');
      setMessage(t('errorEncryption'));
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <FileDropzone file={file} onFileChange={handleFileChange} />
      
      {file && (
        <>
          <FileStats file={file} encrypted={status === 'success'} />
          <KeyInput
            label={t('encryptionKey')}
            value={key}
            onChange={setKey}
            onGenerate={() => setKey(bytesToHex(generateRandomKey()))}
            placeholder={t('keyPlaceholder')}
          />
          <StatusDisplay status={status} message={message} progress={progress} />
          <ProcessButton
            label={t('encryptButton')}
            status={status}
            downloadUrl={downloadUrl}
            onProcess={handleEncrypt}
            fileName={file?.name ? `${file.name}.enc` : 'encrypted-file'}
          />
        </>
      )}
    </div>
  );
}