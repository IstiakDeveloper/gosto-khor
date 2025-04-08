import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';
import { Member, PaginatedData } from '@/types';

interface MembersIndexProps {
  members: PaginatedData<Member>;
  filters: {
    search?: string;
    status?: string;
    sort_field?: string;
    sort_direction?: string;
  };
}

const MembersIndex: React.FC<MembersIndexProps> = ({ members, filters }) => {
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
    <OrganizationLayout title="সদস্য তালিকা">
      <Head title="সদস্য তালিকা" />

      <div className="mb-6 flex justify-between items-center">
        <div>
          <Link
            href="/organization/members/create"
            className="inline-flex items-center px-4 py-2 bg-red-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 active:bg-red-900 focus:outline-none focus:border-red-900 focus:ring ring-red-300 disabled:opacity-25 transition ease-in-out duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            নতুন সদস্য
          </Link>
        </div>

        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="flex rounded-md shadow-sm">
            <input
              type="text"
              name="search"
              placeholder="সদস্যের নাম বা ফোন নম্বর খুঁজুন"
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
                  onClick={() => handleSortChange('phone')}
                >
                  <div className="flex items-center space-x-1">
                    <span>ফোন</span>
                    {getSortIcon('phone')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('address')}
                >
                  <div className="flex items-center space-x-1">
                    <span>ঠিকানা</span>
                    {getSortIcon('address')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('somitis_count')}
                >
                  <div className="flex items-center space-x-1">
                    <span>সমিতি</span>
                    {getSortIcon('somitis_count')}
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
              {members.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    কোন সদস্য পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                members.data.map((member) => (
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
                            {member.name}
                          </div>
                          {member.email && (
                            <div className="text-sm text-gray-500">
                              {member.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{member.address || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.somitis_count || 0} টি
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {member.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/organization/members/${member.id}`}
                          className="text-gray-700 hover:text-gray-800"
                          title="বিস্তারিত দেখুন"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>

                        <Link
                          href={`/organization/members/${member.id}/payments`}
                          className="text-blue-600 hover:text-blue-800"
                          title="পেমেন্ট দেখুন"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </Link>

                        <Link
                          href={`/organization/members/${member.id}/make-payment`}
                          className="text-green-600 hover:text-green-800"
                          title="পেমেন্ট করুন"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </Link>

                        <Link
                          href={`/organization/members/${member.id}/edit`}
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
      {members.meta && members.meta.last_page > 1 && (
        <div className="mt-6">
          <nav className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              {members.meta.current_page > 1 && (
                <a
                  href={members.links.prev}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  আগে
                </a>
              )}
              {members.meta.current_page < members.meta.last_page && (
                <a
                  href={members.links.next}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  পরে
                </a>
              )}
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  মোট <span className="font-medium">{members.meta.total}</span> সদস্যের মধ্যে{' '}
                  <span className="font-medium">{members.meta.from}</span> থেকে{' '}
                  <span className="font-medium">{members.meta.to}</span> দেখানো হচ্ছে
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  {members.meta.links.map((link, index) => {
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

export default MembersIndex;
