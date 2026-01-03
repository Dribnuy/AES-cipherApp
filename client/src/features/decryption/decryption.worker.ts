import { Buffer } from 'buffer';
import { decrypt } from '@/lib/aes';

self.onmessage = (e) => {
  try {
    const { fileBuffer, keyBytes } = e.data;
    const totalSize = fileBuffer.length;
    const CHUNK_SIZE = 1024 * 1024; 
    
    if (totalSize <= CHUNK_SIZE) {
     
      const decryptedData = decrypt(Buffer.from(fileBuffer), keyBytes);
      self.postMessage({ success: true, data: decryptedData, progress: 100 });
    } else {
      
      const chunks: Buffer[] = [];
      let processed = 0;
      
      for (let i = 0; i < totalSize; i += CHUNK_SIZE) {
        const end = Math.min(i + CHUNK_SIZE, totalSize);
        const chunk = fileBuffer.slice(i, end);
        const decryptedChunk = decrypt(Buffer.from(chunk), keyBytes);
        chunks.push(decryptedChunk);
        
        processed = end;
        const progress = (processed / totalSize) * 100;
        self.postMessage({ progress, isProgressUpdate: true });
      }
      
      const decryptedData = Buffer.concat(chunks);
      self.postMessage({ success: true, data: decryptedData, progress: 100 });
    }
  } catch (error) {
    self.postMessage({ 
      success: false, 
      error: 'Decryption failed. Check key or file integrity.' 
    });
  }
};