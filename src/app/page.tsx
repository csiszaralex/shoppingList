'use client';

import { useEffect, useState } from 'react';
import AddProduct from './AddProduct';
import CurrentStock from './currentStock';
import ShoppingList from './shoppingList';
import { Product } from './types/Product';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'stock' | 'shopping'>('shopping'); // Választó állapota
  const [isModalOpen, setIsModalOpen] = useState(false); // Felugró ablak állapota

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
      const cartQuantities = JSON.parse(localStorage.getItem('cartQuantities') || '{}');
      setProducts(
        data.map((product: Product) => ({
          ...product,
          quantityInCart: cartQuantities[product.id] || 0,
        }))
      );
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

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='loader'></div>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4'>
      {/* Választó */}
      <div className='flex justify-center mb-4'>
        <button
          onClick={() => setView('stock')}
          className={`px-4 py-2 w-1/2 rounded-l-full ${
            view === 'stock'
              ? 'bg-blue-500 text-white dark:bg-blue-700'
              : 'bg-gray-200 text-black dark:bg-gray-700 dark:text-white'
          }`}
        >
          Current Stock
        </button>
        <button
          onClick={() => setView('shopping')}
          className={`px-4 py-2 w-1/2 rounded-r-full ${
            view === 'shopping'
              ? 'bg-blue-500 text-white dark:bg-blue-700'
              : 'bg-gray-200 text-black dark:bg-gray-700 dark:text-white'
          }`}
        >
          Shopping List
        </button>
      </div>

      {/* Választott nézet megjelenítése */}
      {view === 'stock' ? (
        <>
          <CurrentStock
            products={products}
            handleUseProduct={handleUseProduct}
            updateProduct={updateProduct}
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className='mt-8 w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition dark:bg-green-700 dark:hover:bg-green-800 mb-4'
          >
            Add Product
          </button>
        </>
      ) : (
        <ShoppingList
          products={products}
          handleShoppingCart={handleShoppingCart}
          handleRestock={handleRestock}
        />
      )}

      {isModalOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'
          onClick={() => setIsModalOpen(false)} // Close modal on backdrop click
        >
          <div
            className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl relative'
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* X gomb a bezáráshoz */}
            <button
              onClick={() => setIsModalOpen(false)}
              className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
            >
              &times;
            </button>

            <h2 className='text-2xl mb-4 dark:text-white'>Add New Product</h2>
            <AddProduct onAddProduct={addProduct} isInModal />
          </div>
        </div>
      )}
    </div>
  );
}

