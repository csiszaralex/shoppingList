'use client';

import { useEffect, useState } from 'react';
import AddProduct from './AddProduct';
import CurrentStock from './currentStock';
import { Product } from './types/Product';
import { fetchProducts } from './fetchProducts';



export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
    });
    // const interval = setInterval(() => {
    //   fetchProducts();
    // }, 10000);

    // return () => clearInterval(interval);
  }, []);

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
    // setLoading(true);
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

  return (
    <>
      <CurrentStock
        products={products}
        handleUseProduct={handleUseProduct}
        updateProduct={updateProduct}
      />
      {/* <button
          onClick={() => setIsModalOpen(true)}
          className='mt-8 w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition dark:bg-green-700 dark:hover:bg-green-800 mb-4'
        >
          Add Product
        </button> */}

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
    </>
  );
}
