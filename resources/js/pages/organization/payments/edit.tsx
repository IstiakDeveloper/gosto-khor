import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';
import { Payment, Member, Somiti } from '@/types';

interface PaymentEditProps {
  payment: Payment & {
    somiti: Somiti;
    member: Member;
  };
}

const PaymentEdit: React.FC<PaymentEditProps> = ({ payment }) => {
  const [processing, setProcessing] = useState(false);

  const { data, setData, errors, put } = useForm({
    amount: payment.amount,
    payment_date: payment.payment_date,
    status: payment.status,
    payment_method: payment.payment_method || '',
    transaction_id: payment.transaction_id || '',
    notes: payment.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    put(`/organization/payments/${payment.id}`, {
      onSuccess: () => {
        setProcessing(false);
      },
      onError: () => {
        setProcessing(false);
      },
    });
  };

  return (
    <OrganizationLayout title={`পেমেন্ট সম্পাদনা #${payment.id}`}>
      <Head title={`পেমেন্ট সম্পাদনা #${payment.id}`} />

      <div className="flex justify-between mb-6">
        <Link
          href={`/organization/payments/${payment.id}`}
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 active:text-gray-800 active:bg-gray-50 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          বিবরণে ফিরে যান
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">পেমেন্ট সম্পাদনা</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            সমিতি: <span className="font-medium">{payment.somiti.name}</span>,
            সদস্য: <span className="font-medium">{payment.member.name}</span>
          </p>
        </div>

        <div className="border-t border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  পরিমাণ *
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    step="0.01"
                    id="amount"
                    name="amount"
                    required
                    value={data.amount}
                    onChange={(e) => setData('amount', parseFloat(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="payment_date" className="block text-sm font-medium text-gray-700">
                  পেমেন্ট তারিখ *
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    id="payment_date"
                    name="payment_date"
                    required
                    value={data.payment_date}
                    onChange={(e) => setData('payment_date', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  />
                  {errors.payment_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.payment_date}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  স্ট্যাটাস *
                </label>
                <div className="mt-1">
                  <select
                    id="status"
                    name="status"
                    required
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  >
                    <option value="paid">পরিশোধিত</option>
                    <option value="pending">বকেয়া</option>
                    <option value="failed">ব্যর্থ</option>
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">
                  পেমেন্ট পদ্ধতি
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="payment_method"
                    name="payment_method"
                    value={data.payment_method}
                    onChange={(e) => setData('payment_method', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  />
                  {errors.payment_method && (
                    <p className="mt-1 text-sm text-red-600">{errors.payment_method}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="transaction_id" className="block text-sm font-medium text-gray-700">
                  ট্রানজেকশন আইডি
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="transaction_id"
                    name="transaction_id"
                    value={data.transaction_id}
                    onChange={(e) => setData('transaction_id', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  />
                  {errors.transaction_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.transaction_id}</p>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  নোট
                </label>
                <div className="mt-1">
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  />
                  {errors.notes && (
                    <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                type="submit"
                disabled={processing}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {processing ? 'অপেক্ষা করুন...' : 'আপডেট করুন'}
              </button>

              <Link
                href={`/organization/payments/${payment.id}`}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                বাতিল করুন
              </Link>
            </div>
          </form>
        </div>
      </div>

      {data.status !== payment.status && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>সতর্কতা:</strong> পেমেন্টের স্ট্যাটাস পরিবর্তন করলে সদস্যের বকেয়া পরিমাণ পরিবর্তিত হবে।
              </p>
            </div>
          </div>
        </div>
      )}

      {data.amount !== payment.amount && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>সতর্কতা:</strong> পেমেন্টের পরিমাণ পরিবর্তন করলে, বকেয়া স্ট্যাটাসের ক্ষেত্রে সদস্যের বকেয়া পরিমাণ পরিবর্তিত হবে।
              </p>
            </div>
          </div>
        </div>
      )}
    </OrganizationLayout>
  );
};

export default PaymentEdit;
