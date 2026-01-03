import { Buffer } from 'buffer';
import { decrypt } from '@/lib/aes';

self.onmessage = (e) => {
  try {
    const { fileBuffer, keyBytes } = e.data;
    const totalSize = fileBuffer.length;
    const CHUNK_SIZE = 1024 * 1024; 

    const chunks: Buffer[] = [];
    let processed = 0;

    for (let i = 0; i < totalSize; i += CHUNK_SIZE) {
   
      const end = Math.min(i + CHUNK_SIZE, totalSize);
      const chunk = fileBuffer.slice(i, end);
      
      const isLastChunk = end === totalSize;

      const decryptedChunk = decrypt(Buffer.from(chunk), keyBytes, isLastChunk);
      
      chunks.push(decryptedChunk);

      processed = end;
      if (processed % (CHUNK_SIZE * 5) === 0 || isLastChunk) {
        self.postMessage({ progress: (processed / totalSize) * 100, isProgressUpdate: true });
      }
    }

    const decryptedData = Buffer.concat(chunks);
    self.postMessage({ success: true, data: decryptedData, progress: 100 });
    
  } catch (error) {
    self.postMessage({ 
      success: false, 
      error: 'Decryption failed. Check key or file integrity.' 
    });
  }
};