import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';
import { User, PaginatedData, Role } from '@/types';

interface TeamProps {
  team: PaginatedData<User & {
    roles: Role[];
  }>;
  filters: {
    search?: string;
    sort_field?: string;
    sort_direction?: string;
  };
}

const Team: React.FC<TeamProps> = ({ team, filters }) => {
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
    <OrganizationLayout title="টিম সদস্য">
      <Head title="টিম সদস্য" />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <Link
            href="/organization/profile/organization"
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 active:text-gray-800 active:bg-gray-50 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            প্রতিষ্ঠানের তথ্যে ফিরে যান
          </Link>
        </div>

        <div>
          <Link
            href="/organization/profile/create-team-member"
            className="inline-flex items-center px-4 py-2 bg-red-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 active:bg-red-900 focus:outline-none focus:border-red-900 focus:ring ring-red-300 disabled:opacity-25 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            নতুন সদস্য যোগ করুন
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex">
            <div className="flex-grow mr-4">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                সার্চ
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="নাম, ইমেইল বা ফোন দিয়ে খুঁজুন"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                সার্চ করুন
              </button>
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
                  onClick={() => handleSortChange('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>নাম</span>
                    {getSortIcon('name')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('email')}
                >
                  <div className="flex items-center space-x-1">
                    <span>ইমেইল</span>
                    {getSortIcon('email')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ফোন
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  অবস্থান
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {team.data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    কোন সদস্য পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                team.data.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.photo ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={`/storage/${user.photo}`}
                              alt={user.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                              <span className="font-bold text-red-700">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.is_admin ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          অ্যাডমিন
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          কর্মী
                        </span>
                      )}
                      {user.roles && user.roles.map(role => (
                        <span key={role.id} className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {role.name}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {team.meta && team.meta.last_page > 1 && (
        <div className="mt-6">
          <nav className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              {team.meta.current_page > 1 && (
                <a
                  href={team.links.prev}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  আগে
                </a>
              )}
              {team.meta.current_page < team.meta.last_page && (
                <a
                  href={team.links.next}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  পরে
                </a>
              )}
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  মোট <span className="font-medium">{team.meta.total}</span> সদস্যের মধ্যে{' '}
                  <span className="font-medium">{team.meta.from}</span> থেকে{' '}
                  <span className="font-medium">{team.meta.to}</span> দেখানো হচ্ছে
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  {team.meta.links.map((link, index) => {
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

export default Team;
