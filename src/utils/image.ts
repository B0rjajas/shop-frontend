// src/utils/image.ts
import { API_URL } from '@/config';

export const getImageUrl = (path: string): string => {
  if (!path) {
    // Si no hay ruta, devolvemos un placeholder externo (no local)
    return 'https://via.placeholder.com/150/42b883/FFFFFF?text=Producto';
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path; // Cloudinary o URL externa
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
};