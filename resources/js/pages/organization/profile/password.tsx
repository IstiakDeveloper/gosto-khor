import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';

const PasswordEdit: React.FC = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data, setData, errors, post, processing, reset } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
    _method: 'PUT'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/organization/profile/password', {
      onSuccess: () => {
        reset('current_password', 'password', 'password_confirmation');
      }
    });
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    if (field === 'current') {
      setShowCurrentPassword(!showCurrentPassword);
    } else if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <OrganizationLayout title="পাসওয়ার্ড পরিবর্তন">
      <Head title="পাসওয়ার্ড পরিবর্তন" />

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
            <h3 className="text-lg leading-6 font-medium text-gray-900">পাসওয়ার্ড পরিবর্তন করুন</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">নিরাপত্তার জন্য শক্তিশালী পাসওয়ার্ড ব্যবহার করুন</p>
          </div>

          <div className="border-t border-gray-200">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">বর্তমান পাসওয়ার্ড</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="password"
                    type={showNewPassword ? "text" : "password"}
                    value={data.password}
                    onChange={e => setData('password', e.target.value)}
                    className={`block w-full rounded-md ${
                      errors.password ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                    }`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showNewPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে</p>
              </div>

              <div className="mb-6">
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">নতুন পাসওয়ার্ড নিশ্চিত করুন</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    value={data.password_confirmation}
                    onChange={e => setData('password_confirmation', e.target.value)}
                    className={`block w-full rounded-md ${
                      errors.password_confirmation ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                    }`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                {errors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                )}
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
                  {processing ? 'প্রসেসিং...' : 'পাসওয়ার্ড পরিবর্তন করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default PasswordEdit;
