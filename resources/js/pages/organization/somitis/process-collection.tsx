import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';
import { Somiti, Member } from '@/types';

interface MemberWithPivot extends Member {
    pivot: {
        due_amount: number;
        is_active: boolean;
    };
    payment_amount: number;
    payment_status: string;
}

interface ProcessCollectionProps {
    somiti: Somiti;
    members: (Member & {
        pivot: {
            due_amount: number;
            is_active: boolean;
        };
    })[];
    collectionDate: string;
    collectionDay: string;
}

const ProcessCollection: React.FC<ProcessCollectionProps> = ({
    somiti,
    members,
    collectionDate,
    collectionDay
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Initialize members with payment data
    const initialPayments = members.map(member => ({
        ...member,
        payment_amount: somiti.amount,
        payment_status: 'paid'
    }));

    const [memberPayments, setMemberPayments] = useState<MemberWithPivot[]>(initialPayments);

    const { data, setData, post, processing, errors } = useForm({
        collection_date: collectionDate,
        payments: initialPayments.map(member => ({
            member_id: member.id,
            amount: member.payment_amount,
            status: member.payment_status
        }))
    });

    const updatePaymentData = () => {
        setData('payments', memberPayments.map(member => ({
            member_id: member.id,
            amount: member.payment_amount,
            status: member.payment_status
        })));
    };

    const handleAmountChange = (id: number, amount: number) => {
        const newMemberPayments = memberPayments.map(member => {
            if (member.id === id) {
                return {
                    ...member,
                    payment_amount: amount
                };
            }
            return member;
        });

        setMemberPayments(newMemberPayments);
        updatePaymentData();
    };

    const handleStatusChange = (id: number, status: string) => {
        const newMemberPayments = memberPayments.map(member => {
            if (member.id === id) {
                return {
                    ...member,
                    payment_status: status
                };
            }
            return member;
        });

        setMemberPayments(newMemberPayments);
        updatePaymentData();
    };

    const formatAmount = (amount: number): string => {
        return '৳' + amount.toLocaleString('bn-BD');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Update the form data before submitting
        setData('payments', memberPayments.map(member => ({
            member_id: member.id,
            amount: member.payment_amount,
            status: member.payment_status
        })));

        post(`/organization/somitis/${somiti.id}/save-collection`);
    };

    // Filter members based on search term
    const filteredMembers = memberPayments.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.includes(searchTerm)
    );

    // Calculate total collection
    const totalCollection = memberPayments.reduce((total, member) => {
        return total + (member.payment_amount || 0);
    }, 0);

    // Count paid and pending collections
    const paidCollections = memberPayments.filter(member => member.payment_status === 'paid').length;
    const pendingCollections = memberPayments.filter(member => member.payment_status === 'pending').length;

    return (
        <OrganizationLayout title={`কালেকশন প্রসেস করুন: ${somiti.name}`}>
            <Head title={`কালেকশন প্রসেস করুন: ${somiti.name}`} />

            <div className="mb-6">
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

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        {somiti.name} - কালেকশন প্রসেস করুন
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        কালেকশন তারিখ: <span className="font-medium">{new Date(collectionDate).toLocaleDateString('bn-BD')}</span> ({collectionDay})
                    </p>
                </div>

                {errors.collection_date && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">
                                    {errors.collection_date}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {errors.payments && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">
                                    {errors.payments}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="w-full md:w-1/2">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                সদস্য খুঁজুন
                            </label>
                            <input
                                id="search"
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="নাম বা ফোন নম্বর দিয়ে খুঁজুন"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                            />
                        </div>

                        <div className="w-full md:w-1/2">
                            <div className="bg-gray-100 p-4 rounded-md">
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <p className="text-xs text-gray-500">মোট কালেকশন</p>
                                        <p className="text-lg font-semibold text-gray-900">{formatAmount(totalCollection)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">পরিশোধিত</p>
                                        <p className="text-lg font-semibold text-green-600">{paidCollections} জন</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">বকেয়া</p>
                                        <p className="text-lg font-semibold text-yellow-600">{pendingCollections} জন</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="collection_date" className="block text-sm font-medium text-gray-700 mb-1">
                            কালেকশন তারিখ
                        </label>
                        <input
                            id="collection_date"
                            type="date"
                            value={data.collection_date}
                            onChange={(e) => setData('collection_date', e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div className="border rounded-md overflow-hidden mb-6">
                        <div className="max-h-96 overflow-y-auto">
                            {filteredMembers.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    কোন সক্রিয় সদস্য পাওয়া যায়নি
                                </div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                সদস্য
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                বর্তমান বকেয়া
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                পরিমাণ
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                স্ট্যাটাস
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredMembers.map((member) => (
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
                                                            <div className="text-sm text-gray-500">
                                                                {member.phone}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                                    {formatAmount(member.pivot.due_amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex justify-center">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="any"
                                                            value={member.payment_amount}
                                                            onChange={(e) => handleAmountChange(member.id, parseFloat(e.target.value) || 0)}
                                                            className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm text-right"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex justify-center">
                                                        <select
                                                            value={member.payment_status}
                                                            onChange={(e) => handleStatusChange(member.id, e.target.value)}
                                                            className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                                        >
                                                            <option value="paid">পরিশোধিত</option>
                                                            <option value="pending">বকেয়া</option>
                                                        </select>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-3">
                        <Link
                            href={`/organization/somitis/${somiti.id}`}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            বাতিল করুন
                        </Link>
                        <button
                            type="submit"
                            disabled={processing || filteredMembers.length === 0}
                            className="inline-flex items-center px-4 py-2 bg-red-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 active:bg-red-900 focus:outline-none focus:border-red-900 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            {processing ? 'প্রসেসিং...' : 'কালেকশন সেভ করুন'}
                        </button>
                    </div>
                </form>
            </div>
        </OrganizationLayout>
    );
};

export default ProcessCollection;
