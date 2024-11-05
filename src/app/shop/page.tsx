'use client';

import { useEffect, useState } from 'react';
import ShoppingList from '../shoppingList';
import { Product } from '../types/Product';
import { fetchProducts } from '../fetchProducts';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
    });
    // const interval = setInterval(() => {
    //   fetchProducts();
    // }, 10000);

    // return () => clearInterval(interval);
  }, []);


  const handleShoppingCart = async (id: number, db: number) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((p) =>
        p.id === id
          ? { ...p, quantityInCart: p.quantityInCart + db < 0 ? 0 : p.quantityInCart + db }
          : p
      );
      const cartQuantities = updatedProducts.reduce((acc, product) => {
        acc[product.id] = product.quantityInCart;
        return acc;
      }, {} as Record<number, number>);
      localStorage.setItem('cartQuantities', JSON.stringify(cartQuantities));
      return updatedProducts;
    });
  };

  function handleRestock() {
    products.forEach((product) => {
      if (product.quantityInCart > 0) {
        updateProduct(product.id, product.quantityInCart + product.quantity);
      }
    });
    setProducts((prevProducts) => prevProducts.map((p) => ({ ...p, quantityInCart: 0 })));
    localStorage.setItem('cartQuantities', JSON.stringify({}));
  }

  const updateProduct = async (id: number, quantity: number) => {
    await fetch('/api/products', {
      method: 'PUT',
      body: JSON.stringify({ id, quantity }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, inCart: false, quantity } : product
      )
    );
  };

  return (
    <>
      <ShoppingList
        products={products}
        handleShoppingCart={handleShoppingCart}
        handleRestock={handleRestock}
      />
    </>
  );
}
