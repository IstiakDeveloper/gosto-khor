import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';
import InputError from '@/components/input-error';
import InputLabel from '@/components/input-label';
import TextInput from '@/components/text-input';
import SelectInput from '@/components/select-input';
import PrimaryButton from '@/components/primary-button';
import SecondaryButton from '@/components/secondary-button';

const SomitiCreate: React.FC = () => {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    type: 'monthly',
    collection_day: '',
    amount: '',
    start_date: new Date().toISOString().split('T')[0], // Default to today's date
  });

  const [showCollectionDay, setShowCollectionDay] = useState(true);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setData('type', value);

    // Reset collection day when type changes
    setData('collection_day', '');

    // Hide collection day for daily type
    setShowCollectionDay(value !== 'daily');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/organization/somitis', {
      onSuccess: () => {
        reset();
      },
    });
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <OrganizationLayout title="নতুন সমিতি যোগ করুন">
      <Head title="নতুন সমিতি যোগ করুন" />

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
                          <option key={index + 1} value={index + 1}>
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
                      onChange={(e) => setData('amount', e.target.value)}
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

                <div className="flex items-center justify-end mt-6">
                  <SecondaryButton onClick={handleCancel} className="mr-3" disabled={processing}>
                    বাতিল করুন
                  </SecondaryButton>
                  <PrimaryButton type="submit" disabled={processing} className="bg-red-600 hover:bg-red-700">
                    সমিতি তৈরি করুন
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

export default SomitiCreate;
