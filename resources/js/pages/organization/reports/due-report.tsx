import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';

interface Somiti {
  id: number;
  name: string;
}

interface ReportItem {
  member_id: number;
  member_name: string;
  member_phone: string;
  due_amount: number;
  is_active: boolean;
  last_payment_date: string | null;
  months_due: number;
}

interface DueReportProps {
  somitis: Somiti[];
  selected_somiti_id: number | null;
  report_data: ReportItem[];
}

const DueReport: React.FC<DueReportProps> = ({
  somitis,
  selected_somiti_id,
  report_data
}) => {
  const [loading, setLoading] = useState(false);

  const { data, setData, get } = useForm({
    somiti_id: selected_somiti_id || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    get('/organization/reports/due-report', {
      onFinish: () => setLoading(false)
    });
  };

  const handleExport = () => {
    // Open export URL in a new tab
    const exportUrl = `/organization/reports/export?report_type=due_report&somiti_id=${data.somiti_id}`;
    window.open(exportUrl, '_blank');
  };

  // Get total due amount
  const totalDueAmount = report_data.reduce((sum, item) => sum + item.due_amount, 0);

  return (
    <OrganizationLayout title="বকেয়া রিপোর্ট">
      <Head title="বকেয়া রিপোর্ট" />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                সমিতি নির্বাচন করুন
              </label>
              <select
                name="somiti_id"
                value={data.somiti_id}
                onChange={e => setData('somiti_id', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                required
              >
                <option value="">সমিতি নির্বাচন করুন</option>
                {somitis.map(somiti => (
                  <option key={somiti.id} value={somiti.id}>
                    {somiti.name}
                  </option>
                ))}
              </select>
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
        <>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  মোট {report_data.length} জন সদস্যের বকেয়া আছে। সর্বমোট বকেয়া পরিমাণ: <span className="font-bold">৳ {totalDueAmount.toLocaleString('bn-BD')}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      সদস্য
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ফোন
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      বকেয়া পরিমাণ
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      স্ট্যাটাস
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      শেষ পেমেন্ট তারিখ
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      বকেয়া মাস
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      অ্যাকশন
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report_data.map((item) => (
                    <tr key={item.member_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.member_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.member_phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ৳ {item.due_amount.toLocaleString('bn-BD')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {item.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {item.last_payment_date ? new Date(item.last_payment_date).toLocaleDateString('bn-BD') : 'কখনও নয়'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.months_due > 3 ? 'bg-red-100 text-red-800' :
                          item.months_due > 1 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {item.months_due.toLocaleString('bn-BD')} মাস
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/organization/members/${item.member_id}`}
                            className="text-gray-700 hover:text-gray-800"
                            title="বিস্তারিত দেখুন"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>

                          <Link
                            href={`/organization/members/${item.member_id}/make-payment`}
                            className="text-green-600 hover:text-green-800"
                            title="পেমেন্ট করুন"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        selected_somiti_id && (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            নির্বাচিত সমিতিতে কোন বকেয়া পাওয়া যায়নি।
          </div>
        )
      )}
    </OrganizationLayout>
  );
};

export default DueReport;
