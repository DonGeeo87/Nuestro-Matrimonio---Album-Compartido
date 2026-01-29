
import { WeddingPhoto } from '../types.ts';

const CLOUD_NAME = "dzmwybq2v"; 
const UPLOAD_PRESET: string = "boda_preset"; 
const WEDDING_TAG = "boda_rocio_matias";

const isConfigured = UPLOAD_PRESET !== "TU_UPLOAD_PRESET_AQUÍ";

const sanitizeMetadata = (text: string) => {
  return text.replace(/[=|]/g, ' ').trim();
};

export const subscribeToPhotos = (callback: (photos: WeddingPhoto[]) => void) => {
  if (!isConfigured) {
    const saved = localStorage.getItem('wedding_memories_fallback');
    callback(saved ? JSON.parse(saved) : []);
    return () => {};
  }

  const fetchPhotos = async () => {
    try {
      const response = await fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${WEDDING_TAG}.json?t=${Date.now()}`);
      
      if (!response.ok) {
        return;
      }
      
      const data = await response.json();
      const photos: WeddingPhoto[] = data.resources.map((res: any) => {
        const ctx = res.context?.custom || {};
        return {
          id: res.public_id,
          url: `https://res.cloudinary.com/${CLOUD_NAME}/${res.resource_type}/upload/f_auto,q_auto/${res.public_id}.${res.format}`,
          type: res.resource_type === 'video' ? 'video' : 'image',
          author: ctx.author || "Invitado Anónimo",
          dedication: ctx.dedication || "¡Felicidades a los novios!",
          timestamp: new Date(res.created_at).getTime()
        };
      });
      
      photos.sort((a, b) => b.timestamp - a.timestamp);
      callback(photos);
    } catch (error) {
      console.error("Error al obtener fotos de Cloudinary:", error);
    }
  };

  fetchPhotos();
  const interval = setInterval(fetchPhotos, 10000); 
  return () => clearInterval(interval);
};

export const savePhotoToCloud = async (photo: { file: File; author: string; dedication: string }) => {
  if (!isConfigured) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(photo.file);
      reader.onloadend = () => {
        const saved = localStorage.getItem('wedding_memories_fallback');
        const photos = saved ? JSON.parse(saved) : [];
        const entry: WeddingPhoto = {
          id: Math.random().toString(36).substr(2, 9),
          url: reader.result as string,
          type: photo.file.type.startsWith('video') ? 'video' : 'image',
          author: photo.author,
          dedication: photo.dedication,
          timestamp: Date.now()
        };
        localStorage.setItem('wedding_memories_fallback', JSON.stringify([entry, ...photos]));
        resolve(true);
      };
    });
  }

  const formData = new FormData();
  formData.append('file', photo.file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('tags', WEDDING_TAG);
  
  const safeAuthor = sanitizeMetadata(photo.author);
  const safeDedication = sanitizeMetadata(photo.dedication);
  formData.append('context', `author=${safeAuthor}|dedication=${safeDedication}`);

  const resourceType = photo.file.type.startsWith('video') ? 'video' : 'image';
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error?.message || "Error al subir a Cloudinary");
  }

  return await response.json();
};

export const isCloudActive = () => isConfigured;
