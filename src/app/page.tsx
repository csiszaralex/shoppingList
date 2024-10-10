'use client';

import { useState, useEffect } from 'react';

type Product = {
  id: number;
  name: string;
  quantity: number;
  quantityInCart: number;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.map((p: Product) => ({ ...p, quantityInCart: 0 })));
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const updateProduct = async (id: number, quantity: number) => {
    await fetch('/api/products', {
      method: 'POST',
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
        updateProduct(product.id, product.quantityInCart+product.quantity); // Például újra feltöltjük 10 darabra
      }
    });
    setProducts((prevProducts) =>
      prevProducts.map((p) => ({ ...p, quantityInCart: 0 }))
    );
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
  <h1 className="text-3xl font-bold mb-4 dark:text-white">Current Stock</h1>
  <ul className="space-y-4">
    {products.map((product) => (
      <li
        key={product.id}
        className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md"
      >
        <div className="text-lg dark:text-gray-200">
          {product.name} -{' '}
          <span className={product.quantity === 0 ? 'text-red-500' : 'text-green-500'}>
            {product.quantity} in stock
          </span>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => handleUseProduct(product.id)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Use
          </button>
          <button
            onClick={() => updateProduct(product.id, 0)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Use All
          </button>
        </div>
      </li>
    ))}
  </ul>

  <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">Shopping List</h2>
  <ul className="space-y-4">
    {products.map((product) => (
      <li
        key={product.id}
        className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md"
      >
        <div className="flex items-center space-x-4 dark:text-gray-200">
          <button
            onClick={() => handleShoppingCart(product.id, -1)}
            className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-gray-400 dark:hover:bg-gray-700 transition"
          >
            -
          </button>
          <span className="text-lg">{product.name}</span>
          <button
            onClick={() => handleShoppingCart(product.id, 1)}
            className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-gray-400 dark:hover:bg-gray-700 transition"
          >
            +
          </button>
        </div>
        <div className="text-lg dark:text-gray-200">
          <span className="font-bold">{product.quantityInCart}</span> in cart
        </div>
      </li>
    ))}
  </ul>

  <button
    onClick={handleRestock}
    className="mt-8 w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition dark:bg-green-700 dark:hover:bg-green-800"
  >
    Restock
  </button>
</div>


  );
}

