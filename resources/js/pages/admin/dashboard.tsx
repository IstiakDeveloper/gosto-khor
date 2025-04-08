import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Organization, Subscription } from '@/types';

interface DashboardProps {
  statistics: {
    totalOrganizations: number;
    activeOrganizations: number;
    totalUsers: number;
    activeUsers: number;
    totalSomitis: number;
    totalSubscriptions: number;
  };
  recentOrganizations: Organization[];
  recentSubscriptions: Subscription[];
  monthlyRevenue: Record<string, number>;
}

const AdminDashboard: React.FC<DashboardProps> = ({
  statistics,
  recentOrganizations,
  recentSubscriptions,
  monthlyRevenue
}) => {
  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  return (
    <AdminLayout title="অ্যাডমিন ড্যাশবোর্ড">
      <Head title="অ্যাডমিন ড্যাশবোর্ড" />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">সংস্থা</h3>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-900">{statistics.totalOrganizations}</span>
                <span className="ml-2 text-sm text-green-600">
                  ({statistics.activeOrganizations} সক্রিয়)
                </span>
              </div>
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
              <h3 className="text-lg font-semibold text-gray-700">ব্যবহারকারী</h3>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-900">{statistics.totalUsers}</span>
                <span className="ml-2 text-sm text-green-600">
                  ({statistics.activeUsers} নতুন)
                </span>
              </div>
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
              <h3 className="text-lg font-semibold text-gray-700">সাবস্ক্রিপশন</h3>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-900">{statistics.totalSubscriptions}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">মাসিক রাজস্ব</h3>
          <div className="h-64">
            <div className="h-full flex items-end">
              {Object.entries(monthlyRevenue).map(([month, amount]) => (
                <div key={month} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-red-600 rounded-t"
                    style={{ height: `${Math.max((amount / Math.max(...Object.values(monthlyRevenue))) * 100, 5)}%` }}
                  ></div>
                  <div className="text-xs mt-2 font-medium">
                    {months[parseInt(month) - 1].substring(0, 3)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Organizations */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">সাম্প্রতিক সংস্থা</h3>
            <Link
              href="/admin/organizations"
              className="text-sm text-red-700 hover:text-red-800"
            >
              সব দেখুন
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrganizations.length === 0 ? (
              <p className="text-gray-500">কোন সংস্থা নেই</p>
            ) : (
              recentOrganizations.map((org) => (
                <div key={org.id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold">
                      {org.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <Link
                        href={`/admin/organizations/${org.id}`}
                        className="font-medium text-gray-800 hover:text-red-700"
                      >
                        {org.name}
                      </Link>
                      <p className="text-sm text-gray-500">{org.domain}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(org.created_at).toLocaleDateString('bn-BD')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Subscriptions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">সাম্প্রতিক সাবস্ক্রিপশন</h3>
          <Link
            href="/admin/subscriptions"
            className="text-sm text-red-700 hover:text-red-800"
          >
            সব দেখুন
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  সংস্থা
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  প্ল্যান
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  মূল্য
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  শুরুর তারিখ
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  শেষের তারিখ
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  স্ট্যাটাস
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-center text-gray-500">
                    কোন সাবস্ক্রিপশন নেই
                  </td>
                </tr>
              ) : (
                recentSubscriptions.map((sub) => (
                  <tr key={sub.id}>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <Link
                        href={`/admin/organizations/${sub.organization_id}`}
                        className="text-gray-800 hover:text-red-700"
                      >
                        {sub.organization?.name || 'Unknown'}
                      </Link>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {sub.plan?.name || 'Unknown'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      ৳{sub.amount_paid}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {new Date(sub.start_date).toLocaleDateString('bn-BD')}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {new Date(sub.end_date).toLocaleDateString('bn-BD')}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          sub.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {sub.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
