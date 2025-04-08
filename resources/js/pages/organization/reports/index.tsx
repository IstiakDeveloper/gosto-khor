import React from 'react';
import { Head, Link } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';

const ReportsIndex: React.FC = () => {
  const reportTypes = [
    {
      title: 'সমিতি কালেকশন রিপোর্ট',
      description: 'নির্দিষ্ট সময়কালের জন্য সমিতি অনুযায়ী কালেকশন দেখুন',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      link: '/organization/reports/somiti-collection',
    },
    {
      title: 'সদস্য পেমেন্ট রিপোর্ট',
      description: 'নির্দিষ্ট সদস্যের জন্য সমস্ত পেমেন্টের বিবরণ দেখুন',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      link: '/organization/reports/member-payments',
    },
    {
      title: 'বকেয়া রিপোর্ট',
      description: 'সমিতি অনুযায়ী সদস্যদের বকেয়ার বিবরণ দেখুন',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      link: '/organization/reports/due-report',
    },
    {
      title: 'মাসিক সারসংক্ষেপ',
      description: 'নির্বাচিত বছরে মাসিক কালেকশনের সারসংক্ষেপ দেখুন',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      link: '/organization/reports/monthly-summary',
    },
  ];

  return (
    <OrganizationLayout title="রিপোর্ট">
      <Head title="রিপোর্ট" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report, index) => (
          <Link
            key={index}
            href={report.link}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex space-x-4"
          >
            <div className="flex-shrink-0">{report.icon}</div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{report.title}</h2>
              <p className="text-gray-600 mt-1">{report.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </OrganizationLayout>
  );
};

export default ReportsIndex;
