
import { decrypt } from '@/lib/aes';

self.onmessage = (e) => {
  try {
    const { fileBuffer, keyBytes } = e.data;
    const decryptedData = decrypt(Buffer.from(fileBuffer), keyBytes);
    self.postMessage({ success: true, data: decryptedData });
  } catch (error) {
    self.postMessage({ success: false, error: 'Decryption failed. Check key or file integrity.' });
  }
};
