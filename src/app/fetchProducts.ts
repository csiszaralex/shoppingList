// 'use server';

import { Product } from './types/Product';

export async function fetchProducts(): Promise<Product[]> {
  // TODO maybe error handling
  const res = await fetch('/api/products');
  // const res = await  GET();
  const data = await res.json();
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  const cartQuantities = JSON.parse(localStorage.getItem('cartQuantities') || '{}');
  return data.map((product: Product) => ({
    ...product,
    quantityInCart: cartQuantities[product.id] || 0,
  }));
}
