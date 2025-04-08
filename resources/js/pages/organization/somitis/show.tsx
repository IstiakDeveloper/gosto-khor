import React from 'react';
import { Head, Link } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';
import { Somiti, Member, Payment } from '@/types';

interface SomitiShowProps {
  somiti: Somiti & {
    members: (Member & {
      pivot: {
        due_amount: number;
        is_active: boolean;
      };
    })[];
  };
  latestPayments: Payment[];
  totalDue: number;
  totalPaid: number;
  nextCollectionDate: string | null;
  nextCollectionDay: string | null;
}

const SomitiShow: React.FC<SomitiShowProps> = ({
  somiti,
  latestPayments,
  totalDue,
  totalPaid,
  nextCollectionDate,
  nextCollectionDay,
}) => {
  const getTypeText = (type: string): string => {
    switch (type) {
      case 'monthly':
        return 'মাসিক';
      case 'weekly':
        return 'সাপ্তাহিক';
      case 'daily':
        return 'দৈনিক';
      default:
        return type;
    }
  };

  const getCollectionDayText = (): string => {
    if (!somiti.collection_day && somiti.type !== 'daily') {
      return 'নির্ধারিত নয়';
    }

    if (somiti.type === 'daily') {
      return 'প্রতিদিন';
    }

    if (somiti.type === 'weekly') {
      const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
      return days[somiti.collection_day || 0];
    }

    return `${somiti.collection_day} তারিখ`;
  };

  const formatAmount = (amount: number): string => {
    return '৳' + amount.toLocaleString('bn-BD');
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('bn-BD');
  };

  return (
    <OrganizationLayout title={`সমিতি বিবরণ: ${somiti.name}`}>
      <Head title={`সমিতি: ${somiti.name}`} />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <Link
            href="/organization/somitis"
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 active:text-gray-800 active:bg-gray-50 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            সমিতি তালিকায় ফিরে যান
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/organization/somitis/${somiti.id}/members`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            সদস্য তালিকা
          </Link>

          <Link
            href={`/organization/somitis/${somiti.id}/payments`}
            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-900 focus:outline-none focus:border-green-900 focus:ring ring-green-300 disabled:opacity-25 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            পেমেন্ট তালিকা
          </Link>

          <Link
            href={`/organization/somitis/${somiti.id}/process-collection`}
            className="inline-flex items-center px-4 py-2 bg-purple-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-purple-700 active:bg-purple-900 focus:outline-none focus:border-purple-900 focus:ring ring-purple-300 disabled:opacity-25 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            কালেকশন প্রসেস করুন
          </Link>

          <Link
            href={`/organization/somitis/${somiti.id}/edit`}
            className="inline-flex items-center px-4 py-2 bg-yellow-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-yellow-700 active:bg-yellow-900 focus:outline-none focus:border-yellow-900 focus:ring ring-yellow-300 disabled:opacity-25 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            সম্পাদনা করুন
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">সমিতি বিবরণ</h3>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">নাম</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{somiti.name}</dd>
              </div>
              <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">ধরন</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{getTypeText(somiti.type)}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">কালেকশন দিন</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{getCollectionDayText()}</dd>
              </div>
              <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">কালেকশন হার</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatAmount(somiti.amount)}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">স্ট্যাটাস</dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${somiti.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {somiti.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                  </span>
                </dd>
              </div>
              <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">সদস্য সংখ্যা</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {somiti.members.length} জন
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">তৈরির তারিখ</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDate(somiti.created_at)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">আর্থিক বিবরণ</h3>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">মোট পরিশোধিত</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p className="font-bold text-xl">{formatAmount(totalPaid)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">মোট বকেয়া</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p className="font-bold text-xl">{formatAmount(totalDue)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">পরবর্তী কালেকশন</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    {nextCollectionDate ? (
                      <>
                        <p className="font-bold">{formatDate(nextCollectionDate)}</p>
                        <p>{nextCollectionDay}</p>
                      </>
                    ) : (
                      <p>নির্ধারিত নয়</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">সাম্প্রতিক পেমেন্ট</h3>
          {latestPayments.length > 0 ? (
            <div className="space-y-4">
              {latestPayments.map((payment) => (
                <div key={payment.id} className="border rounded-md p-3">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium text-gray-900">{payment.member.name}</div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                      {payment.status === 'paid' ? 'পরিশোধিত' :
                       payment.status === 'pending' ? 'বকেয়া' :
                       'ব্যর্থ'}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {formatDate(payment.payment_date)}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatAmount(payment.amount)}
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Link
                      href={`/organization/payments/${payment.id}`}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      বিস্তারিত দেখুন
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">কোন পেমেন্ট পাওয়া যায়নি</div>
          )}

          <div className="mt-4 text-right">
            <Link
              href={`/organization/somitis/${somiti.id}/payments`}
              className="text-sm text-red-600 hover:text-red-800"
            >
              সব পেমেন্ট দেখুন
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">সদস্য তালিকা</h3>
          <div className="flex space-x-2">
            <Link
              href={`/organization/somitis/${somiti.id}/add-members`}
              className="inline-flex items-center px-4 py-2 bg-red-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 active:bg-red-900 focus:outline-none focus:border-red-900 focus:ring ring-red-300 disabled:opacity-25 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              নতুন সদস্য যোগ করুন
            </Link>
          </div>
        </div>

        {somiti.members.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    সদস্য
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ফোন
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    বকেয়া
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    স্ট্যাটাস
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {somiti.members.slice(0, 5).map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {member.photo ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={`/storage/${member.photo}`}
                              alt={member.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                              <span className="font-bold text-red-700">
                                {member.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            <Link
                              href={`/organization/members/${member.id}`}
                              className="hover:text-red-600"
                            >
                              {member.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatAmount(member.pivot.due_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.pivot.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {member.pivot.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">কোন সদস্য পাওয়া যায়নি</div>
        )}

        {somiti.members.length > 5 && (
          <div className="mt-4 text-right">
            <Link
              href={`/organization/somitis/${somiti.id}/members`}
              className="text-sm text-red-600 hover:text-red-800"
            >
              সব সদস্য দেখুন
            </Link>
          </div>
        )}
      </div>
    </OrganizationLayout>
  );
};

export default SomitiShow;
