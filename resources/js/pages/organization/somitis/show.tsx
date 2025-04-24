import React from 'react';
import { Head, Link } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';
import { Somiti, Member, Payment } from '@/types';

interface SomitiShowProps {
    somiti: Somiti & {
        members: Array<Member & { pivot: { due_amount: number; is_active: boolean } }>;
    };
    latestPayments: Payment[];
    totalDue: number;
    totalPaid: number;
    // Removed totalAmount as it's unused
    totalExpected: number;
    overpaid: number;
    nextCollectionDate: string | null;
    nextCollectionDay: string | null;
    totalCollections: number;
}

const SomitiShow: React.FC<SomitiShowProps> = ({
    somiti,
    latestPayments,
    totalDue,
    totalPaid,
    // Removed totalAmount from destructuring to match interface
    overpaid,
    nextCollectionDate,
    nextCollectionDay,
    totalCollections,
    totalExpected,
}) => {
    // Format date function
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';

        try {
            const date = new Date(dateString);

            // Check if date is valid
            if (isNaN(date.getTime())) {
                return '-';
            }

            return new Intl.DateTimeFormat('bn-BD', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }).format(date);
        } catch (error) {
            console.error('Error formatting date:', dateString, error);
            return '-';
        }
    };

    // Format currency function
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('bn-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    // Get collection type in Bengali
    const getCollectionTypeText = (type: string, day: number | null) => {
        if (type === 'daily') {
            return 'প্রতিদিন';
        } else if (type === 'weekly' && day !== null) {
            const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
            return `প্রতি সপ্তাহে ${days[day]}`;
        } else if (type === 'monthly' && day !== null) {
            return `প্রতি মাসের ${day} তারিখ`;
        }
        return '';
    };

    return (
        <OrganizationLayout title={`সমিতি: ${somiti.name}`}>
            <Head title={`সমিতি: ${somiti.name}`} />

            <div className="py-6">
                {/* Header with action buttons */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">{somiti.name}</h2>
                    <div className="flex space-x-2">
                        <Link
                            href={`/organization/somitis/${somiti.id}/edit`}
                            className="inline-flex items-center px-4 py-2 bg-yellow-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-yellow-700 active:bg-yellow-800 focus:outline-none focus:border-yellow-800 focus:ring ring-yellow-300 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            সম্পাদনা করুন
                        </Link>
                        <Link
                            href={`/organization/somiti/${somiti.id}/payment`}
                            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-800 focus:outline-none focus:border-green-800 focus:ring ring-green-300 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            কালেকশন প্রসেস করুন
                        </Link>
                    </div>
                </div>

                {/* Main content grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Somiti Info Card */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">সমিতির তথ্য</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">স্ট্যাটাস:</span>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${somiti.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {somiti.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">ধরন:</span>
                                    <span className="text-gray-900">
                                        {somiti.type === 'monthly' && 'মাসিক'}
                                        {somiti.type === 'weekly' && 'সাপ্তাহিক'}
                                        {somiti.type === 'daily' && 'দৈনিক'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">কালেকশন:</span>
                                    <span className="text-gray-900">
                                        {getCollectionTypeText(somiti.type, somiti.collection_day)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">পরিমাণ:</span>
                                    <span className="text-gray-900">{formatCurrency(somiti.amount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">শুরুর তারিখ:</span>
                                    <span className="text-gray-900">{formatDate(somiti.start_date)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 mt-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">মোট সদস্য:</span>
                                        <span className="text-gray-900">{somiti.members.length} জন</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">সক্রিয় সদস্য:</span>
                                        <span className="text-gray-900">
                                            {somiti.members.filter(member => member.pivot.is_active).length} জন
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <Link
                                    href={`/organization/somitis/${somiti.id}/members`}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    সদস্য তালিকা দেখুন
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Collection Stats Card */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">কালেকশন পরিসংখ্যান</h3>
                            <div className="space-y-3">
                                <div className="bg-red-50 p-4 rounded-md">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-600">মোট কালেকশন:</span>
                                        <span className="text-gray-900">{totalCollections} বার</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">পরবর্তী কালেকশন:</span>
                                        <span className="text-gray-900">
                                            {nextCollectionDate ? (
                                                <>
                                                    {formatDate(nextCollectionDate)}
                                                    <span className="text-xs text-gray-500 block text-right">({nextCollectionDay})</span>
                                                </>
                                            ) : (
                                                'নির্ধারিত নয়'
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span className="text-gray-600">মোট হিসাব:</span>
                                        <span className="text-blue-600">{formatCurrency(totalExpected)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">মোট আদায়:</span>
                                        <span className="text-green-600">{formatCurrency(totalPaid)}</span>
                                    </div>
                                    {overpaid > 0 ? (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">অতিরিক্ত আদায়:</span>
                                                <span className="text-purple-600">{formatCurrency(overpaid)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">বকেয়া:</span>
                                                <span className="text-gray-600">০.০০৳</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">বকেয়া:</span>
                                            <span className="text-red-600">{formatCurrency(totalDue)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6">
                                <Link
                                    href={`/organization/payments`}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    সব পেমেন্ট দেখুন
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Latest Payments Card */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">সাম্প্রতিক পেমেন্ট</h3>

                            {latestPayments.length === 0 ? (
                                <div className="text-center py-4 text-gray-500">
                                    কোন পেমেন্ট নেই
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {latestPayments.map((payment) => (
                                        <div key={payment.id} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                                            <div className="flex justify-between">
                                                <span className="font-medium">{payment.member.name}</span>
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {payment.status === 'paid' && 'পরিশোধিত'}
                                                    {payment.status === 'pending' && 'বকেয়া'}
                                                    {payment.status === 'failed' && 'ব্যর্থ'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-500">
                                                <span>{formatDate(payment.payment_date)}</span>
                                                <span className={`${payment.status === 'paid' ? 'text-green-600' : 'text-red-600'} font-medium`}>
                                                    {formatCurrency(payment.amount)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-6">
                                <Link
                                    href={`/organization/somitis/${somiti.id}/generate-report`}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    রিপোর্ট তৈরি করুন
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts and analytics could be added here in future */}
            </div>
        </OrganizationLayout>
    );
};

export default SomitiShow;
