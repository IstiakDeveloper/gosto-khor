import React, { FormEventHandler, useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';
import { Somiti } from '@/types';

interface SomitiEditProps {
  somiti: Somiti;
}

const SomitiEdit: React.FC<SomitiEditProps> = ({ somiti }) => {
  const { data, setData, put, processing, errors } = useForm({
    name: somiti.name,
    type: somiti.type,
    collection_day: somiti.collection_day?.toString() || '',
    amount: somiti.amount.toString(),
    is_active: somiti.is_active,
  });

  const [showCollectionDay, setShowCollectionDay] = useState(somiti.type !== 'daily');

  useEffect(() => {
    setShowCollectionDay(data.type !== 'daily');
  }, [data.type]);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    put(`/organization/somitis/${somiti.id}`);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setData('type', type);

    // Reset collection day when changing type
    setData('collection_day', '');
  };

  return (
    <OrganizationLayout title="সমিতি সম্পাদনা করুন">
      <Head title="সমিতি সম্পাদনা" />

      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <Link
            href={`/organization/somitis/${somiti.id}`}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 active:text-gray-800 active:bg-gray-50 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            বিবরণে ফিরে যান
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                সমিতির নাম
              </label>
              <input
                id="name"
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className={`mt-1 block w-full rounded-md ${
                  errors.name ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                }`}
                placeholder="সমিতির নাম লিখুন"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                সমিতির ধরন
              </label>
              <select
                id="type"
                value={data.type}
                onChange={handleTypeChange}
                className={`mt-1 block w-full rounded-md ${
                  errors.type ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                }`}
              >
                <option value="monthly">মাসিক</option>
                <option value="weekly">সাপ্তাহিক</option>
                <option value="daily">দৈনিক</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            {showCollectionDay && (
              <div className="mb-6">
                <label htmlFor="collection_day" className="block text-sm font-medium text-gray-700 mb-1">
                  {data.type === 'monthly' ? 'কালেকশনের তারিখ' : 'কালেকশনের দিন'}
                </label>
                {data.type === 'monthly' ? (
                  <select
                    id="collection_day"
                    value={data.collection_day}
                    onChange={(e) => setData('collection_day', e.target.value)}
                    className={`mt-1 block w-full rounded-md ${
                      errors.collection_day ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                    }`}
                  >
                    <option value="">তারিখ নির্বাচন করুন</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        {day} তারিখ
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    id="collection_day"
                    value={data.collection_day}
                    onChange={(e) => setData('collection_day', e.target.value)}
                    className={`mt-1 block w-full rounded-md ${
                      errors.collection_day ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                    }`}
                  >
                    <option value="">দিন নির্বাচন করুন</option>
                    <option value="0">রবিবার</option>
                    <option value="1">সোমবার</option>
                    <option value="2">মঙ্গলবার</option>
                    <option value="3">বুধবার</option>
                    <option value="4">বৃহস্পতিবার</option>
                    <option value="5">শুক্রবার</option>
                    <option value="6">শনিবার</option>
                  </select>
                )}
                {errors.collection_day && (
                  <p className="mt-1 text-sm text-red-600">{errors.collection_day}</p>
                )}
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                কালেকশনের হার (৳)
              </label>
              <input
                id="amount"
                type="number"
                min="0"
                step="any"
                value={data.amount}
                onChange={(e) => setData('amount', e.target.value)}
                className={`mt-1 block w-full rounded-md ${
                  errors.amount ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                }`}
                placeholder="পরিমাণ লিখুন"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="is_active" className="block text-sm font-medium text-gray-700 mb-1">
                স্ট্যাটাস
              </label>
              <select
                id="is_active"
                value={data.is_active ? '1' : '0'}
                onChange={(e) => setData('is_active', e.target.value === '1')}
                className={`mt-1 block w-full rounded-md ${
                  errors.is_active ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                }`}
              >
                <option value="1">সক্রিয়</option>
                <option value="0">নিষ্ক্রিয়</option>
              </select>
              {errors.is_active && (
                <p className="mt-1 text-sm text-red-600">{errors.is_active}</p>
              )}
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
                disabled={processing}
                className="inline-flex items-center px-4 py-2 bg-red-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 active:bg-red-900 focus:outline-none focus:border-red-900 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
              >
                {processing ? 'প্রসেসিং...' : 'আপডেট করুন'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default SomitiEdit;
