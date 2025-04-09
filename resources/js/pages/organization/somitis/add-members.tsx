import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';
import InputError from '@/components/input-error';
import InputLabel from '@/components/input-label';
import TextInput from '@/components/text-input';
import PrimaryButton from '@/components/primary-button';
import SecondaryButton from '@/components/secondary-button';
import { Somiti, Member } from '@/types';

interface SomitiAddMembersProps {
  somiti: Somiti;
  availableMembers: Member[];
}

const SomitiAddMembers: React.FC<SomitiAddMembersProps> = ({ somiti, availableMembers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);

  const { data, setData, post, processing, errors } = useForm({
    member_ids: [] as number[],
    join_date: new Date().toISOString().split('T')[0], // Default to today's date
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const toggleMemberSelection = (memberId: number) => {
    if (selectedMemberIds.includes(memberId)) {
      // Remove member from selection
      setSelectedMemberIds(selectedMemberIds.filter((id) => id !== memberId));
      setData('member_ids', data.member_ids.filter((id) => id !== memberId));
    } else {
      // Add member to selection
      setSelectedMemberIds([...selectedMemberIds, memberId]);
      setData('member_ids', [...data.member_ids, memberId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/organization/somitis/${somiti.id}/add-members`);
  };

  const handleCancel = () => {
    window.history.back();
  };

  // Filter members based on search term
  const filteredMembers = searchTerm
    ? availableMembers.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm) ||
          member.phone.toLowerCase().includes(searchTerm) ||
          (member.email && member.email.toLowerCase().includes(searchTerm))
      )
    : availableMembers;

  return (
    <OrganizationLayout title={`${somiti.name} - নতুন সদস্য যোগ করুন`}>
      <Head title={`${somiti.name} - নতুন সদস্য যোগ করুন`} />

      <div className="py-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/organization/somitis/${somiti.id}/members`}
            className="text-red-600 hover:text-red-800 flex items-center text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            সদস্য তালিকায় ফিরে যান
          </Link>
          <h2 className="text-2xl font-semibold text-gray-800 mt-1">
            {somiti.name} - নতুন সদস্য যোগ করুন
          </h2>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <InputLabel htmlFor="join_date" value="যোগদানের তারিখ" />
                <TextInput
                  id="join_date"
                  type="date"
                  className="mt-1 block w-full sm:w-1/3"
                  value={data.join_date}
                  onChange={(e) => setData('join_date', e.target.value)}
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  এই তারিখ থেকে সদস্যের বকেয়া হিসাব করা হবে।
                </p>
                <InputError message={errors.join_date} className="mt-2" />
              </div>

              <div className="mb-6">
                <InputLabel htmlFor="search" value="সদস্য খুঁজুন" />
                <TextInput
                  id="search"
                  type="text"
                  className="mt-1 block w-full"
                  placeholder="নাম, ফোন নম্বর বা ইমেইল দিয়ে খুঁজুন"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-700">উপলব্ধ সদস্য ({filteredMembers.length})</h3>
                  <p className="text-sm text-gray-500">
                    {selectedMemberIds.length} জন সদস্য নির্বাচিত
                  </p>
                </div>
                <InputError message={errors.member_ids} className="mt-2" />
              </div>

              {availableMembers.length === 0 ? (
                <div className="bg-gray-50 p-4 rounded-md text-gray-500 text-center">
                  কোন সদস্য পাওয়া যায়নি। সদস্য যোগ করতে হলে আগে সদস্য তৈরি করুন।
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="bg-gray-50 p-4 rounded-md text-gray-500 text-center">
                  আপনার অনুসন্ধানের সাথে মিলে এমন কোন সদস্য পাওয়া যায়নি।
                </div>
              ) : (
                <div className="border border-gray-200 rounded-md overflow-hidden max-h-96 overflow-y-auto">
                  <ul className="divide-y divide-gray-200">
                    {filteredMembers.map((member) => (
                      <li key={member.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            checked={selectedMemberIds.includes(member.id)}
                            onChange={() => toggleMemberSelection(member.id)}
                          />
                          <div className="ml-3 flex items-center">
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
                              <div className="text-sm font-medium text-gray-900">{member.name}</div>
                              <div className="text-sm text-gray-500">{member.phone}</div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-end mt-6">
                <SecondaryButton onClick={handleCancel} className="mr-3" disabled={processing}>
                  বাতিল করুন
                </SecondaryButton>
                <PrimaryButton
                  type="submit"
                  disabled={processing || selectedMemberIds.length === 0}
                  className="bg-red-600 hover:bg-red-700"
                >
                  সদস্য যোগ করুন
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default SomitiAddMembers;
