import React from 'react';
import { Head, Link } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';
import { Payment, Member, Somiti, User } from '@/types';

interface PaymentShowProps {
  payment: Payment & {
    somiti: Somiti;
    member: Member;
    createdBy: User;
  };
}

const PaymentShow: React.FC<PaymentShowProps> = ({ payment }) => {
  const formatAmount = (amount: number): string => {
    return '৳' + amount.toLocaleString('bn-BD');
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('bn-BD');
  };

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'paid':
        return 'পরিশোধিত';
      case 'pending':
        return 'বকেয়া';
      case 'failed':
        return 'ব্যর্থ';
      default:
        return status;
    }
  };

  return (
    <OrganizationLayout title={`পেমেন্ট বিবরণ #${payment.id}`}>
      <Head title={`পেমেন্ট বিবরণ #${payment.id}`} />

      <div className="flex justify-between mb-6">
        <div className="flex space-x-2">
          <Link
            href="/organization/payments"
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 active:text-gray-800 active:bg-gray-50 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            পেমেন্ট তালিকায় ফিরে যান
          </Link>
        </div>

        <div className="flex space-x-2">
          {payment.status === 'pending' && (
            <Link
              href={`/organization/payments/${payment.id}/mark-as-paid`}
              method="put"
              as="button"
              className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-900 focus:outline-none focus:border-green-900 focus:ring ring-green-300 disabled:opacity-25 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              পরিশোধিত হিসেবে চিহ্নিত করুন
            </Link>
          )}

          <Link
            href={`/organization/payments/${payment.id}/edit`}
            className="inline-flex items-center px-4 py-2 bg-yellow-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-yellow-700 active:bg-yellow-900 focus:outline-none focus:border-yellow-900 focus:ring ring-yellow-300 disabled:opacity-25 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            সম্পাদনা করুন
          </Link>

          <Link
            href={`/organization/payments/${payment.id}`}
            method="delete"
            as="button"
            className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 active:bg-red-900 focus:outline-none focus:border-red-900 focus:ring ring-red-300 disabled:opacity-25 transition"
            onClick={(e) => {
              if (!confirm('আপনি কি নিশ্চিত যে আপনি এই পেমেন্ট মুছতে চান?')) {
                e.preventDefault();
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            মুছে ফেলুন
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">পেমেন্ট বিবরণ</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">আইডি: #{payment.id}</p>
          </div>
          <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(payment.status)}`}>
            {getStatusText(payment.status)}
          </span>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">পেমেন্ট পরিমাণ</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">
                {formatAmount(payment.amount)}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">পেমেন্ট তারিখ</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(payment.payment_date)}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">কালেকশন তারিখ</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(payment.collection_date)}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">সমিতি</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <Link
                  href={`/organization/somitis/${payment.somiti.id}`}
                  className="text-red-600 hover:text-red-800"
                >
                  {payment.somiti.name}
                </Link>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">সদস্য</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {payment.member.photo ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={`/storage/${payment.member.photo}`}
                        alt={payment.member.name}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="font-bold text-red-700">
                          {payment.member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <Link
                      href={`/organization/members/${payment.member.id}`}
                      className="text-red-600 hover:text-red-800"
                    >
                      {payment.member.name}
                    </Link>
                    <div className="text-sm text-gray-500">
                      {payment.member.phone}
                    </div>
                  </div>
                </div>
              </dd>
            </div>
            {payment.payment_method && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">পেমেন্ট পদ্ধতি</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {payment.payment_method}
                </dd>
              </div>
            )}
            {payment.transaction_id && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">ট্রানজেকশন আইডি</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {payment.transaction_id}
                </dd>
              </div>
            )}
            {payment.notes && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">নোট</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {payment.notes}
                </dd>
              </div>
            )}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">এন্ট্রি তারিখ</dt>
              <dd className="mt-1 text-sm text-gray-500 sm:mt-0 sm:col-span-2">
                {new Date(payment.created_at).toLocaleString('bn-BD')} ({payment.createdBy?.name || 'Unknown'} দ্বারা)
              </dd>
            </div>
            {payment.updated_at !== payment.created_at && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">আপডেট তারিখ</dt>
                <dd className="mt-1 text-sm text-gray-500 sm:mt-0 sm:col-span-2">
                  {new Date(payment.updated_at).toLocaleString('bn-BD')}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default PaymentShow;
