import { API_URL } from '@/config';

export const getImageUrl = (path: string): string => {
  if (!path) {
    console.warn('getImageUrl: path vacío, usando placeholder');
    return '/placeholder-product.png';
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    console.log('getImageUrl: URL absoluta', path);
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = `${API_URL}${cleanPath}`;
  console.log('getImageUrl: URL construida', fullUrl);
  return fullUrl;
};