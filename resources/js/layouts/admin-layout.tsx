import React, { ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { User } from '@/types';

interface AdminLayoutProps {
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

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
    const { auth, flash } = usePage<PageProps>().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`bg-gray-800 text-white ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out flex-shrink-0 overflow-hidden`}>
                <div className="p-4 flex items-center justify-between">
                    {sidebarOpen ? (
                        <Link href="/admin/dashboard" className="text-xl font-bold">Admin Panel</Link>
                    ) : (
                        <Link href="/admin/dashboard" className="text-xl font-bold">AP</Link>
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
                        href="/admin/dashboard"
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${window.location.pathname === '/admin/dashboard' ? 'bg-red-700 text-white' : 'text-gray-300 hover:bg-red-600 hover:text-white'}`}
                    >
                        <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {sidebarOpen && <span>Dashboard</span>}
                    </Link>

                    <Link
                        href="/admin/organizations"
                        className={`mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md ${window.location.pathname.startsWith('/admin/organizations') ? 'bg-red-700 text-white' : 'text-gray-300 hover:bg-red-600 hover:text-white'}`}
                    >
                        <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {sidebarOpen && <span>Organizations</span>}
                    </Link>

                    <Link
                        href="/admin/subscriptions"
                        className={`mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md ${window.location.pathname.startsWith('/admin/subscriptions') ? 'bg-red-700 text-white' : 'text-gray-300 hover:bg-red-600 hover:text-white'}`}
                    >
                        <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {sidebarOpen && <span>Subscriptions</span>}
                    </Link>

                    <Link
                        href="/admin/subscriptions/plans"
                        className={`mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md ${window.location.pathname.startsWith('/admin/subscriptions/plans') ? 'bg-red-700 text-white' : 'text-gray-300 hover:bg-red-600 hover:text-white'}`}
                    >
                        <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        {sidebarOpen && <span>Plans</span>}
                    </Link>

                    <Link
                        href="/admin/users"
                        className={`mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md ${window.location.pathname.startsWith('/admin/users') ? 'bg-red-700 text-white' : 'text-gray-300 hover:bg-red-600 hover:text-white'}`}
                    >
                        <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {sidebarOpen && <span>Users</span>}
                    </Link>

                    <Link
                        href="/admin/roles"
                        className={`mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md ${window.location.pathname.startsWith('/admin/roles') ? 'bg-red-700 text-white' : 'text-gray-300 hover:bg-red-600 hover:text-white'}`}
                    >
                        <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        {sidebarOpen && <span>Roles</span>}
                    </Link>

                    <Link
                        href="/admin/permissions"
                        className={`mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md ${window.location.pathname.startsWith('/admin/permissions') ? 'bg-red-700 text-white' : 'text-gray-300 hover:bg-red-600 hover:text-white'}`}
                    >
                        <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                        {sidebarOpen && <span>Permissions</span>}
                    </Link>

                    <div className="pt-4 mt-4 border-t border-gray-700">
                        <Link
                            href="/"
                            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-red-600 hover:text-white"
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
                            className="mt-1 w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-red-600 hover:text-white"
                        >
                            <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            {sidebarOpen && <span>Logout</span>}
                        </Link>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white shadow-sm z-10">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">{auth.user?.name}</span>
                            <div className="relative">
                                <button className="flex items-center text-gray-700 focus:outline-none">
                                    <div className="h-8 w-8 rounded-full bg-red-700 flex items-center justify-center text-white">
                                        {auth.user?.name.charAt(0).toUpperCase()}
                                    </div>
                                </button>
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

export default AdminLayout;
