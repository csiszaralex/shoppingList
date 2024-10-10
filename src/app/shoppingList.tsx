import { Product } from './api/types/Product';

type ShoppingCartProps = {
  products: Product[];
  handleShoppingCart: (id: number, quantity: number) => void;
  handleRestock: () => void;
};

const ShoppingList: React.FC<ShoppingCartProps> = ({
  products,
  handleShoppingCart,
  handleRestock,
}) => {
  return (
    <>
      <h2 className='text-2xl font-semibold mt-8 mb-4 dark:text-white'>Shopping List</h2>
      <ul className='space-y-4'>
        {products.map((product) => (
          <li
            key={product.id}
            className='flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md'
          >
            <div className='flex items-center space-x-4 dark:text-gray-200'>
              <button
                onClick={() => handleShoppingCart(product.id, -1)}
                className='px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-gray-400 dark:hover:bg-gray-700 transition'
              >
                -
              </button>
              <span className='text-lg'>{product.name}</span>
              <button
                onClick={() => handleShoppingCart(product.id, 1)}
                className='px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-gray-400 dark:hover:bg-gray-700 transition'
              >
                +
              </button>
            </div>
            <div className='text-lg dark:text-gray-200'>
              <span className='font-bold'>{product.quantityInCart}</span> in cart
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={handleRestock}
        className='mt-8 w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition dark:bg-green-700 dark:hover:bg-green-800 mb-4'
      >
        Restock
      </button>
    </>
  );
};

export default ShoppingList;
