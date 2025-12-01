// Express + multer (memoryStorage) example: upload req.file.buffer to ImageKit
const { PassThrough } = require('stream');
const Imported = require('@imagekit/nodejs');
const ImageKit = Imported.default || Imported;
const { toFile } = require('@imagekit/nodejs');
require('dotenv').config();

const client = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// convert a Buffer into a readable stream
function bufferToStream(buffer) {
  const stream = new PassThrough();
  stream.end(buffer);
  return stream;
}

// usage in an Express route handler (req.file comes from multer memoryStorage)
async function handleUpload(req, res) {
  try {
    // req.file.buffer is the Buffer from multer
    const fileStream = bufferToStream(req.file.buffer);
    // Get file extension from mimetype (e.g., 'image/jpeg' -> 'jpeg')
    const fileExtension = req.file.mimetype ? req.file.mimetype.split('/')[1] : 'jpg';
    const fullFileName = req.file.originalname.includes('.') ? req.file.originalname : `${req.file.originalname}.${fileExtension}`;
    
    // Use toFile helper for Buffer as per latest docs
    const result = await client.files.upload({
      file: await toFile(req.file.buffer, fullFileName),
      fileName: fullFileName,
    });
    
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Upload failed', message: err.message });
  }
}

// Upload image function to be used in controllers
async function uploadVideo(fileBuffer, fileName, mimeType) {
  try {
    // Get file extension from mimetype (e.g., 'image/jpeg' -> 'jpeg')
    const fileExtension = mimeType ? mimeType.split('/')[1] : 'jpg';
    const fullFileName = fileName.includes('.') ? fileName : `${fileName}.${fileExtension}`;
    
    // Use toFile helper for Buffer as per ImageKit docs
    // This converts: Buffer -> File object that ImageKit accepts
    const result = await client.files.upload({
      file: await toFile(fileBuffer, fullFileName),
      fileName: fullFileName,
    });
    
    return result;
  } catch (err) {
    console.error('ImageKit upload error:', err);
    throw new Error('Upload failed: ' + err.message);
  }
}

module.exports = { handleUpload, uploadVideo };