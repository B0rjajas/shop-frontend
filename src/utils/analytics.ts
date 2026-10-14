// src/utils/analytics.ts
declare global {
    interface Window { gtag: any; dataLayer: any; }
  }
  
  export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, params);
  };
  
  // Eventos de ecommerce estándar GA4
  export const trackViewProduct = (product: any) => {
    trackEvent('view_item', {
      currency: 'EUR',
      value: product.price,
      items: [{
        item_id: String(product.id),
        item_name: product.name,
        price: product.price,
        item_category: product.category?.name || '',
      }],
    });
  };
  
  export const trackAddToCart = (product: any, quantity: number) => {
    trackEvent('add_to_cart', {
      currency: 'EUR',
      value: product.price * quantity,
      items: [{
        item_id: String(product.id),
        item_name: product.name,
        price: product.price,
        quantity,
      }],
    });
  };
  
  export const trackBeginCheckout = (items: any[], total: number) => {
    trackEvent('begin_checkout', {
      currency: 'EUR',
      value: total,
      items: items.map(i => ({
        item_id: String(i.product_id),
        item_name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
    });
  };