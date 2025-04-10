import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';
import {
    BanknoteIcon,
    CreditCardIcon,
    SearchIcon,
    CalendarIcon,
    XCircleIcon,
    CheckIcon
} from 'lucide-react';

interface Member {
    id: number;
    name: string;
    phone: string;
    due_amount: number;
    expected_amount: number;
    paid_amount: number;
}

interface Somiti {
    id: number;
    name: string;
    type: 'daily' | 'weekly' | 'monthly';
    amount: number;
    collection_day: number;
}

interface PaymentFormProps {
    auth: {
        user: any;
    };
    somiti: Somiti;
    members: Member[];
    paymentMethods: Record<string, string>;
    totalDue: number;
    nextCollectionDate: string;
}

const SomitiPaymentForm: React.FC<PaymentFormProps> = ({
    auth,
    somiti,
    members,
    paymentMethods,
    totalDue,
    nextCollectionDate
}) => {
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        somiti_id: somiti.id,
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        transaction_id: '',
        notes: '',
        payments: [] as { member_id: number; amount: number; collection_date: string }[],
    });

    // Filter members based on search term
    const filteredMembers = members.filter(
        (member) =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.phone.includes(searchTerm)
    );

    // Handle select all checkbox
    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        if (newSelectAll) {
            setSelectedMembers(filteredMembers.map((member) => member.id));
        } else {
            setSelectedMembers([]);
        }
    };

    // Handle individual member selection
    const handleSelectMember = (memberId: number) => {
        if (selectedMembers.includes(memberId)) {
            setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
        } else {
            setSelectedMembers([...selectedMembers, memberId]);
        }
    };

    // Update form data when selections change
    useEffect(() => {
        const payments = selectedMembers.map((memberId) => {
            const member = members.find((m) => m.id === memberId);
            return {
                member_id: memberId,
                amount: member?.due_amount || 0,
                collection_date: nextCollectionDate,
            };
        });
        setData('payments', payments);
    }, [selectedMembers, nextCollectionDate]);

    // Calculate total amount to be paid
    const totalToPay = data.payments.reduce((sum, payment) => sum + payment.amount, 0);

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('organization.somiti.process.payments'), {
            onSuccess: () => {
                reset();
                setSelectedMembers([]);
                setSelectAll(false);
            },
        });
    };

    // Handle payment amount change
    const handleAmountChange = (memberId: number, amount: string) => {
        const numericAmount = parseFloat(amount) || 0;
        setData(
            'payments',
            data.payments.map((payment) =>
                payment.member_id === memberId
                    ? { ...payment, amount: numericAmount }
                    : payment
            )
        );
    };

    // Get Bangla text for somiti type
    const getSomitiTypeText = (type: string) => {
        switch (type) {
            case 'monthly': return 'মাসিক';
            case 'weekly': return 'সাপ্তাহিক';
            case 'daily': return 'দৈনিক';
            default: return type;
        }
    };

    // Get Bangla text for day of week (for weekly somitis)
    const getDayOfWeekText = (day: number) => {
        const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
        return days[day] || '';
    };

    // Format collection day info based on somiti type
    const getCollectionDayInfo = () => {
        if (somiti.type === 'monthly' && somiti.collection_day) {
            return `মাসের ${somiti.collection_day} তারিখ`;
        } else if (somiti.type === 'weekly' && somiti.collection_day !== null) {
            return getDayOfWeekText(somiti.collection_day);
        }
        return '';
    };

    return (
        <OrganizationLayout title={`পেমেন্ট কালেকশন - ${somiti.name}`}>
            <Head title={`পেমেন্ট কালেকশন - ${somiti.name}`} />

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold">পেমেন্ট কালেকশন - {somiti.name}</h2>
                    <p className="text-sm text-gray-500">
                        {getSomitiTypeText(somiti.type)} সমিতি - {getCollectionDayInfo()}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <BanknoteIcon className="w-5 h-5 text-red-600" />
                    <span className="text-lg font-bold text-red-600">
                        মোট বাকি: ৳{totalDue.toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                    {/* Summary Card */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">সমিতির ধরন</span>
                                <span className="font-medium capitalize">{getSomitiTypeText(somiti.type)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">কালেকশন পরিমাণ</span>
                                <span className="font-medium">৳{somiti.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">পরবর্তী কালেকশন তারিখ</span>
                                <span className="font-medium">{nextCollectionDate}</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Payment Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div>
                                <label htmlFor="payment_date" className="block text-sm font-medium text-gray-700">
                                    পেমেন্ট তারিখ
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                                        <CalendarIcon className="h-4 w-4" />
                                    </span>
                                    <input
                                        type="date"
                                        id="payment_date"
                                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-red-500 focus:border-red-500 sm:text-sm border-gray-300"
                                        value={data.payment_date}
                                        onChange={(e) => setData('payment_date', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.payment_date && (
                                    <p className="mt-1 text-sm text-red-600">{errors.payment_date}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">
                                    পেমেন্ট পদ্ধতি
                                </label>
                                <select
                                    id="payment_method"
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                                    value={data.payment_method}
                                    onChange={(e) => setData('payment_method', e.target.value)}
                                    required
                                >
                                    {Object.entries(paymentMethods).map(([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                                {errors.payment_method && (
                                    <p className="mt-1 text-sm text-red-600">{errors.payment_method}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="transaction_id" className="block text-sm font-medium text-gray-700">
                                    ট্রানজেকশন আইডি (ঐচ্ছিক)
                                </label>
                                <input
                                    type="text"
                                    id="transaction_id"
                                    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    value={data.transaction_id}
                                    onChange={(e) => setData('transaction_id', e.target.value)}
                                />
                                {errors.transaction_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.transaction_id}</p>
                                )}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                নোট (ঐচ্ছিক)
                            </label>
                            <textarea
                                id="notes"
                                rows={2}
                                className="shadow-sm focus:ring-red-500 focus:border-red-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                            />
                            {errors.notes && (
                                <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                            )}
                        </div>

                        {/* Search and Member Selection */}
                        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="w-full sm:w-auto">
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pr-10 flex items-center pointer-events-none">
                                        <SearchIcon className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                        placeholder="নাম বা ফোন দিয়ে খুঁজুন"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="select-all"
                                    name="select-all"
                                    type="checkbox"
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                />
                                <label htmlFor="select-all" className="ml-2 block text-sm text-gray-900">
                                    সব সদস্য নির্বাচন করুন
                                </label>
                            </div>
                        </div>

                        {/* Members List */}
                        <div className="overflow-x-auto border border-gray-200 rounded-lg mb-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            নির্বাচন
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            সদস্য
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            প্রত্যাশিত পরিমাণ
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            পরিশোধিত পরিমাণ
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            বাকি পরিমাণ
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            পেমেন্ট পরিমাণ
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredMembers.length > 0 ? (
                                        filteredMembers.map((member) => {
                                            const isSelected = selectedMembers.includes(member.id);
                                            const payment = data.payments.find((p) => p.member_id === member.id);

                                            return (
                                                <tr
                                                    key={member.id}
                                                    className={isSelected ? "bg-red-50" : "hover:bg-gray-50"}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="checkbox"
                                                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                                            checked={isSelected}
                                                            onChange={() => handleSelectMember(member.id)}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                                                <div className="text-sm text-gray-500">{member.phone}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        ৳{member.expected_amount.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        ৳{member.paid_amount.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            ৳{member.due_amount.toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="number"
                                                            className={`w-24 border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm ${isSelected ? "" : "bg-gray-100"
                                                                }`}
                                                            value={payment?.amount || 0}
                                                            onChange={(e) => handleAmountChange(member.id, e.target.value)}
                                                            disabled={!isSelected}
                                                            min="0"
                                                            step="any"
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                                কোন সদস্য পাওয়া যায়নি
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">পেমেন্ট সারসংক্ষেপ</h3>
                                    <p className="text-sm text-gray-500">
                                        {selectedMembers.length} জন সদস্য নির্বাচিত
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-medium text-gray-900">
                                        মোট পরিমাণ: <span className="text-red-600 font-bold">৳{totalToPay.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Errors */}
                        {errors.payments && (
                            <div className="rounded-md bg-red-50 p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">
                                            {errors.payments}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                disabled={processing || selectedMembers.length === 0 || totalToPay <= 0}
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        প্রসেসিং...
                                    </>
                                ) : (
                                    <>
                                        <CreditCardIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                        পেমেন্ট প্রসেস করুন
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </OrganizationLayout>
    );
};

export default SomitiPaymentForm;
