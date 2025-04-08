import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';
import { Somiti, PaginatedData } from '@/types';

interface SomitisIndexProps {
  somitis: PaginatedData<Somiti>;
  filters: {
    search?: string;
    type?: string;
    status?: string;
    sort_field?: string;
    sort_direction?: string;
  };
}

const SomitisIndex: React.FC<SomitisIndexProps> = ({ somitis, filters }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

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

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const url = new URL(window.location.href);

    if (e.target.value) {
      url.searchParams.set(e.target.name, e.target.value);
    } else {
      url.searchParams.delete(e.target.name);
    }

    window.location.href = url.toString();
  };

  const formatAmount = (amount: number): string => {
    return '৳' + amount.toLocaleString('bn-BD');
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
    <OrganizationLayout title="সমিতি তালিকা">
      <Head title="সমিতি তালিকা" />

      <div className="mb-6 flex justify-between items-center">
        <div>
          <Link
            href="/organization/somitis/create"
            className="inline-flex items-center px-4 py-2 bg-red-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 active:bg-red-900 focus:outline-none focus:border-red-900 focus:ring ring-red-300 disabled:opacity-25 transition ease-in-out duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            নতুন সমিতি
          </Link>
        </div>

        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="flex rounded-md shadow-sm">
            <input
              type="text"
              name="search"
              placeholder="সমিতির নাম খুঁজুন"
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

          <select
            name="type"
            value={filters.type || ''}
            onChange={handleFilterChange}
            className="rounded-md border-gray-300 focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
          >
            <option value="">সব ধরন</option>
            <option value="daily">দৈনিক</option>
            <option value="weekly">সাপ্তাহিক</option>
            <option value="monthly">মাসিক</option>
          </select>

          <select
            name="status"
            value={filters.status || ''}
            onChange={handleFilterChange}
            className="rounded-md border-gray-300 focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
          >
            <option value="">সব স্ট্যাটাস</option>
            <option value="active">সক্রিয়</option>
            <option value="inactive">নিষ্ক্রিয়</option>
          </select>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>নাম</span>
                    {getSortIcon('name')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('type')}
                >
                  <div className="flex items-center space-x-1">
                    <span>ধরন</span>
                    {getSortIcon('type')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('collection_day')}
                >
                  <div className="flex items-center space-x-1">
                    <span>সংগ্রহের দিন</span>
                    {getSortIcon('collection_day')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('amount')}
                >
                  <div className="flex items-center space-x-1">
                    <span>হার</span>
                    {getSortIcon('amount')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('members_count')}
                >
                  <div className="flex items-center space-x-1">
                    <span>সদস্য</span>
                    {getSortIcon('members_count')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('is_active')}
                >
                  <div className="flex items-center space-x-1">
                    <span>স্ট্যাটাস</span>
                    {getSortIcon('is_active')}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  অ্যাকশন
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {somitis.data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    কোন সমিতি পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                somitis.data.map((somiti) => (
                  <tr key={somiti.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <span className="font-bold text-red-700">
                            {somiti.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {somiti.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        {somiti.type === 'daily' ? 'দৈনিক' : somiti.type === 'weekly' ? 'সাপ্তাহিক' : 'মাসিক'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {somiti.type === 'daily' ? (
                        'প্রতিদিন'
                      ) : somiti.type === 'weekly' ? (
                        somiti.collection_day_name || 'অনির্ধারিত'
                      ) : (
                        somiti.collection_day ? `মাসের ${somiti.collection_day} তারিখ` : 'অনির্ধারিত'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatAmount(somiti.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {somiti.members_count || 0} জন
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${somiti.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {somiti.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/organization/somitis/${somiti.id}`}
                          className="text-gray-700 hover:text-gray-800"
                          title="বিস্তারিত দেখুন"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>

                        <Link
                          href={`/organization/somitis/${somiti.id}/members`}
                          className="text-blue-600 hover:text-blue-800"
                          title="সদস্য দেখুন"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </Link>

                        <Link
                          href={`/organization/somitis/${somiti.id}/process-collection`}
                          className="text-green-600 hover:text-green-800"
                          title="সংগ্রহ করুন"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </Link>

                        <Link
                          href={`/organization/somitis/${somiti.id}/edit`}
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
      {somitis.meta && somitis.meta.last_page > 1 && (
        <div className="mt-6">
          <nav className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              {somitis.meta.current_page > 1 && (
                <a
                  href={somitis.links.prev}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  আগে
                </a>
              )}
              {somitis.meta.current_page < somitis.meta.last_page && (
                <a
                  href={somitis.links.next}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  পরে
                </a>
              )}
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  মোট <span className="font-medium">{somitis.meta.total}</span> সমিতির মধ্যে{' '}
                  <span className="font-medium">{somitis.meta.from}</span> থেকে{' '}
                  <span className="font-medium">{somitis.meta.to}</span> দেখানো হচ্ছে
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  {somitis.meta.links.map((link, index) => {
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

export default SomitisIndex;
