import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center h-screen text-center bg-gray-100 dark:bg-gray-800'>
      <h1 className='text-6xl font-bold text-blue-500 dark:text-blue-400'>404</h1>
      <p className='mt-4 text-xl text-gray-700 dark:text-gray-300'>Oops! Page not found.</p>
      <p className='mt-2 text-lg text-gray-600 dark:text-gray-400'>
        The page you are looking for does not exist.
      </p>
      <Link
        href='/'
        className='mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500'
      >
        Go Back Home
      </Link>
    </div>
  );
}
