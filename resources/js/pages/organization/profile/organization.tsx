import React from 'react';
import { Head, Link } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';
import { Organization, Subscription, Plan } from '@/types';

interface OrganizationViewProps {
  organization: Organization & {
    activeSubscription?: Subscription & {
      plan: Plan;
    };
  };
}

const OrganizationView: React.FC<OrganizationViewProps> = ({ organization }) => {
  return (
    <OrganizationLayout title="প্রতিষ্ঠানের তথ্য">
      <Head title="প্রতিষ্ঠানের তথ্য" />

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
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">প্রতিষ্ঠানের তথ্য</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">আপনার প্রতিষ্ঠানের বিস্তারিত তথ্য</p>
            </div>
            <Link
              href="/organization/profile/edit-organization"
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
                <div className="h-24 w-24 overflow-hidden bg-gray-100 flex items-center justify-center">
                  {organization.logo ? (
                    <img
                      src={`/storage/${organization.logo}`}
                      alt={organization.name}
                      className="h-24 w-24 object-contain"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-red-100">
                      <span className="text-3xl font-bold text-red-700">
                        {organization.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <dl className="sm:col-span-3">
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">প্রতিষ্ঠানের নাম</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{organization.name}</dd>
                </div>
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">ইমেইল</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{organization.email || '-'}</dd>
                </div>
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">ফোন</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{organization.phone || '-'}</dd>
                </div>
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">ঠিকানা</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{organization.address || '-'}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {organization.activeSubscription && (
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">সাবস্ক্রিপশন</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">আপনার বর্তমান সাবস্ক্রিপশন প্ল্যান এবং তথ্য</p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">প্ল্যান</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {organization.activeSubscription.plan.name}
                    </span>
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">কর্মী সংখ্যা</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {organization.activeSubscription.plan.max_users} জন
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">শুরুর তারিখ</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(organization.activeSubscription.starts_at).toLocaleDateString('bn-BD')}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">শেষের তারিখ</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(organization.activeSubscription.expires_at).toLocaleDateString('bn-BD')}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">স্ট্যাটাস</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      সক্রিয়
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        <div className="mt-6 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">টিম ম্যানেজমেন্ট</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>আপনার প্রতিষ্ঠানের সাথে সংযুক্ত টিম সদস্যদের দেখুন ও ম্যানেজ করুন</p>
            </div>
            <div className="mt-5">
              <Link
                href="/organization/profile/team"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                টিম সদস্যদের দেখুন
              </Link>
            </div>
          </div>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationView;
