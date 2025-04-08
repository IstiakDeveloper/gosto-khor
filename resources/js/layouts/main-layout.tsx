import React, { ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { User } from '@/types';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

interface PageProps {
  auth: {
    user: User | null;
  };
  flash: {
    success: string | null;
    error: string | null;
  };
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  const { auth, flash } = usePage<PageProps>().props;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-red-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">GostoKhor</Link>
          <div className="flex space-x-4 items-center">
            {auth.user ? (
              <>
                <span className="hidden md:inline">{auth.user.name}</span>
                <div className="relative group">
                  <button className="flex items-center space-x-1 hover:text-red-200">
                    <span>Menu</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link href="/home" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-100">Dashboard</Link>
                    {auth.user.is_admin && (
                      <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-100">Admin Panel</Link>
                    )}
                    <Link href="/organization/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-100">Organization</Link>
                    <Link href="/organization/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-100">Profile</Link>
                    <Link
                      href="/logout"
                      method="post"
                      as="button"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
                    >
                      Logout
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-red-200">Login</Link>
                <Link href="/register" className="bg-white text-red-700 hover:bg-red-100 px-4 py-2 rounded-md">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {(flash.success || flash.error) && (
        <div className="container mx-auto px-4 mt-4">
          {flash.success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              {flash.success}
            </div>
          )}
          {flash.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {flash.error}
            </div>
          )}
        </div>
      )}

      <main className="container mx-auto px-4 py-6">
        {title && <h1 className="text-3xl font-bold mb-6 text-gray-800">{title}</h1>}
        {children}
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">GostoKhor</h3>
              <p className="text-gray-300">Easy Somiti Management System</p>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
              <div>
                <h4 className="text-lg font-semibold mb-2">Links</h4>
                <ul className="space-y-2">
                  <li><Link href="/" className="hover:text-red-300">Home</Link></li>
                  <li><Link href="/pricing" className="hover:text-red-300">Pricing</Link></li>
                  <li><Link href="/about" className="hover:text-red-300">About</Link></li>
                  <li><Link href="/contact" className="hover:text-red-300">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Contact</h4>
                <p className="text-gray-300">Email: info@gostoKhor.com</p>
                <p className="text-gray-300">Phone: +880 123 456 7890</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} GostoKhor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
