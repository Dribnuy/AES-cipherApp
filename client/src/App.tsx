
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, File, ShieldCheck, AlertTriangle } from 'lucide-react';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'encrypting' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.size > 500 * 1024 * 1024) {
        setStatus('error');
        setMessage('Файл завеликий. Максимальний розмір 500 МБ.');
        setFile(null);
      } else {
        setFile(selectedFile);
        setStatus('idle');
        setMessage('');
        setDownloadUrl('');
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: !!file,
    noKeyboard: !!file,
    multiple: false,
  });

  const handleEncrypt = async () => {
    if (!file || !password) {
      setStatus('error');
      setMessage('Будь ласка, виберіть файл і введіть пароль.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    setStatus('uploading');
    setMessage('');
    setDownloadUrl('');
    setProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/encrypt', true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      setProgress(100);
      if (xhr.status === 200) {
        setStatus('success');
        const response = JSON.parse(xhr.responseText);
        setMessage('Файл успішно зашифровано!');
        setDownloadUrl(response.downloadUrl);
      } else {
        setStatus('error');
        try {
          const response = JSON.parse(xhr.responseText);
          setMessage(response.message || 'Помилка шифрування файлу.');
        } catch (e) {
          setMessage('Помилка шифрування файлу. Перевірте консоль для деталей.');
        }
      }
    };

    xhr.onerror = () => {
      setStatus('error');
      setMessage('Помилка мережі або сервера.');
      setProgress(0);
    };
    
    xhr.onloadstart = () => {
        setStatus('uploading');
    };

    xhr.onloadend = () => {
        if(xhr.status === 200) {
            setStatus('success');
        } else if (status !== 'error') {
            setStatus('encrypting');
        }
    };


    xhr.send(formData);
  };

  const resetState = () => {
    setFile(null);
    setPassword('');
    setStatus('idle');
    setProgress(0);
    setMessage('');
    setDownloadUrl('');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">AES Шифрування Файлів</h1>
          <p className="text-muted-foreground mt-2">Безпечно зашифруйте ваші файли</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          {!file ? (
            <div
              {...getRootProps()}
              className={`p-10 border-2 border-dashed rounded-lg cursor-pointer flex flex-col items-center justify-center text-center transition-colors ${
                isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="w-12 h-12 text-muted-foreground" />
              <p className="mt-4 text-sm">Перетягніть файл сюди або натисніть, щоб вибрати</p>
              <p className="text-xs text-muted-foreground mt-1">Макс. розмір файлу: 500MB</p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-secondary rounded-md">
              <div className="flex items-center gap-3">
                <File className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium truncate">{file.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={resetState}>Змінити</Button>
            </div>
          )}

          {file && (
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Пароль для шифрування</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введіть надійний пароль"
                className="bg-input"
              />
            </div>
          )}

          {status === 'uploading' || status === 'encrypting' ? (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-center text-muted-foreground">
                {status === 'uploading' ? `Завантаження... ${Math.round(progress)}%` : 'Шифрування...'}
              </p>
            </div>
          ) : null}

          {status === 'success' && message && (
            <div className="flex items-center gap-3 p-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-md">
              <ShieldCheck className="w-5 h-5" />
              <p className="text-sm">{message}</p>
            </div>
          )}

          {status === 'error' && message && (
            <div className="flex items-center gap-3 p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md">
              <AlertTriangle className="w-5 h-5" />
              <p className="text-sm">{message}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              onClick={handleEncrypt}
              disabled={!file || !password || status === 'uploading' || status === 'encrypting'}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Шифрувати файл
            </Button>
            {downloadUrl && (
              <Button asChild variant="outline" className="w-full">
                <a href={downloadUrl} download>Завантажити</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
