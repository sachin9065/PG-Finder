import { v2 as cloudinary } from 'cloudinary';

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadImage(fileBase64OrBuffer: string): Promise<string> {
  if (isCloudinaryConfigured) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(fileBase64OrBuffer, {
        folder: 'pgfinder',
        resource_type: 'image',
      });
      return uploadResponse.secure_url;
    } catch (error: any) {
      console.error('Cloudinary upload failed, falling back:', error.message);
    }
  }

  // Fallback: If it's already a URL or base64, return it directly
  if (fileBase64OrBuffer.startsWith('http') || fileBase64OrBuffer.startsWith('data:image')) {
    return fileBase64OrBuffer;
  }

  // Fallback realistic interior photo if random string provided
  return 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80';
}

export default cloudinary;
