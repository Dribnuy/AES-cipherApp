
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileDropzone } from '@/components/FileDropzone';
import { KeyInput } from '@/components/KeyInput';
import { ProcessButton } from '@/components/ProcessButton';
import { StatusDisplay } from '@/components/StatusDisplay';
import { decrypt } from '@/lib/aes';
import { hexToBytes } from '@/lib/utils';

export function DecryptView() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setStatus('idle');
    setMessage('');
    setDownloadUrl('');
  };

  const handleDecrypt = async () => {
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

      const worker = new Worker(new URL('./decryption.worker.ts', import.meta.url), { type: 'module' });

      worker.onmessage = (e) => {
        const { success, data, error } = e.data;
        if (success) {
          const decryptedBlob = new Blob([data]);
          setDownloadUrl(URL.createObjectURL(decryptedBlob));
          setStatus('success');
          setMessage(t('statusSuccessDecrypt'));
        } else {
          setStatus('error');
          setMessage(error || t('errorDecryption'));
        }
        worker.terminate();
      };

      worker.postMessage({ fileBuffer, keyBytes });

    } catch (err) {
      setStatus('error');
      setMessage(t('errorDecryption'));
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <FileDropzone file={file} onFileChange={handleFileChange} />
      
      {file && (
        <>
          <KeyInput
            label={t('decryptionKey')}
            value={key}
            onChange={setKey}
            placeholder={t('keyPlaceholder')}
          />
          <StatusDisplay status={status} message={message} />
          <ProcessButton
            label={t('decryptButton')}
            status={status}
            downloadUrl={downloadUrl}
            onProcess={handleDecrypt}
            fileName={file?.name.replace(/.enc$/, '') || 'decrypted-file'}
          />
        </>
      )}
    </div>
  );
}
