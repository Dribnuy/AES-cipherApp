
import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(process.cwd(), 'data', 'temp');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
});

const algorithm = 'aes-256-cbc';

router.post('/encrypt', upload.single('file'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: 'Файл не завантажено.' });
    return;
  }
  if (!req.body.password) {
    fs.unlinkSync(req.file.path); // Clean up uploaded file
    res.status(400).json({ message: 'Пароль не надано.' });
    return;
  }

  try {
    // Generate a salt and derive the key from the password
    const salt = crypto.randomBytes(16);
    const key = crypto.scryptSync(req.body.password, salt, 32); // 32 bytes for aes-256

    // Generate a random initialization vector
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const inputPath = req.file.path;
    const encryptedFileName = `${req.file.filename}.enc`;
    const outputPath = path.join(process.cwd(), 'data', 'uploads', encryptedFileName);

    const readableStream = fs.createReadStream(inputPath);
    const writableStream = fs.createWriteStream(outputPath);

    // Write salt and IV to the beginning of the file
    writableStream.write(salt);
writableStream.write(iv);

    await pipeline(readableStream, cipher, writableStream);

    // Clean up the original uploaded file
    fs.unlinkSync(inputPath);

    res.status(200).json({
      message: 'Файл успішно зашифровано',
      downloadUrl: `/api/downloads/${encryptedFileName}`,
    });
    return;
  } catch (error) {
    console.error('Encryption error:', error);
    // Clean up temp file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Помилка під час шифрування файлу.' });
    return;
  }
});

export { router as encryptionRouter };
