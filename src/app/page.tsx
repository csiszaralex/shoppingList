'use client';

import { useEffect, useState } from 'react';
import AddProduct from './AddProduct';
import { Product } from './api/types/Product';
import CurrentStock from './currentStock';
import ShoppingList from './shoppingList';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(() => {
      fetchProducts();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

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

  const addProduct = async (name: string, quantity: number) => {
    setLoading(true);
    await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify({ name, quantity }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    fetchProducts();
  };

  const handleUseProduct = async (id: number) => {
    await fetch('/api/products', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, inCart: false, quantity: product.quantity - 1 } : product
      )
    );
  };

  const handleShoppingCart = async (id: number, db: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === id
          ? { ...p, quantityInCart: p.quantityInCart + db < 0 ? 0 : p.quantityInCart + db }
          : p
      )
    );
  };

  function handleRestock() {
    products.forEach((product) => {
      if (product.quantityInCart > 0) {
        updateProduct(product.id, product.quantityInCart + product.quantity);
      }
    });
    setProducts((prevProducts) => prevProducts.map((p) => ({ ...p, quantityInCart: 0 })));
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className='container mx-auto p-4'>
      <CurrentStock
        products={products}
        handleUseProduct={handleUseProduct}
        updateProduct={updateProduct}
      />

      <ShoppingList
        products={products}
        handleShoppingCart={handleShoppingCart}
        handleRestock={handleRestock}
      />

      <AddProduct onAddProduct={addProduct} />
    </div>
  );
}

