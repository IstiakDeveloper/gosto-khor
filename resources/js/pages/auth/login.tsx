import React, { FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Organization } from '@/types';

interface LoginProps {
  organization?: {
    id: number;
    name: string;
    logo: string | null;
  };
}

const Login: React.FC<LoginProps> = ({ organization }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <>
      <Head title="Login" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            {organization ? (
              <>
                {organization.logo ? (
                  <img
                    className="mx-auto h-16 w-auto"
                    src={`/storage/${organization.logo}`}
                    alt={organization.name}
                  />
                ) : (
                  <div className="mx-auto h-16 w-16 rounded-full bg-red-700 flex items-center justify-center text-white text-2xl font-bold">
                    {organization.name.charAt(0)}
                  </div>
                )}
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  {organization.name}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন
                </p>
              </>
            ) : (
              <>
                <div className="text-center text-4xl font-bold text-red-700">GostoKhor</div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  আপনার অ্যাকাউন্টে লগইন করুন
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  অথবা{' '}
                  <Link href="/register" className="font-medium text-red-700 hover:text-red-500">
                    নতুন অ্যাকাউন্ট তৈরি করুন
                  </Link>
                </p>
              </>
            )}
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">ইমেইল অ্যাড্রেস</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300 placeholder-gray-500 text-gray-900'
                  } rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm`}
                  placeholder="ইমেইল অ্যাড্রেস"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="sr-only">পাসওয়ার্ড</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300 placeholder-gray-500 text-gray-900'
                  } rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm`}
                  placeholder="পাসওয়ার্ড"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                  আমাকে মনে রাখুন
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-red-700 hover:text-red-500">
                  পাসওয়ার্ড ভুলে গেছেন?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={processing}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-red-500 group-hover:text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
                লগইন করুন
              </button>
            </div>
          </form>

          {!organization && (
            <div className="mt-6 text-center">
              <Link href="/" className="text-sm font-medium text-red-700 hover:text-red-500">
                &larr; হোম পেজে ফিরে যান
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
