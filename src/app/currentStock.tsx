import { Product } from './api/types/Product';

type CurrentStockProps = {
  products: Product[];
  handleUseProduct: (id: number) => void;
  updateProduct: (id: number, quantity: number) => void;
};

const CurrentStock: React.FC<CurrentStockProps> = ({
  products,
  handleUseProduct,
  updateProduct,
}) => {
  return (
    <>
      <h1 className='text-3xl font-bold mb-4 dark:text-white'>Current Stock</h1>
      <ul className='space-y-4'>
        {products.map((product) => (
          <li
            key={product.id}
            className='flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md'
          >
            <div className='text-lg dark:text-gray-200'>
              {product.name} -{' '}
              <span className={product.quantity === 0 ? 'text-red-500' : 'text-green-500'}>
                {product.quantity} in stock
              </span>
            </div>
            <div className='space-x-2'>
              <button
                onClick={() => handleUseProduct(product.id)}
                className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'
              >
                Use
              </button>
              <button
                onClick={() => updateProduct(product.id, 0)}
                className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition'
              >
                Use All
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default CurrentStock;
