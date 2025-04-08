import React from 'react';
import { Head, Link } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';
import { Somiti, Member, Payment } from '@/types';

interface UpcomingCollection {
  somiti_id: number;
  somiti_name: string;
  collection_date: string;
  day: string;
  type: 'monthly' | 'weekly' | 'daily';
  amount: number;
  members_count: number;
  total_amount: number;
}

interface DashboardProps {
  statistics: {
    totalSomitis: number;
    totalMembers: number;
    totalDue: number;
    totalCollected: number;
  };
  recentSomitis: Somiti[];
  recentMembers: Member[];
  recentPayments: Payment[];
  monthlyCollections: Record<string, number>;
  upcomingCollections: UpcomingCollection[];
  subscription: {
    plan_name: string;
    end_date: string;
    remaining_days: number;
    is_expiring_soon: boolean;
  } | null;
}

const OrganizationDashboard: React.FC<DashboardProps> = ({
  statistics,
  recentSomitis,
  recentMembers,
  recentPayments,
  monthlyCollections,
  upcomingCollections,
  subscription,
}) => {
  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const formatAmount = (amount: number): string => {
    return '৳' + amount.toLocaleString('bn-BD');
  };

  return (
    <OrganizationLayout title="ড্যাশবোর্ড">
      <Head title="ড্যাশবোর্ড" />

      {/* Subscription Warning */}
      {subscription && subscription.is_expiring_soon && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                আপনার সাবস্ক্রিপশন {subscription.remaining_days} দিন পর শেষ হয়ে যাবে। রিনিউ করতে <Link href="/organization/profile/organization" className="font-medium underline text-yellow-700 hover:text-yellow-600">এখানে ক্লিক করুন</Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">সমিতি</h3>
              <div className="text-2xl font-bold text-gray-900">{statistics.totalSomitis}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">সদস্য</h3>
              <div className="text-2xl font-bold text-gray-900">{statistics.totalMembers}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">সংগ্রহ</h3>
              <div className="text-2xl font-bold text-gray-900">{formatAmount(statistics.totalCollected)}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">বকেয়া</h3>
              <div className="text-2xl font-bold text-red-600">{formatAmount(statistics.totalDue)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Collections Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">মাসিক সংগ্রহ</h3>
          <div className="h-64">
            <div className="h-full flex items-end">
              {Object.entries(monthlyCollections).map(([month, amount]) => (
                <div key={month} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-red-600 rounded-t"
                    style={{ height: `${Math.max((amount / Math.max(...Object.values(monthlyCollections), 1)) * 100, 5)}%` }}
                  ></div>
                  <div className="text-xs mt-2 font-medium">
                    {months[parseInt(month) - 1].substring(0, 3)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatAmount(amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Collections */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">আসন্ন সংগ্রহ</h3>
          </div>
          <div className="space-y-4">
            {upcomingCollections.length === 0 ? (
              <p className="text-gray-500">কোন আসন্ন সংগ্রহ নেই</p>
            ) : (
              upcomingCollections.map((collection) => (
                <div key={`${collection.somiti_id}-${collection.collection_date}`} className="border-b pb-3">
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/organization/somitis/${collection.somiti_id}`}
                      className="text-lg font-medium text-red-700 hover:underline"
                    >
                      {collection.somiti_name}
                    </Link>
                    <div className="bg-red-100 text-red-800 py-1 px-2 rounded text-sm">
                      {collection.type === 'daily' ? 'দৈনিক' : collection.type === 'weekly' ? 'সাপ্তাহিক' : 'মাসিক'}
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    <div className="flex justify-between">
                      <span>তারিখ: {collection.collection_date} ({collection.day})</span>
                      <span>সদস্য: {collection.members_count} জন</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>হার: {formatAmount(collection.amount)}</span>
                      <span>মোট: {formatAmount(collection.total_amount)}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Link
                      href={`/organization/somitis/${collection.somiti_id}/process-collection`}
                      className="text-sm text-white bg-red-700 hover:bg-red-800 py-1 px-3 rounded"
                    >
                      সংগ্রহ করুন
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Somitis */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">সাম্প্রতিক সমিতি</h3>
            <Link
              href="/organization/somitis"
              className="text-sm text-red-700 hover:text-red-800"
            >
              সব দেখুন
            </Link>
          </div>
          <div className="space-y-3">
            {recentSomitis.length === 0 ? (
              <p className="text-gray-500">কোন সমিতি নেই</p>
            ) : (
              recentSomitis.map((somiti) => (
                <div key={somiti.id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold">
                      {somiti.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <Link
                        href={`/organization/somitis/${somiti.id}`}
                        className="font-medium text-gray-800 hover:text-red-700"
                      >
                        {somiti.name}
                      </Link>
                      <div className="flex items-center text-sm text-gray-500 space-x-2">
                        <span>{somiti.type === 'daily' ? 'দৈনিক' : somiti.type === 'weekly' ? 'সাপ্তাহিক' : 'মাসিক'}</span>
                        <span>•</span>
                        <span>{formatAmount(somiti.amount)}</span>
                        <span>•</span>
                        <span>{somiti.members_count || 0} সদস্য</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/organization/somitis/${somiti.id}`}
                    className="text-sm text-red-700 hover:text-red-800"
                  >
                    বিস্তারিত
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">সাম্প্রতিক পেমেন্ট</h3>
            <Link
              href="/organization/payments"
              className="text-sm text-red-700 hover:text-red-800"
            >
              সব দেখুন
            </Link>
          </div>
          <div className="space-y-3">
            {recentPayments.length === 0 ? (
              <p className="text-gray-500">কোন পেমেন্ট নেই</p>
            ) : (
              recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold">
                      {payment.member?.name.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-800">
                        {payment.member?.name || 'Unknown Member'}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 space-x-2">
                        <span>{payment.somiti?.name || 'Unknown Somiti'}</span>
                        <span>•</span>
                        <span>{formatAmount(payment.amount)}</span>
                        <span>•</span>
                        <span className={`${payment.status === 'paid' ? 'text-green-600' : payment.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                          {payment.status === 'paid' ? 'পরিশোধিত' : payment.status === 'pending' ? 'বকেয়া' : 'ব্যর্থ'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(payment.payment_date).toLocaleDateString('bn-BD')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationDashboard;
