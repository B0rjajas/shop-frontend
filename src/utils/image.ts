import { API_URL } from '@/config';

export const getImageUrl = (path: string): string => {
  if (!path) return '/placeholder-product.png'; // o banner según contexto
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path; // Cloudinary o URL externa
  }
  // Si la ruta ya tiene barra, la conservamos, sino la agregamos
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
};