
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
    return () => { };
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
        const resourceType = res.resource_type || 'image'; // Fallback a 'image' si no viene definido
        return {
          id: res.public_id,
          url: `https://res.cloudinary.com/${CLOUD_NAME}/${resourceType}/upload/f_auto,q_auto/${res.public_id}.${res.format}`,
          type: resourceType === 'video' ? 'video' : 'image',
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

// Función auxiliar para comprimir imágenes
const compressImage = async (file: File): Promise<File> => {
  if (!file.type.startsWith('image')) return file;
  if (file.size < 1024 * 1024) return file; // < 1MB ya es ligero

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(file); return; }

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const newName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
            const newFile = new File([blob], newName, { type: 'image/jpeg', lastModified: Date.now() });
            console.log(`Compresión: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(newFile.size / 1024 / 1024).toFixed(2)}MB`);
            resolve(newFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', 0.8);
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
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

  // Comprimir imagen si es necesario
  const fileToUpload = await compressImage(photo.file);

  const formData = new FormData();
  formData.append('file', fileToUpload);
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
