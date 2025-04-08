import React, { ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { User } from '@/types';

interface OrganizationLayoutProps {
  children: ReactNode;
  title: string;
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

const OrganizationLayout: React.FC<OrganizationLayoutProps> = ({ children, title }) => {
  const { auth, flash } = usePage<PageProps>().props;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <div className={`bg-red-800 text-white ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out flex-shrink-0 hidden md:block`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen ? (
            <Link href="/organization/dashboard" className="text-xl font-bold">GostoKhor</Link>
          ) : (
            <Link href="/organization/dashboard" className="text-xl font-bold">GK</Link>
          )}
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            {sidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
        <nav className="mt-5 px-2">
          <Link
            href="/organization/dashboard"
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${window.location.pathname === '/organization/dashboard' ? 'bg-red-900 text-white' : 'text-white hover:bg-red-700 hover:text-white'}`}
          >
            <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {sidebarOpen && <span>Dashboard</span>}
          </Link>

          <Link
            href="/organization/somitis"
            className={`mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md ${window.location.pathname.startsWith('/organization/somitis') ? 'bg-red-900 text-white' : 'text-white hover:bg-red-700 hover:text-white'}`}
          >
            <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            {sidebarOpen && <span>Somitis</span>}
          </Link>

          <Link
            href="/organization/members"
            className={`mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md ${window.location.pathname.startsWith('/organization/members') ? 'bg-red-900 text-white' : 'text-white hover:bg-red-700 hover:text-white'}`}
          >
            <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {sidebarOpen && <span>Members</span>}
          </Link>

          <Link
            href="/organization/payments"
            className={`mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md ${window.location.pathname.startsWith('/organization/payments') ? 'bg-red-900 text-white' : 'text-white hover:bg-red-700 hover:text-white'}`}
          >
            <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {sidebarOpen && <span>Payments</span>}
          </Link>

          <Link
            href="/organization/reports"
            className={`mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md ${window.location.pathname.startsWith('/organization/reports') ? 'bg-red-900 text-white' : 'text-white hover:bg-red-700 hover:text-white'}`}
          >
            <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {sidebarOpen && <span>Reports</span>}
          </Link>

          <div className="pt-4 mt-4 border-t border-red-700">
            <Link
              href="/organization/profile"
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${window.location.pathname.startsWith('/organization/profile') ? 'bg-red-900 text-white' : 'text-white hover:bg-red-700 hover:text-white'}`}
            >
              <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {sidebarOpen && <span>Profile</span>}
            </Link>

            <Link
              href="/organization/profile/organization"
              className={`mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md ${window.location.pathname.startsWith('/organization/profile/organization') ? 'bg-red-900 text-white' : 'text-white hover:bg-red-700 hover:text-white'}`}
            >
              <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {sidebarOpen && <span>Organization</span>}
            </Link>

            <Link
              href="/"
              className="mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-red-700 hover:text-white"
            >
              <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {sidebarOpen && <span>Main Site</span>}
            </Link>

            <Link
              href="/logout"
              method="post"
              as="button"
              className="mt-1 w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-red-700 hover:text-white"
            >
              <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {sidebarOpen && <span>Logout</span>}
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-red-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Link href="/organization/dashboard" className="text-xl font-bold text-white">GostoKhor</Link>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {/* Same navigation links as desktop but without conditional rendering */}
              <Link
                href="/organization/dashboard"
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${window.location.pathname === '/organization/dashboard' ? 'bg-red-900 text-white' : 'text-white hover:bg-red-700 hover:text-white'}`}
              >
                <svg className="mr-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>

              <Link
                href="/organization/somitis"
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${window.location.pathname.startsWith('/organization/somitis') ? 'bg-red-900 text-white' : 'text-white hover:bg-red-700 hover:text-white'}`}
              >
                <svg className="mr-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                Somitis
              </Link>

              <Link
                href="/organization/members"
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${window.location.pathname.startsWith('/organization/members') ? 'bg-red-900 text-white' : 'text-white hover:bg-red-700 hover:text-white'}`}
              >
                <svg className="mr-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Members
              </Link>

              <Link
                href="/organization/payments"
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${window.location.pathname.startsWith('/organization/payments') ? 'bg-red-900 text-white' : 'text-white hover:bg-red-700 hover:text-white'}`}
              >
                <svg className="mr-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Payments
              </Link>

              <Link
                href="/organization/reports"
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${window.location.pathname.startsWith('/organization/reports') ? 'bg-red-900 text-white' : 'text-white hover:bg-red-700 hover:text-white'}`}
              >
                <svg className="mr-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Reports
              </Link>

              <Link
                href="/organization/profile"
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${window.location.pathname.startsWith('/organization/profile') ? 'bg-red-900 text-white' : 'text-white hover:bg-red-700 hover:text-white'}`}
              >
                <svg className="mr-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </Link>
            </nav>
          </div>

          <div className="flex-shrink-0 flex border-t border-red-700 p-4">
            <Link href="/logout" method="post" as="button" className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div>
                  <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white">
                    {auth.user?.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-white">{auth.user?.name}</p>
                  <p className="text-sm font-medium text-red-200 group-hover:text-white">Logout</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <button
                className="md:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl font-semibold text-gray-900 ml-2 md:ml-0">{title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 hidden md:inline">{auth.user?.name}</span>
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-red-700 flex items-center justify-center text-white">
                  {auth.user?.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          {(flash.success || flash.error) && (
            <div className="mb-4">
              {flash.success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                  {flash.success}
                </div>
              )}
              {flash.error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {flash.error}
                </div>
              )}
            </div>
          )}

          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrganizationLayout;
