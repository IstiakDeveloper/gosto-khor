import React, { FormEventHandler, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

interface ResetPasswordProps {
  token: string;
  email: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ token, email }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    token: token,
    email: email,
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    return () => {
      reset('password', 'password_confirmation');
    };
  }, []);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post('/reset-password');
  };

  return (
    <>
      <Head title="পাসওয়ার্ড রিসেট" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="text-center text-4xl font-bold text-red-700">GostoKhor</div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              আপনার পাসওয়ার্ড রিসেট করুন
            </h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
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

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  নতুন পাসওয়ার্ড
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300 placeholder-gray-500 text-gray-900'
                  } rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm`}
                  placeholder="নতুন পাসওয়ার্ড"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                  পাসওয়ার্ড নিশ্চিত করুন
                </label>
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={processing}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {processing ? 'প্রসেসিং...' : 'পাসওয়ার্ড রিসেট করুন'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm font-medium text-red-700 hover:text-red-500">
              &larr; লগইন পেজে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
