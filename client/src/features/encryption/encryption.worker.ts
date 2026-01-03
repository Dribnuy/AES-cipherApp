import { Buffer } from 'buffer';
import { encrypt } from '@/lib/aes';

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

      const encryptedChunk = encrypt(Buffer.from(chunk), keyBytes, isLastChunk);
      
      chunks.push(encryptedChunk);

      processed = end;
      if (processed % (CHUNK_SIZE * 5) === 0 || isLastChunk) { 
         self.postMessage({ progress: (processed / totalSize) * 100, isProgressUpdate: true });
      }
    }

    const encryptedData = Buffer.concat(chunks);
    self.postMessage({ success: true, data: encryptedData, progress: 100 });
    
  } catch (error) {
    self.postMessage({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Encryption failed' 
    });
  }
};