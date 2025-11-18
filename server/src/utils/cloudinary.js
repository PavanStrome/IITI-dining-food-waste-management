import { v2 as cloudinary } from 'cloudinary';

const enabled = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

if (enabled) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

export async function uploadToCloudinary(file) {
  if (!enabled) throw new Error('Cloudinary not configured');
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder: 'foodwaste' }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    }).end(file.buffer);
  });
}


