import React, { useState, useRef } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';
import { User } from '@/types';

interface ProfileEditProps {
  user: User;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ user }) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, setData, errors, post, processing } = useForm({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    photo: null as File | null,
    _method: 'PUT',
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('photo', file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/organization/profile', {
      forceFormData: true,
    });
  };

  return (
    <OrganizationLayout title="প্রোফাইল সম্পাদনা">
      <Head title="প্রোফাইল সম্পাদনা" />

      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/organization/profile"
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 active:text-gray-800 active:bg-gray-50 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            প্রোফাইলে ফিরে যান
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">প্রোফাইল সম্পাদনা</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">আপনার ব্যক্তিগত তথ্য আপডেট করুন</p>
          </div>

          <div className="border-t border-gray-200">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">প্রোফাইল ছবি</label>
                <div className="mt-1 flex items-center">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="h-24 w-24 object-cover"
                      />
                    ) : user.photo ? (
                      <img
                        src={`/storage/${user.photo}`}
                        alt={user.name}
                        className="h-24 w-24 object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-red-100">
                        <span className="text-3xl font-bold text-red-700">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handlePhotoChange}
                    accept="image/*"
                  />
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    ছবি পরিবর্তন করুন
                  </button>
                </div>
                {errors.photo && (
                  <p className="mt-1 text-sm text-red-600">{errors.photo}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">নাম</label>
                  <input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className={`mt-1 block w-full rounded-md ${
                      errors.name ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                    }`}
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">ইমেইল</label>
                  <input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                    className={`mt-1 block w-full rounded-md ${
                      errors.email ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                    }`}
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">ফোন</label>
                  <input
                    id="phone"
                    type="text"
                    value={data.phone}
                    onChange={e => setData('phone', e.target.value)}
                    className={`mt-1 block w-full rounded-md ${
                      errors.phone ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">ঠিকানা</label>
                  <input
                    id="address"
                    type="text"
                    value={data.address}
                    onChange={e => setData('address', e.target.value)}
                    className={`mt-1 block w-full rounded-md ${
                      errors.address ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                    }`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end space-x-3">
                <Link
                  href="/organization/profile"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-25 transition"
                >
                  বাতিল করুন
                </Link>
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center px-4 py-2 bg-red-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 active:bg-red-900 focus:outline-none focus:border-red-900 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-25 transition"
                >
                  {processing ? 'প্রসেসিং...' : 'আপডেট করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default ProfileEdit;
