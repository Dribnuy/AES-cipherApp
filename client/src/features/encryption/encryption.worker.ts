
import { Buffer } from 'buffer';
import { encrypt } from '@/lib/aes';

self.onmessage = (e) => {
  try {
    const { fileBuffer, keyBytes } = e.data;
    const encryptedData = encrypt(Buffer.from(fileBuffer), keyBytes);
    self.postMessage({ success: true, data: encryptedData });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
