import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';
import InputError from '@/components/input-error';
import PrimaryButton from '@/components/primary-button';
import SecondaryButton from '@/components/secondary-button';
import { Somiti, Member } from '@/types';

interface SomitiProcessCollectionProps {
  somiti: Somiti;
  members: (Member & { pivot: { due_amount: number; is_active: boolean }; total_due: number });
  collectionDate: string;
  collectionDay: string;
}

const SomitiProcessCollection: React.FC<SomitiProcessCollectionProps> = ({
  somiti,
  members,
  collectionDate,
  collectionDay,
}) => {
  // Initialize the payment state for each member
  const initialPayments = members.map((member) => ({
    member_id: member.id,
    amount: somiti.amount,  // Default to the somiti amount
    status: 'paid' as 'paid' | 'pending',
    member_name: member.name,
    member_photo: member.photo,
    due_amount: member.total_due,
  }));

  const { data, setData, post, processing, errors } = useForm({
    collection_date: collectionDate,
    payments: initialPayments,
  });

  const [showFullDue, setShowFullDue] = useState(false);

  // Function to update a specific payment amount
  const updatePaymentAmount = (index: number, amount: string) => {
    const newPayments = [...data.payments];
    newPayments[index].amount = parseFloat(amount) || 0;
    setData('payments', newPayments);
  };

  // Function to update a specific payment status
  const updatePaymentStatus = (index: number, status: 'paid' | 'pending') => {
    const newPayments = [...data.payments];
    newPayments[index].status = status;
    setData('payments', newPayments);
  };

  // Set all payments to a specific status
  const setAllPaymentStatus = (status: 'paid' | 'pending') => {
    const newPayments = data.payments.map(payment => ({
      ...payment,
      status,
    }));
    setData('payments', newPayments);
  };

  // Pay full dues for a specific member
  const payFullDue = (index: number) => {
    const newPayments = [...data.payments];
    newPayments[index].amount = newPayments[index].due_amount;
    setData('payments', newPayments);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/organization/somitis/${somiti.id}/save-collection`);
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <OrganizationLayout title={`${somiti.name} - কালেকশন প্রসেস`}>
      <Head title={`${somiti.name} - কালেকশন প্রসেস`} />

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
            {somiti.name} - কালেকশন প্রসেস
          </h2>
        </div>

        {/* Collection Info Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">সমিতি</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">{somiti.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">কালেকশনের তারিখ</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {formatDate(collectionDate)} ({collectionDay})
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">স্ট্যান্ডার্ড পরিমাণ</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(somiti.amount)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center">
                  <h3 className="font-medium text-gray-700">সক্রিয় সদস্য ({members.length})</h3>
                  <div className="ml-4">
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-red-600 transition duration-150 ease-in-out"
                        checked={showFullDue}
                        onChange={(e) => setShowFullDue(e.target.checked)}
                      />
                      <span className="ml-2">পুরো বকেয়া দেখান</span>
                    </label>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setAllPaymentStatus('paid')}
                    className="text-sm text-green-600 hover:text-green-800"
                  >
                    সবাইকে পরিশোধিত হিসেবে চিহ্নিত করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setAllPaymentStatus('pending')}
                    className="text-sm text-yellow-600 hover:text-yellow-800"
                  >
                    সবাইকে বকেয়া হিসেবে চিহ্নিত করুন
                  </button>
                </div>
              </div>

              <InputError message={errors.payments} className="mb-4" />

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        সদস্য
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        মোট বকেয়া
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        পেমেন্ট পরিমাণ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        স্ট্যাটাস
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.payments.map((payment, index) => (
                      <tr key={payment.member_id} className={payment.status === 'paid' ? 'bg-green-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {payment.member_photo ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={`/storage/${payment.member_photo}`}
                                  alt={payment.member_name}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                  <span className="font-bold text-red-700">
                                    {payment.member_name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {payment.member_name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(payment.due_amount)}
                            {payment.due_amount > 0 && showFullDue && (
                              <button
                                type="button"
                                onClick={() => payFullDue(index)}
                                className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                              >
                                পুরো পরিমাণ জমা করুন
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">৳</span>
                            </div>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className={`pl-7 block w-full sm:w-32 shadow-sm border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 sm:text-sm ${
                                payment.amount !== somiti.amount ? 'bg-yellow-50' : ''
                              }`}
                              value={payment.amount}
                              onChange={(e) => updatePaymentAmount(index, e.target.value)}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            className={`block w-full shadow-sm border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 sm:text-sm ${
                              payment.status === 'pending' ? 'bg-yellow-50 text-yellow-800' : 'bg-green-50 text-green-800'
                            }`}
                            value={payment.status}
                            onChange={(e) => updatePaymentStatus(index, e.target.value as 'paid' | 'pending')}
                          >
                            <option value="paid">পরিশোধিত</option>
                            <option value="pending">বকেয়া</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-end mt-6">
                <SecondaryButton onClick={handleCancel} className="mr-3" disabled={processing}>
                  বাতিল করুন
                </SecondaryButton>
                <PrimaryButton
                  type="submit"
                  disabled={processing}
                  className="bg-red-600 hover:bg-red-700"
                >
                  কালেকশন সম্পন্ন করুন
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default SomitiProcessCollection;
