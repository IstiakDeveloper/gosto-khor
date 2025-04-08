import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';

interface Member {
  id: number;
  name: string;
}

interface ReportItem {
  somiti_id: number;
  somiti_name: string;
  total_amount: number;
  pending_amount: number;
  payments_count: number;
}

interface MemberPaymentsProps {
  members: Member[];
  selected_member_id: number | null;
  start_date: string;
  end_date: string;
  report_data: ReportItem[];
}

const MemberPayments: React.FC<MemberPaymentsProps> = ({
  members,
  selected_member_id,
  start_date,
  end_date,
  report_data
}) => {
  const [loading, setLoading] = useState(false);

  const { data, setData, get } = useForm({
    member_id: selected_member_id || '',
    start_date,
    end_date
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    get('/organization/reports/member-payments', {
      onFinish: () => setLoading(false)
    });
  };

  const handleExport = () => {
    // Open export URL in a new tab
    const exportUrl = `/organization/reports/export?report_type=member_payments&member_id=${data.member_id}&start_date=${data.start_date}&end_date=${data.end_date}`;
    window.open(exportUrl, '_blank');
  };

  return (
    <OrganizationLayout title="সদস্য পেমেন্ট রিপোর্ট">
      <Head title="সদস্য পেমেন্ট রিপোর্ট" />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                সদস্য নির্বাচন করুন
              </label>
              <select
                name="member_id"
                value={data.member_id}
                onChange={e => setData('member_id', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                required
              >
                <option value="">সদস্য নির্বাচন করুন</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                শুরুর তারিখ
              </label>
              <input
                type="date"
                name="start_date"
                value={data.start_date}
                onChange={e => setData('start_date', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                শেষ তারিখ
              </label>
              <input
                type="date"
                name="end_date"
                value={data.end_date}
                onChange={e => setData('end_date', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                required
              />
            </div>

            <div className="flex items-end space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'লোড হচ্ছে...' : 'রিপোর্ট দেখুন'}
              </button>

              {report_data.length > 0 && (
                <button
                  type="button"
                  onClick={handleExport}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  CSV ডাউনলোড
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {report_data.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    সমিতি
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    মোট পরিমাণ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    বকেয়া পরিমাণ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    পেমেন্ট সংখ্যা
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {report_data.map((item) => (
                  <tr key={item.somiti_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.somiti_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ৳ {item.total_amount.toLocaleString('bn-BD')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ৳ {item.pending_amount.toLocaleString('bn-BD')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {item.payments_count.toLocaleString('bn-BD')} টি
                    </td>
                  </tr>
                ))}

                {/* Summary row */}
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    সর্বমোট
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    ৳ {report_data.reduce((sum, item) => sum + item.total_amount, 0).toLocaleString('bn-BD')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    ৳ {report_data.reduce((sum, item) => sum + item.pending_amount, 0).toLocaleString('bn-BD')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {report_data.reduce((sum, item) => sum + item.payments_count, 0).toLocaleString('bn-BD')} টি
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        selected_member_id && (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            নির্বাচিত সময়কালে কোন ডাটা পাওয়া যায়নি।
          </div>
        )
      )}
    </OrganizationLayout>
  );
};

export default MemberPayments;
