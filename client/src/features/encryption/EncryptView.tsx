
import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileDropzone } from '@/components/FileDropzone';
import { KeyInput } from '@/components/KeyInput';
import { ProcessButton } from '@/components/ProcessButton';
import { StatusDisplay } from '@/components/StatusDisplay';
import { encrypt } from '@/lib/aes';
import { hexToBytes, bytesToHex, generateRandomKey } from '@/lib/utils';

export function EncryptView() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  useEffect(() => {
    setKey(bytesToHex(generateRandomKey()));
  }, []);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setStatus('idle');
    setMessage('');
    setDownloadUrl('');
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

    try {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const keyBytes = hexToBytes(key);
      
      // Use a worker to avoid blocking the main thread
      const worker = new Worker(new URL('./encryption.worker.ts', import.meta.url), { type: 'module' });
      
      worker.onmessage = (e) => {
        const { success, data, error } = e.data;
        if (success) {
          const encryptedBlob = new Blob([data], { type: 'application/octet-stream' });
          setDownloadUrl(URL.createObjectURL(encryptedBlob));
          setStatus('success');
          setMessage(t('statusSuccessEncrypt'));
        } else {
          setStatus('error');
          setMessage(error || t('errorEncryption'));
        }
        worker.terminate();
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
          <KeyInput
            label={t('encryptionKey')}
            value={key}
            onChange={setKey}
            onGenerate={() => setKey(bytesToHex(generateRandomKey()))}
            placeholder={t('keyPlaceholder')}
          />
          <StatusDisplay status={status} message={message} />
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
