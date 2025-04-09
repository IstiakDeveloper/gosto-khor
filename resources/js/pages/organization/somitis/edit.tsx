import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';
import InputError from '@/components/input-error';
import InputLabel from '@/components/input-label';
import TextInput from '@/components/text-input';
import SelectInput from '@/components/select-input';
import Checkbox from '@/components/checkbox';
import PrimaryButton from '@/components/primary-button';
import SecondaryButton from '@/components/secondary-button';
import { Somiti } from '@/types';

interface SomitiEditProps {
  somiti: Somiti;
}

const SomitiEdit: React.FC<SomitiEditProps> = ({ somiti }) => {
  const { data, setData, put, processing, errors } = useForm({
    name: somiti.name,
    type: somiti.type,
    collection_day: somiti.collection_day?.toString() || '',
    amount: somiti.amount.toString(),
    start_date: somiti.start_date || new Date().toISOString().split('T')[0],
    is_active: somiti.is_active,
    recalculate_dues: false,
  });

  const [showCollectionDay, setShowCollectionDay] = useState(somiti.type !== 'daily');
  const [amountChanged, setAmountChanged] = useState(false);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setData('type', value);

    // Reset collection day when type changes
    setData('collection_day', '');

    // Hide collection day for daily type
    setShowCollectionDay(value !== 'daily');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value;
    setData('amount', newAmount);

    // Check if amount has changed
    setAmountChanged(parseFloat(newAmount) !== somiti.amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/organization/somitis/${somiti.id}`);
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <OrganizationLayout title="সমিতি সম্পাদনা করুন">
      <Head title="সমিতি সম্পাদনা করুন" />

      <div className="py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <InputLabel htmlFor="name" value="সমিতির নাম" />
                  <TextInput
                    id="name"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                  />
                  <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mb-6">
                  <InputLabel htmlFor="type" value="সমিতির ধরন" />
                  <SelectInput
                    id="type"
                    className="mt-1 block w-full"
                    value={data.type}
                    onChange={handleTypeChange}
                    required
                  >
                    <option value="monthly">মাসিক</option>
                    <option value="weekly">সাপ্তাহিক</option>
                    <option value="daily">দৈনিক</option>
                  </SelectInput>
                  <InputError message={errors.type} className="mt-2" />
                </div>

                {showCollectionDay && (
                  <div className="mb-6">
                    <InputLabel htmlFor="collection_day" value={data.type === 'monthly' ? 'কালেকশনের দিন (তারিখ)' : 'কালেকশনের দিন (বার)'} />

                    {data.type === 'monthly' ? (
                      <SelectInput
                        id="collection_day"
                        className="mt-1 block w-full"
                        value={data.collection_day}
                        onChange={(e) => setData('collection_day', e.target.value)}
                        required
                      >
                        <option value="">-- দিন নির্বাচন করুন --</option>
                        {[...Array(31)].map((_, index) => (
                          <option key={index + 1} value={(index + 1).toString()}>
                            {index + 1}
                          </option>
                        ))}
                      </SelectInput>
                    ) : (
                      <SelectInput
                        id="collection_day"
                        className="mt-1 block w-full"
                        value={data.collection_day}
                        onChange={(e) => setData('collection_day', e.target.value)}
                        required
                      >
                        <option value="">-- বার নির্বাচন করুন --</option>
                        <option value="0">রবিবার</option>
                        <option value="1">সোমবার</option>
                        <option value="2">মঙ্গলবার</option>
                        <option value="3">বুধবার</option>
                        <option value="4">বৃহস্পতিবার</option>
                        <option value="5">শুক্রবার</option>
                        <option value="6">শনিবার</option>
                      </SelectInput>
                    )}

                    <InputError message={errors.collection_day} className="mt-2" />
                  </div>
                )}

                <div className="mb-6">
                  <InputLabel htmlFor="amount" value="কালেকশনের পরিমাণ" />
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">৳</span>
                    </div>
                    <TextInput
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      className="mt-1 block w-full pl-7"
                      value={data.amount}
                      onChange={handleAmountChange}
                      required
                    />
                  </div>
                  <InputError message={errors.amount} className="mt-2" />
                </div>

                <div className="mb-6">
                  <InputLabel htmlFor="start_date" value="শুরুর তারিখ" />
                  <TextInput
                    id="start_date"
                    type="date"
                    className="mt-1 block w-full"
                    value={data.start_date}
                    onChange={(e) => setData('start_date', e.target.value)}
                    required
                  />
                  <InputError message={errors.start_date} className="mt-2" />
                </div>

                <div className="mb-6">
                  <div className="flex items-center">
                    <Checkbox
                      id="is_active"
                      checked={data.is_active}
                      onChange={(e) => setData('is_active', e.target.checked)}
                    />
                    <InputLabel htmlFor="is_active" value="সক্রিয়" className="ml-2" />
                  </div>
                  <InputError message={errors.is_active} className="mt-2" />
                </div>

                {amountChanged && (
                  <div className="mb-6 p-4 bg-yellow-50 rounded-md border border-yellow-300">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">সতর্কতা</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>আপনি সমিতির পরিমাণ পরিবর্তন করছেন। আপনি কি সকল সদস্যের বকেয়া পরিমাণ পুনরায় হিসাব করতে চান?</p>
                          <div className="mt-3">
                            <div className="flex items-center">
                              <Checkbox
                                id="recalculate_dues"
                                checked={data.recalculate_dues}
                                onChange={(e) => setData('recalculate_dues', e.target.checked)}
                              />
                              <label htmlFor="recalculate_dues" className="ml-2 block text-sm text-yellow-700">
                                হ্যাঁ, সকল সদস্যের বকেয়া পুনরায় হিসাব করুন
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end mt-6">
                  <SecondaryButton onClick={handleCancel} className="mr-3" disabled={processing}>
                    বাতিল করুন
                  </SecondaryButton>
                  <PrimaryButton type="submit" disabled={processing} className="bg-red-600 hover:bg-red-700">
                    হালনাগাদ করুন
                  </PrimaryButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default SomitiEdit;
