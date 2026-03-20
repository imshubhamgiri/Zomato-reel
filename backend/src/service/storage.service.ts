import ImageKit from '@imagekit/nodejs';
import { toFile } from '@imagekit/nodejs';
import dotenv from 'dotenv';

dotenv.config();

interface ImageKitConfig {
  publicKey: string;
  privateKey: string;
  urlEndpoint: string;
}

const client = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
} as ImageKitConfig);

interface UploadResult {
  fileId: string;
  name: string;
  url: string;
  [key: string]: any;
}

interface DeleteResult {
  success: boolean;
  message: string;
}
interface File{
  fileBuffer: Buffer,
  fileName:string,
  mimeType:string,
}

async function uploadVideo(file:File): Promise<UploadResult> {
  try {
    const fileExtension = file.mimeType ? file.mimeType.split('/')[1] : 'jpg';
    const fullFileName = file.fileName.includes('.') ? file.fileName : `${file.fileName}.${fileExtension}`;
    
    const result = await client.files.upload({
      file: await toFile(file.fileBuffer, fullFileName),
      fileName: fullFileName,
    });

    if (!result.fileId) {
      throw new Error('Upload failed: No fileId returned');
    }

    return {
      fileId: result.fileId,
      name: result.name || fullFileName,
      url: result.url || '',
    };
  } catch (err) {
    console.error('ImageKit upload error:', err);
    throw new Error(`Upload failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

async function deleteVideo(fileId: string): Promise<DeleteResult> {
  if (!fileId) {
    console.log('no file url');
    throw new Error('No file url found');
  }
  try {
    await client.files.delete(fileId);
    return { success: true, message: 'File deleted successfully' };
  } catch (error) {
    console.error('File deletion error:', error);
    throw new Error(`File deletion failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export default { uploadVideo, deleteVideo };