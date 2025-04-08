import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';
import { Member, Somiti } from '@/types';

interface AddMembersProps {
  somiti: Somiti;
  availableMembers: Member[];
}

const AddMembers: React.FC<AddMembersProps> = ({ somiti, availableMembers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  const { data, setData, post, processing, errors } = useForm({
    member_ids: [] as number[],
  });

  const filteredMembers = availableMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  const toggleMember = (memberId: number) => {
    const newSelectedMembers = selectedMembers.includes(memberId)
      ? selectedMembers.filter(id => id !== memberId)
      : [...selectedMembers, memberId];

    setSelectedMembers(newSelectedMembers);
    setData('member_ids', newSelectedMembers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/organization/somitis/${somiti.id}/add-members`);
  };

  const selectAll = () => {
    const allIds = filteredMembers.map(member => member.id);
    setSelectedMembers(allIds);
    setData('member_ids', allIds);
  };

  const deselectAll = () => {
    setSelectedMembers([]);
    setData('member_ids', []);
  };

  return (
    <OrganizationLayout title={`সদস্য যোগ করুন: ${somiti.name}`}>
      <Head title={`সদস্য যোগ করুন: ${somiti.name}`} />

      <div className="mb-6">
        <Link
          href={`/organization/somitis/${somiti.id}/members`}
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 active:text-gray-800 active:bg-gray-50 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          সদস্য তালিকায় ফিরে যান
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900">
            {somiti.name} - সদস্য যোগ করুন
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            যে সমস্ত সদস্যদের সমিতিতে যোগ করতে চান তাদের নির্বাচন করুন।
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="w-full md:w-1/2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                সদস্য খুঁজুন
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="নাম বা ফোন নম্বর দিয়ে খুঁজুন"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>

            <div className="w-full md:w-1/2 flex justify-end items-end space-x-2">
              <button
                type="button"
                onClick={selectAll}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                disabled={filteredMembers.length === 0}
              >
                সব নির্বাচন করুন
              </button>
              <button
                type="button"
                onClick={deselectAll}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                disabled={selectedMembers.length === 0}
              >
                সব বাতিল করুন
              </button>
            </div>
          </div>
        </div>

        {errors.member_ids && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {errors.member_ids}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="border rounded-md overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              {filteredMembers.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  {searchTerm ? 'কোন সদস্য পাওয়া যায়নি' : 'সমস্ত সদস্য ইতিমধ্যে এই সমিতিতে যোগ করা হয়েছে'}
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                        <span className="sr-only">নির্বাচন করুন</span>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        নাম
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ফোন
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ঠিকানা
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMembers.map((member) => (
                      <tr
                        key={member.id}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedMembers.includes(member.id) ? 'bg-red-50' : ''
                        }`}
                        onClick={() => toggleMember(member.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedMembers.includes(member.id)}
                            onChange={() => toggleMember(member.id)}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {member.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {member.address || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              {selectedMembers.length} জন সদস্য নির্বাচিত
            </div>

            <div className="flex space-x-3">
              <Link
                href={`/organization/somitis/${somiti.id}/members`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
              >
                বাতিল করুন
              </Link>
              <button
                type="submit"
                disabled={processing || selectedMembers.length === 0}
                className="inline-flex items-center px-4 py-2 bg-red-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 active:bg-red-900 focus:outline-none focus:border-red-900 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
              >
                {processing ? 'প্রসেসিং...' : 'সদস্য যোগ করুন'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </OrganizationLayout>
  );
};

export default AddMembers;
