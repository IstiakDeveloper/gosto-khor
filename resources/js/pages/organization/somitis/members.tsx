import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';
import { Somiti, Member, PaginatedData } from '@/types';
import Modal from '@/components/modal';

interface SomitiMembersProps {
    somiti: Somiti;
    members: PaginatedData<Member & { pivot: { due_amount: number; is_active: boolean; } }>;
    filters: {
        search?: string;
        status?: string;
        sort_field?: string;
        sort_direction?: string;
    };
}

const SomitiMembers: React.FC<SomitiMembersProps> = ({ somiti, members, filters }) => {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [confirmMemberId, setConfirmMemberId] = useState<number | null>(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);

    // Form for updating member status
    const { data, setData, post, processing, reset } = useForm({
        is_active: true,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const url = new URL(window.location.href);
        if (searchTerm) {
            url.searchParams.set('search', searchTerm);
        } else {
            url.searchParams.delete('search');
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

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const url = new URL(window.location.href);

        if (e.target.value) {
            url.searchParams.set(e.target.name, e.target.value);
        } else {
            url.searchParams.delete(e.target.name);
        }

        window.location.href = url.toString();
    };

    const confirmRemove = (memberId: number) => {
        setConfirmMemberId(memberId);
    };

    const cancelRemove = () => {
        setConfirmMemberId(null);
    };

    const removeMember = () => {
        if (confirmMemberId) {
            window.location.href = `/organization/somitis/${somiti.id}/members/${confirmMemberId}/remove`;
        }
    };

    const openStatusModal = (member: Member) => {
        setSelectedMember(member);
        const memberPivot = member.pivot as { is_active: boolean };
        setData('is_active', memberPivot.is_active);
        setShowStatusModal(true);
    };

    const closeStatusModal = () => {
        setSelectedMember(null);
        setShowStatusModal(false);
        reset();
    };

    const updateMemberStatus = () => {
        if (selectedMember) {
            post(`/organization/somitis/${somiti.id}/members/${selectedMember.id}/status`, {
                onSuccess: () => {
                    closeStatusModal();
                },
            });
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('bn-BD', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('bn-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 2,
        }).format(amount);
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

    return (
        <OrganizationLayout title={`সমিতি: ${somiti.name} - সদস্য তালিকা`}>
            <Head title={`সমিতি: ${somiti.name} - সদস্য তালিকা`} />

            <div className="py-6">
                {/* Header with action buttons */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <Link
                            href={`/organization/somitis/${somiti.id}`}
                            className="text-red-600 hover:text-red-800 flex items-center text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            সমিতি বিবরণে ফিরে যান
                        </Link>
                        <h2 className="text-2xl font-semibold text-gray-800 mt-1">
                            {somiti.name} - সদস্য তালিকা
                        </h2>
                    </div>
                    <Link
                        href={`/organization/somitis/${somiti.id}/add-members`}
                        className="inline-flex items-center px-4 py-2 bg-red-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 active:bg-red-900 focus:outline-none focus:border-red-900 focus:ring ring-red-300 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        নতুন সদস্য যোগ করুন
                    </Link>
                </div>

                {/* Filters */}
                <div className="mb-6">
                    <form onSubmit={handleSearch} className="flex space-x-2">
                        <div className="flex rounded-md shadow-sm flex-grow">
                            <input
                                type="text"
                                name="search"
                                placeholder="সদস্যের নাম বা ফোন নম্বর খুঁজুন"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 rounded-l-md border-gray-300 focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                            />
                            <button
                                type="submit"
                                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md hover:text-gray-700 focus:outline-none focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>

                        <select
                            name="status"
                            value={filters.status || ''}
                            onChange={handleFilterChange}
                            className="rounded-md border-gray-300 focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                        >
                            <option value="">সব স্ট্যাটাস</option>
                            <option value="active">সক্রিয়</option>
                            <option value="inactive">নিষ্ক্রিয়</option>
                        </select>
                    </form>
                </div>

                {/* Members Table */}
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
                                            <span>নাম</span>
                                            {getSortIcon('name')}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSortChange('phone')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>ফোন</span>
                                            {getSortIcon('phone')}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        যোগদানের তারিখ
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSortChange('due_amount')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>বকেয়া</span>
                                            {getSortIcon('due_amount')}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSortChange('is_active')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>স্ট্যাটাস</span>
                                            {getSortIcon('is_active')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        অ্যাকশন
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {members.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
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
                                                            {member.name}
                                                        </div>
                                                        {member.email && (
                                                            <div className="text-sm text-gray-500">
                                                                {member.email}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{member.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{formatDate(member.pivot.join_date)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm font-medium ${member.pivot.due_amount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {formatCurrency(member.pivot.due_amount)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.pivot.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {member.pivot.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <Link
                                                        href={`/organization/members/${member.id}`}
                                                        className="text-gray-700 hover:text-gray-800"
                                                        title="বিস্তারিত দেখুন"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </Link>

                                                    <button
                                                        onClick={() => openStatusModal(member)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="স্ট্যাটাস পরিবর্তন করুন"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                        </svg>
                                                    </button>

                                                    <Link
                                                        href={`/organization/somitis/${somiti.id}/members/${member.id}/make-payment`}
                                                        className="text-green-600 hover:text-green-800"
                                                        title="পেমেন্ট করুন"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                    </Link>

                                                    <button
                                                        onClick={() => confirmRemove(member.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                        title="সমিতি থেকে সরিয়ে ফেলুন"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
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
            </div>

            {/* Confirm Remove Modal */}
            <Modal show={confirmMemberId !== null} onClose={cancelRemove}>
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        সদস্য সরিয়ে ফেলার নিশ্চিতকরণ
                    </h3>
                    <p className="text-gray-600 mb-6">
                        আপনি কি নিশ্চিত যে আপনি এই সদস্যকে সমিতি থেকে সরিয়ে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
                    </p>
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={cancelRemove}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            বাতিল করুন
                        </button>
                        <button
                            onClick={removeMember}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            সরিয়ে ফেলুন
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Member Status Modal */}
            <Modal show={showStatusModal} onClose={closeStatusModal}>
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        সদস্য স্ট্যাটাস পরিবর্তন করুন
                    </h3>
                    {selectedMember && (
                        <div className="mb-6">
                            <p className="text-gray-600 mb-4">
                                <span className="font-medium">{selectedMember.name}</span> এর স্ট্যাটাস পরিবর্তন করুন
                            </p>

                            <div className="flex items-center space-x-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        className="form-radio text-red-600"
                                        name="status"
                                        checked={data.is_active}
                                        onChange={() => setData('is_active', true)}
                                    />
                                    <span className="ml-2">সক্রিয়</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        className="form-radio text-red-600"
                                        name="status"
                                        checked={!data.is_active}
                                        onChange={() => setData('is_active', false)}
                                    />
                                    <span className="ml-2">নিষ্ক্রিয়</span>
                                </label>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={closeStatusModal}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            disabled={processing}
                        >
                            বাতিল করুন
                        </button>
                        <button
                            onClick={updateMemberStatus}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            disabled={processing}
                        >
                            হালনাগাদ করুন
                        </button>
                    </div>
                </div>
            </Modal>
        </OrganizationLayout>
    );
};

export default SomitiMembers;
