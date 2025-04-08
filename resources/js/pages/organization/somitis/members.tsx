import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';
import { Member, Somiti, PaginatedData } from '@/types';

interface SomitiMembersProps {
    somiti: Somiti;
    members: PaginatedData<Member & {
        pivot: {
            due_amount: number;
            is_active: boolean;
        };
    }>;
    filters: {
        search?: string;
        status?: string;
        sort_field?: string;
        sort_direction?: string;
    };
}

const SomitiMembers: React.FC<SomitiMembersProps> = ({ somiti, members, filters }) => {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const url = new URL(window.location.href);

        if (searchTerm) {
            url.searchParams.set('search', searchTerm);
        } else {
            url.searchParams.delete('search');
        }

        if (status) {
            url.searchParams.set('status', status);
        } else {
            url.searchParams.delete('status');
        }

        window.location.href = url.toString();
    };

    const handleSortChange = (field: string) => {
        const url = new URL(window.location.href);

        if (filters.sort_field === field) {
            // Toggle direction if already sorting by this field
            const newDirection = filters.sort_direction === 'asc' ? 'desc' : 'asc';
            url.searchParams.set('sort_direction', newDirection);
        } else {
            // Set new sort field with default ascending direction
            url.searchParams.set('sort_field', field);
            url.searchParams.set('sort_direction', 'asc');
        }

        window.location.href = url.toString();
    };

    const getSortIcon = (field: string) => {
        if (filters.sort_field !== field) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-40" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12z" />
                    <path d="M15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                </svg>
            );
        }

        return filters.sort_direction === 'asc' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
        );
    };

    const formatAmount = (amount: number): string => {
        return '৳' + amount.toLocaleString('bn-BD');
    };

    const handleStatusToggle = (memberId: number, currentStatus: boolean) => {
        if (confirm(`আপনি কি নিশ্চিত যে আপনি এই সদস্যের স্ট্যাটাস ${currentStatus ? 'নিষ্ক্রিয়' : 'সক্রিয়'} করতে চান?`)) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `/organization/somitis/${somiti.id}/members/${memberId}/status`;

            const methodInput = document.createElement('input');
            methodInput.type = 'hidden';
            methodInput.name = '_method';
            methodInput.value = 'PUT';

            const tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = '_token';
            tokenInput.value = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

            const statusInput = document.createElement('input');
            statusInput.type = 'hidden';
            statusInput.name = 'is_active';
            statusInput.value = (!currentStatus).toString();

            form.appendChild(methodInput);
            form.appendChild(tokenInput);
            form.appendChild(statusInput);

            document.body.appendChild(form);
            form.submit();
        }
    };

    const handleRemoveMember = (memberId: number) => {
        if (confirm('আপনি কি নিশ্চিত যে আপনি এই সদস্যকে সমিতি থেকে বাদ দিতে চান?')) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `/organization/somitis/${somiti.id}/members/${memberId}/remove`;

            const methodInput = document.createElement('input');
            methodInput.type = 'hidden';
            methodInput.name = '_method';
            methodInput.value = 'DELETE';

            const tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = '_token';
            tokenInput.value = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

            form.appendChild(methodInput);
            form.appendChild(tokenInput);

            document.body.appendChild(form);
            form.submit();
        }
    };

    return (
        <OrganizationLayout title={`সদস্য তালিকা: ${somiti.name}`}>
            <Head title={`সদস্য তালিকা: ${somiti.name}`} />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                <div>
                    <Link
                        href={`/organization/somitis/${somiti.id}`}
                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 active:text-gray-800 active:bg-gray-50 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        সমিতি বিবরণে ফিরে যান
                    </Link>
                </div>

                <div>
                    <Link
                        href={`/organization/somitis/${somiti.id}/add-members`}
                        className="inline-flex items-center px-4 py-2 bg-red-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 active:bg-red-900 focus:outline-none focus:border-red-900 focus:ring ring-red-300 disabled:opacity-25 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        নতুন সদস্য যোগ করুন
                    </Link>
                </div>
            </div>

            <div className="mb-6">
                <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-end gap-4">
                        <div className="w-full md:w-1/3">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                সার্চ
                            </label>
                            <input
                                id="search"
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="সদস্যের নাম বা ফোন"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                            />
                        </div>

                        <div className="w-full md:w-1/3">
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                স্ট্যাটাস
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                            >
                                <option value="">সব স্ট্যাটাস</option>
                                <option value="active">সক্রিয়</option>
                                <option value="inactive">নিষ্ক্রিয়</option>
                            </select>
                        </div>

                        <div className="w-full md:w-1/3 flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                সার্চ করুন
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSortChange('name')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>সদস্য</span>
                                        {getSortIcon('name')}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ফোন
                                </th>
                                <th
                                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSortChange('due_amount')}
                                >
                                    <div className="flex items-center justify-end space-x-1">
                                        <span>বকেয়া</span>
                                        {getSortIcon('due_amount')}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    স্ট্যাটাস
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    অ্যাকশন
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {members.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                        কোন সদস্য পাওয়া যায়নি
                                    </td>
                                </tr>
                            ) : (
                                members.data.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {member.photo ? (
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={`/storage/${member.photo}`}
                                                            alt={member.name}
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                                            <span className="font-bold text-red-700">
                                                                {member.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        <Link
                                                            href={`/organization/members/${member.id}`}
                                                            className="hover:text-red-600"
                                                        >
                                                            {member.name}
                                                        </Link>
                                                    </div>
                                                    {member.email && (
                                                        <div className="text-sm text-gray-500">
                                                            {member.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {member.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                            {formatAmount(member.pivot.due_amount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.pivot.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {member.pivot.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    href={`/organization/members/${member.id}/make-payment?somiti_id=${somiti.id}`}
                                                    className="text-green-600 hover:text-green-800"
                                                    title="পেমেন্ট করুন"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => handleStatusToggle(member.id, member.pivot.is_active)}
                                                    className={`${member.pivot.is_active ? 'text-yellow-600 hover:text-yellow-800' : 'text-blue-600 hover:text-blue-800'}`}
                                                    title={member.pivot.is_active ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                                                >
                                                    {member.pivot.is_active ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    )}
                                                </button>

                                                {member.pivot.due_amount === 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveMember(member.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                        title="বাদ দিন"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {members.meta && members.meta.last_page > 1 && (
                <div className="mt-6">
                    <nav className="flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                            {members.meta.current_page > 1 && (
                                <a
                                    href={members.links.prev}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    আগে
                                </a>
                            )}
                            {members.meta.current_page < members.meta.last_page && (
                                <a
                                    href={members.links.next}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    পরে
                                </a>
                            )}
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    মোট <span className="font-medium">{members.meta.total}</span> সদস্যের মধ্যে{' '}
                                    <span className="font-medium">{members.meta.from}</span> থেকে{' '}
                                    <span className="font-medium">{members.meta.to}</span> দেখানো হচ্ছে
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    {members.meta.links.map((link, index) => {
                                        if (link.url === null) {
                                            return (
                                                <span
                                                    key={index}
                                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        }

                                        return (
                                            <a
                                                key={index}
                                                href={link.url}
                                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${link.active ? 'z-10 bg-red-50 border-red-500 text-red-600' : 'text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>
                    </nav>
                </div>
            )}
        </OrganizationLayout>
    );
};

export default SomitiMembers;
