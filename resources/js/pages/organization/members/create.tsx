import React, { FormEventHandler, useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';

const MemberCreate: React.FC = () => {
  const { data, setData, post, processing, errors, progress } = useForm({
    name: '',
    phone: '',
    address: '',
    email: '',
    photo: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post('/organization/members');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setData('photo', file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <OrganizationLayout title="নতুন সদস্য যোগ করুন">
      <Head title="নতুন সদস্য" />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                সদস্যের নাম
              </label>
              <input
                id="name"
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className={`mt-1 block w-full rounded-md ${
                  errors.name ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                }`}
                placeholder="সদস্যের নাম লিখুন"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                ফোন নম্বর
              </label>
              <input
                id="phone"
                type="text"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                className={`mt-1 block w-full rounded-md ${
                  errors.phone ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                }`}
                placeholder="ফোন নম্বর লিখুন"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                ঠিকানা
              </label>
              <textarea
                id="address"
                value={data.address}
                onChange={(e) => setData('address', e.target.value)}
                className={`mt-1 block w-full rounded-md ${
                  errors.address ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                }`}
                placeholder="ঠিকানা লিখুন"
                rows={3}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                ইমেইল (ঐচ্ছিক)
              </label>
              <input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className={`mt-1 block w-full rounded-md ${
                  errors.email ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                }`}
                placeholder="ইমেইল লিখুন (ঐচ্ছিক)"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
                ছবি (ঐচ্ছিক)
              </label>
              <div className="mt-2 flex items-center">
                {previewUrl ? (
                  <div className="mr-4 h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="mr-4 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <label
                  htmlFor="photo"
                  className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  ছবি আপলোড করুন
                </label>
              </div>
              {errors.photo && (
                <p className="mt-1 text-sm text-red-600">{errors.photo}</p>
              )}
              {progress && (
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${progress.percentage}%` }}></div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3">
              <Link
                href="/organization/members"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
              >
                বাতিল করুন
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center px-4 py-2 bg-red-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 active:bg-red-900 focus:outline-none focus:border-red-900 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
              >
                {processing ? 'প্রসেসিং...' : 'সাবমিট করুন'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default MemberCreate;
