import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';
import { Payment, Somiti, PaginatedData } from '@/types';

interface PaymentsIndexProps {
  payments: PaginatedData<Payment>;
  somitis: Somiti[];
  filters: {
    search?: string;
    somiti_id?: string;
    date_from?: string;
    date_to?: string;
    status?: string;
    sort_field?: string;
    sort_direction?: string;
  };
}

const PaymentsIndex: React.FC<PaymentsIndexProps> = ({ payments, somitis, filters }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [somitiId, setSomitiId] = useState(filters.somiti_id || '');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');
  const [status, setStatus] = useState(filters.status || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const url = new URL(window.location.href);

    if (searchTerm) {
      url.searchParams.set('search', searchTerm);
    } else {
      url.searchParams.delete('search');
    }

    if (somitiId) {
      url.searchParams.set('somiti_id', somitiId);
    } else {
      url.searchParams.delete('somiti_id');
    }

    if (dateFrom) {
      url.searchParams.set('date_from', dateFrom);
    } else {
      url.searchParams.delete('date_from');
    }

    if (dateTo) {
      url.searchParams.set('date_to', dateTo);
    } else {
      url.searchParams.delete('date_to');
    }

    if (status) {
      url.searchParams.set('status', status);
    } else {
      url.searchParams.delete('status');
    }

    window.location.href = url.toString();
  };

  const handleSortChange = (field: string) => {
    const url = new URL(window.location.href);

    if (filters.sort_field === field) {
      // Toggle direction if already sorting by this field
      const newDirection = filters.sort_direction === 'asc' ? 'desc' : 'asc';
      url.searchParams.set('sort_direction', newDirection);
    } else {
      // Set new sort field with default ascending direction
      url.searchParams.set('sort_field', field);
      url.searchParams.set('sort_direction', 'asc');
    }

    window.location.href = url.toString();
  };

  const getSortIcon = (field: string) => {
    if (filters.sort_field !== field) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-40" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12z" />
          <path d="M15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
        </svg>
      );
    }

    return filters.sort_direction === 'asc' ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    );
  };

  const formatAmount = (amount: number): string => {
    return '৳' + amount.toLocaleString('bn-BD');
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('bn-BD');
  };

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'paid':
        return 'পরিশোধিত';
      case 'pending':
        return 'বকেয়া';
      case 'failed':
        return 'ব্যর্থ';
      default:
        return status;
    }
  };

  return (
    <OrganizationLayout title="পেমেন্ট তালিকা">
      <Head title="পেমেন্ট তালিকা" />

      <div className="mb-6">
        <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                সার্চ
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="সদস্যের নাম বা ফোন"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="somiti_id" className="block text-sm font-medium text-gray-700 mb-1">
                সমিতি
              </label>
              <select
                id="somiti_id"
                value={somitiId}
                onChange={(e) => setSomitiId(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              >
                <option value="">সব সমিতি</option>
                {somitis.map((somiti) => (
                  <option key={somiti.id} value={somiti.id}>
                    {somiti.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="date_from" className="block text-sm font-medium text-gray-700 mb-1">
                শুরুর তারিখ
              </label>
              <input
                id="date_from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="date_to" className="block text-sm font-medium text-gray-700 mb-1">
                শেষের তারিখ
              </label>
              <input
                id="date_to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                স্ট্যাটাস
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              >
                <option value="">সব স্ট্যাটাস</option>
                <option value="paid">পরিশোধিত</option>
                <option value="pending">বকেয়া</option>
                <option value="failed">ব্যর্থ</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                সার্চ করুন
              </button>

              <Link
                href="/organization/payments/export"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                এক্সপোর্ট (CSV)
              </Link>
            </div>
          </div>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('somiti_id')}
                >
                  <div className="flex items-center space-x-1">
                    <span>সমিতি</span>
                    {getSortIcon('somiti_id')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('member_id')}
                >
                  <div className="flex items-center space-x-1">
                    <span>সদস্য</span>
                    {getSortIcon('member_id')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('amount')}
                >
                  <div className="flex items-center space-x-1">
                    <span>পরিমাণ</span>
                    {getSortIcon('amount')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('payment_date')}
                >
                  <div className="flex items-center space-x-1">
                    <span>তারিখ</span>
                    {getSortIcon('payment_date')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>স্ট্যাটাস</span>
                    {getSortIcon('status')}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  অ্যাকশন
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    কোন পেমেন্ট পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                payments.data.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.somiti?.name || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                          <span className="font-medium text-red-700">
                            {payment.member?.name.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.member?.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.member?.phone || ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatAmount(payment.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(payment.payment_date)}
                      </div>
                      <div className="text-xs text-gray-500">
                        কালেকশন: {formatDate(payment.collection_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/organization/payments/${payment.id}`}
                          className="text-gray-700 hover:text-gray-800"
                          title="বিস্তারিত দেখুন"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>

                        {payment.status === 'pending' && (
                          <Link
                            href={`/organization/payments/${payment.id}/mark-as-paid`}
                            method="put"
                            as="button"
                            className="text-green-600 hover:text-green-800"
                            title="পরিশোধিত হিসেবে চিহ্নিত করুন"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </Link>
                        )}

                        <Link
                          href={`/organization/payments/${payment.id}/edit`}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="সম্পাদনা করুন"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {payments.meta && payments.meta.last_page > 1 && (
        <div className="mt-6">
          <nav className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              {payments.meta.current_page > 1 && (
                <a
                  href={payments.links.prev}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  আগে
                </a>
              )}
              {payments.meta.current_page < payments.meta.last_page && (
                <a
                  href={payments.links.next}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  পরে
                </a>
              )}
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  মোট <span className="font-medium">{payments.meta.total}</span> পেমেন্টের মধ্যে{' '}
                  <span className="font-medium">{payments.meta.from}</span> থেকে{' '}
                  <span className="font-medium">{payments.meta.to}</span> দেখানো হচ্ছে
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  {payments.meta.links.map((link, index) => {
                    if (link.url === null) {
                      return (
                        <span
                          key={index}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500"
                          dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                      );
                    }

                    return (
                      <a
                        key={index}
                        href={link.url}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          link.active ? 'z-10 bg-red-50 border-red-500 text-red-600' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    );
                  })}
                </nav>
              </div>
            </div>
          </nav>
        </div>
      )}
    </OrganizationLayout>
  );
};

export default PaymentsIndex;
