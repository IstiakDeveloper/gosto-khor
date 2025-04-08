import React from 'react';
import { Head, Link } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';
import { User, Organization } from '@/types';

interface ProfileIndexProps {
  user: User & {
    organization: Organization;
  };
}

const ProfileIndex: React.FC<ProfileIndexProps> = ({ user }) => {
  return (
    <OrganizationLayout title="প্রোফাইল">
      <Head title="প্রোফাইল" />

      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">ব্যবহারকারীর তথ্য</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">আপনার ব্যক্তিগত প্রোফাইল এবং একাউন্ট তথ্য</p>
            </div>
            <Link
              href="/organization/profile/edit"
              className="inline-flex items-center px-4 py-2 bg-red-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 active:bg-red-900 focus:outline-none focus:border-red-900 focus:ring ring-red-300 disabled:opacity-25 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              সম্পাদনা করুন
            </Link>
          </div>
          <div className="border-t border-gray-200">
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
              <div className="sm:col-span-1">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                  {user.photo ? (
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
              </div>
              <dl className="sm:col-span-3">
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">নাম</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.name}</dd>
                </div>
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">ইমেইল</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                </div>
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">ফোন</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.phone || '-'}</dd>
                </div>
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">ঠিকানা</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.address || '-'}</dd>
                </div>
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">অবস্থান</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {user.is_admin ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        অ্যাডমিন
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        কর্মী
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">পাসওয়ার্ড পরিবর্তন করুন</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>নিরাপত্তার জন্য নিয়মিত আপনার পাসওয়ার্ড পরিবর্তন করুন</p>
            </div>
            <div className="mt-5">
              <Link
                href="/organization/profile/password"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                পাসওয়ার্ড পরিবর্তন করুন
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">প্রতিষ্ঠান সম্পর্কে তথ্য</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>আপনার প্রতিষ্ঠানের সম্পর্কে বিস্তারিত তথ্য এবং সেটিংস</p>
            </div>
            <div className="mt-5">
              <Link
                href="/organization/profile/organization"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                প্রতিষ্ঠানের তথ্য দেখুন
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">টিম মেম্বার</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>আপনার প্রতিষ্ঠানের সাথে সংযুক্ত ব্যবহারকারীদের তালিকা</p>
            </div>
            <div className="mt-5">
              <Link
                href="/organization/profile/team"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                টিম মেম্বার দেখুন
              </Link>
            </div>
          </div>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default ProfileIndex;
