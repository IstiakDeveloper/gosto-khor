import React, { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

interface ForgotPasswordProps {
  status?: string;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ status }) => {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post('/forgot-password');
  };

  return (
    <>
      <Head title="পাসওয়ার্ড পুনরুদ্ধার" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="text-center text-4xl font-bold text-red-700">GostoKhor</div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              আপনার পাসওয়ার্ড পুনরুদ্ধার করুন
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              আপনার ইমেইল আমাদেরকে জানান, আমরা আপনাকে পাসওয়ার্ড রিসেট লিংক পাঠাবো
            </p>
          </div>

          {status && (
            <div className="mb-4 font-medium text-sm text-green-600 bg-green-50 p-4 rounded-md">
              {status}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                ইমেইল অ্যাড্রেস
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300 placeholder-gray-500 text-gray-900'
                } rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm`}
                placeholder="আপনার ইমেইল অ্যাড্রেস"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link href="/login" className="font-medium text-red-700 hover:text-red-500">
                  লগইন পেজে ফিরে যান
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={processing}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {processing ? 'পাঠানো হচ্ছে...' : 'পাসওয়ার্ড রিসেট লিংক পাঠান'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm font-medium text-red-700 hover:text-red-500">
              &larr; হোম পেজে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
