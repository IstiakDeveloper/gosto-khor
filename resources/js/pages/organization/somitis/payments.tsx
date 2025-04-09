import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';
import { Somiti, Payment as PaymentType, PaginatedData } from '@/types';
import Modal from '@/components/modal';

interface SomitiPaymentsProps {
  somiti: Somiti;
  payments: PaginatedData<PaymentType>;
  filters: {
    search?: string;
    date_from?: string;
    date_to?: string;
    status?: string;
    sort_field?: string;
    sort_direction?: string;
  };
}

const SomitiPayments: React.FC<SomitiPaymentsProps> = ({ somiti, payments, filters }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedPayment, setSelectedPayment] = useState<PaymentType | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const { data, setData, post, processing, reset } = useForm({
    status: '',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    if (searchTerm) {
      url.searchParams.set('search', searchTerm);
    } else {
      url.searchParams.delete('search');
    }
    window.location.href = url.toString();
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const url = new URL(window.location.href);

    if (e.target.value) {
      url.searchParams.set(e.target.name, e.target.value);
    } else {
      url.searchParams.delete(e.target.name);
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

  const openStatusModal = (payment: PaymentType) => {
    setSelectedPayment(payment);
    setData('status', payment.status);
    setShowStatusModal(true);
  };

  const closeStatusModal = () => {
    setSelectedPayment(null);
    setShowStatusModal(false);
    reset();
  };

  const updatePaymentStatus = () => {
    if (selectedPayment) {
      post(`/organization/payments/${selectedPayment.id}/status`, {
        onSuccess: () => {
          closeStatusModal();
        },
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(amount);
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

  return (
    <OrganizationLayout title={`${somiti.name} - পেমেন্ট তালিকা`}>
      <Head title={`${somiti.name} - পেমেন্ট তালিকা`} />

      <div className="py-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/organization/somitis/${somiti.id}`}
            className="text-red-600 hover:text-red-800 flex items-center text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            সমিতিতে ফিরে যান
          </Link>
          <h2 className="text-2xl font-semibold text-gray-800 mt-1">
            {somiti.name} - পেমেন্ট তালিকা
          </h2>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  সদস্য খুঁজুন
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    id="search"
                    type="text"
                    name="search"
                    placeholder="নাম বা ফোন নম্বর"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 rounded-l-md border-gray-300 focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md hover:text-gray-700 focus:outline-none focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="date_from" className="block text-sm font-medium text-gray-700 mb-1">
                  শুরুর তারিখ
                </label>
                <input
                  id="date_from"
                  type="date"
                  name="date_from"
                  value={filters.date_from || ''}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                />
              </div>

              <div>
                <label htmlFor="date_to" className="block text-sm font-medium text-gray-700 mb-1">
                  শেষের তারিখ
                </label>
                <input
                  id="date_to"
                  type="date"
                  name="date_to"
                  value={filters.date_to || ''}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  স্ট্যাটাস
                </label>
                <select
                  id="status"
                  name="status"
                  value={filters.status || ''}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                >
                  <option value="">সব স্ট্যাটাস</option>
                  <option value="paid">পরিশোধিত</option>
                  <option value="pending">বকেয়া</option>
                  <option value="failed">ব্যর্থ</option>
                </select>
              </div>
            </form>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('payment_date')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>পেমেন্ট তারিখ</span>
                      {getSortIcon('payment_date')}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('collection_date')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>কালেকশন তারিখ</span>
                      {getSortIcon('collection_date')}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    সদস্য
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
                    <tr key={payment.id} className={`hover:bg-gray-50 ${
                      payment.status === 'paid' ? 'bg-green-50' :
                      payment.status === 'pending' ? 'bg-yellow-50' :
                      'bg-red-50'
                    }`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(payment.payment_date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(payment.collection_date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {payment.member.photo ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={`/storage/${payment.member.photo}`}
                                alt={payment.member.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                <span className="font-bold text-red-700">
                                  {payment.member.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{payment.member.name}</div>
                            <div className="text-sm text-gray-500">{payment.member.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.status === 'paid' && 'পরিশোধিত'}
                          {payment.status === 'pending' && 'বকেয়া'}
                          {payment.status === 'failed' && 'ব্যর্থ'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openStatusModal(payment)}
                          className="text-blue-600 hover:text-blue-800"
                          title="স্ট্যাটাস পরিবর্তন করুন"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </button>
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
      </div>

      {/* Payment Status Modal */}
      <Modal show={showStatusModal} onClose={closeStatusModal}>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            পেমেন্ট স্ট্যাটাস পরিবর্তন করুন
          </h3>
          {selectedPayment && (
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                <span className="font-medium">{selectedPayment.member.name}</span> এর{' '}
                <span className="font-medium">{formatDate(selectedPayment.payment_date)}</span> তারিখের{' '}
                <span className="font-medium">{formatCurrency(selectedPayment.amount)}</span> পেমেন্টের স্ট্যাটাস পরিবর্তন করুন
              </p>

              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-red-600"
                    name="status"
                    value="paid"
                    checked={data.status === 'paid'}
                    onChange={() => setData('status', 'paid')}
                  />
                  <span className="ml-2">পরিশোধিত</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-red-600"
                    name="status"
                    value="pending"
                    checked={data.status === 'pending'}
                    onChange={() => setData('status', 'pending')}
                  />
                  <span className="ml-2">বকেয়া</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-red-600"
                    name="status"
                    value="failed"
                    checked={data.status === 'failed'}
                    onChange={() => setData('status', 'failed')}
                  />
                  <span className="ml-2">ব্যর্থ</span>
                </label>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <button
              onClick={closeStatusModal}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              disabled={processing}
            >
              বাতিল করুন
            </button>
            <button
              onClick={updatePaymentStatus}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              disabled={processing}
            >
              হালনাগাদ করুন
            </button>
          </div>
        </div>
      </Modal>
    </OrganizationLayout>
  );
};

export default SomitiPayments;
