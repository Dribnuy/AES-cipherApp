import { Buffer } from 'buffer';
import { encrypt } from '@/lib/aes';

self.onmessage = (e) => {
  try {
    const { fileBuffer, keyBytes } = e.data;
    const totalSize = fileBuffer.length;
    const CHUNK_SIZE = 1024 * 1024; 
    
    if (totalSize <= CHUNK_SIZE) {
     
      const encryptedData = encrypt(Buffer.from(fileBuffer), keyBytes);
      self.postMessage({ success: true, data: encryptedData, progress: 100 });
    } else {
     
      const chunks: Buffer[] = [];
      let processed = 0;
      
      for (let i = 0; i < totalSize; i += CHUNK_SIZE) {
        const end = Math.min(i + CHUNK_SIZE, totalSize);
        const chunk = fileBuffer.slice(i, end);
        const encryptedChunk = encrypt(Buffer.from(chunk), keyBytes);
        chunks.push(encryptedChunk);
        
        processed = end;
        const progress = (processed / totalSize) * 100;
        self.postMessage({ progress, isProgressUpdate: true });
      }
      
      const encryptedData = Buffer.concat(chunks);
      self.postMessage({ success: true, data: encryptedData, progress: 100 });
    }
  } catch (error) {
    self.postMessage({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Encryption failed' 
    });
  }
};