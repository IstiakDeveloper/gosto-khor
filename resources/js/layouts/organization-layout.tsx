import React, { ReactNode, useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { User } from '@/types';

interface OrganizationLayoutProps {
    children: ReactNode;
    title: string;
}

interface Organization {
    id: number;
    name: string;
    domain: string;
}

interface PageProps {
    auth: {
        user: User | null;
    };
    flash: {
        success: string | null;
        error: string | null;
    };
    organization: Organization | null;
}

const OrganizationLayout: React.FC<OrganizationLayoutProps> = ({ children, title }) => {
    const { auth, flash, organization } = usePage<PageProps>().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Handle responsive sidebar based on screen width
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        // Initial check
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    // Navigation items for DRY code
    const navigationItems = [
        {
            name: 'Dashboard',
            href: '/organization/dashboard',
            icon: (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            exact: true
        },
        {
            name: 'Somitis',
            href: '/organization/somitis',
            icon: (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
            )
        },
        {
            name: 'Members',
            href: '/organization/members',
            icon: (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
        {
            name: 'Payments',
            href: '/organization/payments',
            icon: (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            name: 'Reports',
            href: '/organization/reports',
            icon: (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        }
    ];

    // Secondary navigation items (profile section)
    const secondaryNavItems = [
        {
            name: 'Profile',
            href: '/organization/profile',
            icon: (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        {
            name: 'Organization',
            href: '/organization/profile/organization',
            icon: (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        },
        {
            name: 'Main Site',
            href: `/${organization?.domain ?? ''}`,
            icon: (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        }
    ];

    // Check if a route is active
    const isActive = (path: string, exact = false) => {
        if (exact) {
            return window.location.pathname === path;
        }
        return window.location.pathname.startsWith(path);
    };

    const renderNavItems = (items: any[], isMobile = false) => {
        return items.map((item, index) => (
            <Link
                key={index}
                href={item.href}
                className={`${isMobile ? 'text-base py-2' : 'text-sm py-2'} group flex items-center px-2 font-medium rounded-md transition-colors duration-200 ${
                    isActive(item.href, item.exact)
                        ? 'bg-red-900 text-white'
                        : 'text-white hover:bg-red-700 hover:text-white'
                } ${isMobile ? '' : 'mt-1'}`}
                onClick={isMobile ? closeMobileMenu : undefined}
            >
                <div className={`${isMobile ? 'mr-4' : 'mr-3'} flex-shrink-0`}>
                    {item.icon}
                </div>
                <span className={`${sidebarOpen || isMobile ? 'block' : 'hidden'} transition-opacity duration-200`}>
                    {item.name}
                </span>
            </Link>
        ));
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Desktop Sidebar */}
            <div
                className={`bg-red-800 text-white transition-all duration-300 ease-in-out flex-shrink-0 hidden lg:block
                    ${sidebarOpen ? 'w-64' : 'w-20'}`}
            >
                <div className="p-4 flex items-center justify-between">
                    {sidebarOpen ? (
                        <Link href="/organization/dashboard" className="text-xl font-bold truncate">GostoKhor</Link>
                    ) : (
                        <Link href="/organization/dashboard" className="text-xl font-bold">GK</Link>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className="text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-md p-1"
                        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        {sidebarOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Main navigation */}
                <nav className="mt-5 px-2 space-y-0.5">
                    {renderNavItems(navigationItems)}
                </nav>

                {/* Secondary navigation */}
                <div className="pt-4 mt-4 border-t border-red-700 px-2">
                    {renderNavItems(secondaryNavItems)}

                    {/* Logout button */}
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className={`w-full mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-red-700 hover:text-white transition-colors duration-200`}
                    >
                        <svg className="mr-3 h-6 w-6 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className={`${sidebarOpen ? 'block' : 'hidden'} transition-opacity duration-200`}>
                            Logout
                        </span>
                    </Link>
                </div>
            </div>

            {/* Mobile menu overlay */}
            <div
                className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ease-in-out ${
                    mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            >
                {/* Dark overlay */}
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75"
                    onClick={closeMobileMenu}
                    aria-hidden="true"
                ></div>

                {/* Side drawer menu */}
                <div className="relative flex flex-col w-full max-w-xs bg-red-800 h-full overflow-y-auto">
                    <div className="absolute top-0 right-0 pt-2 -mr-12">
                        <button
                            className="flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                            onClick={closeMobileMenu}
                            aria-label="Close menu"
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
                            {renderNavItems(navigationItems, true)}
                            <div className="pt-4 mt-4 border-t border-red-700">
                                {renderNavItems(secondaryNavItems, true)}

                                {/* Mobile Logout */}
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="w-full group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-red-700 hover:text-white transition-colors duration-200"
                                    onClick={closeMobileMenu}
                                >
                                    <svg className="mr-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </Link>
                            </div>
                        </nav>
                    </div>

                    {/* Mobile menu footer with user info */}
                    <div className="flex-shrink-0 flex border-t border-red-700 p-4">
                        <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white">
                                {auth.user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="ml-3">
                                <p className="text-base font-medium text-white">{auth.user?.name || 'User'}</p>
                                <p className="text-sm font-medium text-red-200">Account</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white shadow-sm z-10">
                    <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <button
                                className="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                                onClick={() => setMobileMenuOpen(true)}
                                aria-label="Open sidebar"
                            >
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 ml-2 lg:ml-0 truncate">
                                {title}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700 hidden sm:inline truncate max-w-xs">
                                {auth.user?.name || 'User'}
                            </span>
                            <div className="relative">
                                <div className="h-8 w-8 rounded-full bg-red-700 flex items-center justify-center text-white">
                                    {auth.user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
                    {/* Flash Messages */}
                    {(flash.success || flash.error) && (
                        <div className="mb-4 transition-all duration-500 animate-fadeIn">
                            {flash.success && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative shadow-sm">
                                    <span className="block sm:inline">{flash.success}</span>
                                </div>
                            )}
                            {flash.error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow-sm">
                                    <span className="block sm:inline">{flash.error}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Main Content Container */}
                    <div className="w-full mx-auto sm:px-2 md:px-4 lg:px-6">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="p-4 sm:p-6 lg:p-8">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OrganizationLayout;
