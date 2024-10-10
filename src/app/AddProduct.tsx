import { useState } from 'react';

type AddProductProps = {
  onAddProduct: (name: string, quantity: number) => void;
};

const AddProduct: React.FC<AddProductProps> = ({ onAddProduct }) => {
  const [productName, setProductName] = useState('');
  const [productQuantity, setProductQuantity] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productName && productQuantity > 0) {
      onAddProduct(productName, productQuantity);
      setProductName(''); // Mezők alaphelyzetbe állítása
      setProductQuantity(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Add New Product</h2>

      <div className="mb-4">
        <label htmlFor="productName" className="block text-lg font-medium dark:text-gray-200">
          Product Name
        </label>
        <input
          id="productName"
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="mt-1 p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
          placeholder="Enter product name"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="productQuantity" className="block text-lg font-medium dark:text-gray-200">
          Quantity
        </label>
        <input
          id="productQuantity"
          type="number"
          value={productQuantity}
          onChange={(e) => setProductQuantity(Number(e.target.value))}
          className="mt-1 p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
          placeholder="Enter quantity"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition dark:bg-green-700 dark:hover:bg-green-800"
      >
        Add Product
      </button>
    </form>
  );
};

export default AddProduct;
