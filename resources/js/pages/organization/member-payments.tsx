import React from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  CreditCard,
  StickyNote,
  Clock,
  Building
} from 'lucide-react';

interface Organization {
  id: number;
  name: string;
  domain: string;
}

interface Member {
  id: number;
  name: string;
  phone: string;
  email: string | null;
}

interface Somiti {
  id: number;
  name: string;
}

interface Payment {
  id: number;
  somiti_id: number;
  member_id: number;
  amount: number;
  payment_date: string;
  collection_date: string;
  status: 'pending' | 'paid' | 'failed';
  payment_method: string | null;
  transaction_id: string | null;
  notes: string | null;
  somiti: Somiti;
  created_at: string;
}

interface Props {
  organization: Organization;
  member: Member;
  payments: Payment[];
}

export default function MemberPayments({ organization, member, payments }: Props) {
  const totalPaid = payments.reduce((sum, payment) => {
    const amount = payment.amount !== undefined && payment.amount !== null
      ? parseFloat(payment.amount.toString())
      : 0;
    return sum + amount;
  }, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: <DollarSign className="h-4 w-4 mr-1 text-green-600" />
        };
      case 'pending':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: <Clock className="h-4 w-4 mr-1 text-yellow-600" />
        };
      case 'failed':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: <CreditCard className="h-4 w-4 mr-1 text-red-600" />
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: null
        };
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header with Back Link */}
        <Link
          href={`/${organization.domain}`}
          className="inline-flex items-center text-red-600 hover:text-red-800 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to {organization.name}
        </Link>

        {/* Member Info and Total Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <User className="h-5 w-5 mr-2 text-red-600" />
                Payment History for {member.name}
              </h1>

              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2 text-red-500" />
                <span>{member.phone}</span>
              </div>

              {member.email && (
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2 text-red-500" />
                  <span>{member.email}</span>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg border-l-4 border-red-500 flex items-center self-start">
              <DollarSign className="h-10 w-10 text-green-600 mr-4" />
              <div>
                <p className="text-gray-700 font-medium">Total Paid</p>
                <p className="text-3xl font-bold text-green-600">৳{totalPaid.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Filter Options */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold flex items-center text-gray-800">
            <CreditCard className="mr-2 h-5 w-5 text-red-600" />
            Payment Transactions
          </h2>

          <div className="flex flex-wrap gap-2">
            <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
              <option>All Status</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>

            <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
              <option>All Somitis</option>
              {/* Would be populated dynamically with unique somitis */}
              {Array.from(new Set(payments.map(p => p.somiti?.name))).map(somitiName => (
                somitiName && <option key={somitiName}>{somitiName}</option>
              ))}
            </select>

            <input
              type="date"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              placeholder="From date"
            />
          </div>
        </div>

        {/* Payments Table with Modern Style */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                    Somiti
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                    Payment Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                    Collection Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                    Payment Method
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.length > 0 ? (
                  payments.map((payment) => {
                    const statusStyle = getStatusColor(payment.status);

                    return (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{payment.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-red-500" />
                            {payment.somiti?.name || 'Unknown'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          ৳{payment.amount !== undefined && payment.amount !== null
                              ? parseFloat(payment.amount.toString()).toFixed(2)
                              : '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-red-500" />
                            {formatDate(payment.payment_date)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-red-500" />
                            {formatDate(payment.collection_date)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full
                            ${statusStyle.bg} ${statusStyle.text}`}>
                            {statusStyle.icon}
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex flex-col">
                            <span className="font-medium">{payment.payment_method || '-'}</span>
                            {payment.transaction_id && (
                              <span className="text-xs text-gray-500">ID: {payment.transaction_id}</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                      <div className="flex flex-col items-center">
                        <CreditCard className="h-10 w-10 text-gray-300 mb-2" />
                        <p>No payment records found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Notes Section - Redesigned as Cards */}
        {payments.length > 0 && payments.some(p => p.notes) && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
              <StickyNote className="mr-2 h-5 w-5 text-red-600" />
              Payment Notes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {payments.filter(p => p.notes).map(payment => (
                <div
                  key={`note-${payment.id}`}
                  className="bg-white rounded-lg shadow-md p-5 border-l-4 border-red-400"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                      <span className="font-semibold text-gray-800">Payment #{payment.id}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(payment.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{payment.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
