import React, { ReactNode, useState, useEffect } from 'react';
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
    const [mobileView, setMobileView] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
                setMobileView(true);
            } else {
                setMobileView(false);
                setMobileMenuOpen(false);
            }
        };

        // Set initial state
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        if (mobileView) {
            setMobileMenuOpen(!mobileMenuOpen);
        } else {
            setSidebarOpen(!sidebarOpen);
        }
    };

    // Navigation items array for DRY code
    const navigationItems = [
        {
            href: '/admin/dashboard',
            name: 'Dashboard',
            icon: (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            href: '/admin/organizations',
            name: 'Organizations',
            icon: (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
        },
        {
            href: '/admin/subscriptions',
            name: 'Subscriptions',
            icon: (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            href: '/admin/subscriptions/plans',
            name: 'Plans',
            icon: (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
        },
        {
            href: '/admin/users',
            name: 'Users',
            icon: (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
        },
        {
            href: '/admin/roles',
            name: 'Roles',
            icon: (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
        },
        {
            href: '/admin/permissions',
            name: 'Permissions',
            icon: (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
            ),
        },
    ];

    // Footer navigation items
    const footerNavItems = [
        {
            href: '/',
            name: 'Main Site',
            icon: (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            method: undefined,
            as: undefined,
        },
        {
            href: '/logout',
            name: 'Logout',
            icon: (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            ),
            method: 'post',
            as: 'button',
        },
    ];

    const renderNavItem = (item: typeof navigationItems[0], index: number) => {
        return (
            <Link
                key={index}
                href={item.href}
                className={`mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    window.location.pathname === item.href || window.location.pathname.startsWith(item.href)
                        ? 'bg-red-700 text-white'
                        : 'text-gray-300 hover:bg-red-600 hover:text-white'
                }`}
            >
                <div className="mr-3">{item.icon}</div>
                {(sidebarOpen || mobileMenuOpen) && <span>{item.name}</span>}
            </Link>
        );
    };

    const renderFooterItem = (item: typeof footerNavItems[0], index: number) => {
        return (
            <Link
                key={index}
                href={item.href}
                method={item.method}
                as={item.as}
                className={`mt-1 w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-red-600 hover:text-white`}
            >
                <div className="mr-3">{item.icon}</div>
                {(sidebarOpen || mobileMenuOpen) && <span>{item.name}</span>}
            </Link>
        );
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar for desktop */}
            <div
                className={`bg-gray-800 text-white md:flex flex-col z-30 transition-all duration-300 ease-in-out ${
                    mobileView
                        ? mobileMenuOpen
                            ? 'fixed inset-y-0 left-0 w-64'
                            : 'fixed inset-y-0 -left-64 w-64'
                        : sidebarOpen
                            ? 'w-64'
                            : 'w-20'
                } ${mobileView ? 'md:relative md:left-0' : 'hidden md:flex'}`}
            >
                <div className="p-4 flex items-center justify-between">
                    {(sidebarOpen || mobileMenuOpen) ? (
                        <Link href="/admin/dashboard" className="text-xl font-bold">Admin Panel</Link>
                    ) : (
                        <Link href="/admin/dashboard" className="text-xl font-bold">AP</Link>
                    )}
                    <button onClick={toggleSidebar} className="text-white focus:outline-none">
                        {(sidebarOpen || mobileMenuOpen) ? (
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
                <nav className="mt-5 px-2 flex-1 overflow-y-auto">
                    {navigationItems.map(renderNavItem)}

                    <div className="pt-4 mt-4 border-t border-gray-700">
                        {footerNavItems.map(renderFooterItem)}
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white shadow-sm z-10">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <div className="flex items-center">
                            {/* Mobile menu button */}
                            {mobileView && (
                                <button
                                    onClick={toggleSidebar}
                                    className="mr-2 md:hidden text-gray-700 focus:outline-none"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            )}
                            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 truncate">{title}</h1>
                        </div>
                        <div className="flex items-center space-x-2 md:space-x-4">
                            <span className="text-sm md:text-base text-gray-700 hidden sm:inline">{auth.user?.name}</span>
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
                <main className="flex-1 overflow-y-auto bg-gray-100 p-2 sm:p-4">
                    {(flash.success || flash.error) && (
                        <div className="mb-4">
                            {flash.success && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 sm:px-4 sm:py-3 rounded relative">
                                    {flash.success}
                                </div>
                            )}
                            {flash.error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded relative">
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
