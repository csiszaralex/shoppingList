'use client';

import { useRouter, usePathname } from "next/navigation";


const NavigationButtons = () => {
  const router = useRouter();
  const currentPath = usePathname();

  return (
    <div className='flex justify-center mb-4'>
      <button
        onClick={() => router.push('/')}
        className={`px-4 py-2 w-1/2 rounded-l-full ${
          currentPath === '/'
            ? 'bg-blue-500 text-white dark:bg-blue-700'
            : 'bg-gray-200 text-black dark:bg-gray-700 dark:text-white'
        }`}
      >
        Current Stock
      </button>
      <button
        onClick={() => router.push('/shop')}
        className={`px-4 py-2 w-1/2 rounded-r-full ${
          currentPath === '/shop'
            ? 'bg-blue-500 text-white dark:bg-blue-700'
            : 'bg-gray-200 text-black dark:bg-gray-700 dark:text-white'
        }`}
      >
        Shopping List
      </button>
    </div>
  );
};

export default NavigationButtons;
