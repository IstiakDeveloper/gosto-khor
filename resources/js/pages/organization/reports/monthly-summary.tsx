import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import OrganizationLayout from '@/layouts/organization-layout';

interface SomitiData {
  somiti_id: number;
  somiti_name: string;
  amount: number;
  count: number;
}

interface ReportItem {
  month: number;
  month_name: string;
  total_amount: number;
  total_count: number;
  somitis: SomitiData[];
}

interface MonthlySummaryProps {
  years: number[];
  selected_year: number;
  report_data: ReportItem[];
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({
  years,
  selected_year,
  report_data
}) => {
  const [loading, setLoading] = useState(false);

  const { data, setData, get } = useForm({
    year: selected_year || new Date().getFullYear(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    get('/organization/reports/monthly-summary', {
      onFinish: () => setLoading(false)
    });
  };

  const handleExport = () => {
    // Open export URL in a new tab
    const exportUrl = `/organization/reports/export?report_type=monthly_summary&year=${data.year}`;
    window.open(exportUrl, '_blank');
  };

  // Calculate yearly total
  const yearlyTotal = report_data.reduce((sum, item) => sum + item.total_amount, 0);
  const yearlyCount = report_data.reduce((sum, item) => sum + item.total_count, 0);

  // Get all somiti names (unique)
  const somitiNames: Record<number, string> = {};
  report_data.forEach(month => {
    month.somitis.forEach(somiti => {
      somitiNames[somiti.somiti_id] = somiti.somiti_name;
    });
  });

  const somitiIds = Object.keys(somitiNames).map(Number);

  // Calculate totals per somiti
  const somitiTotals: Record<number, { amount: number; count: number }> = {};
  somitiIds.forEach(id => {
    let amount = 0;
    let count = 0;

    report_data.forEach(month => {
      const somitiData = month.somitis.find(s => s.somiti_id === id);
      if (somitiData) {
        amount += somitiData.amount;
        count += somitiData.count;
      }
    });

    somitiTotals[id] = { amount, count };
  });

  return (
    <OrganizationLayout title="মাসিক সারসংক্ষেপ">
      <Head title="মাসিক সারসংক্ষেপ" />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                বছর নির্বাচন করুন
              </label>
              <select
                name="year"
                value={data.year}
                onChange={e => setData('year', Number(e.target.value))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                required
              >
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
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

      {report_data.length > 0 && (
        <>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  {data.year} সালের মোট কালেকশন পরিমাণ: <span className="font-bold">৳ {yearlyTotal.toLocaleString('bn-BD')}</span>,
                  মোট পেমেন্ট সংখ্যা: <span className="font-bold">{yearlyCount.toLocaleString('bn-BD')}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      মাস
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      মোট পরিমাণ
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      পেমেন্ট সংখ্যা
                    </th>
                    {somitiIds.map(id => (
                      <th key={id} className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {somitiNames[id]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report_data.map((item) => (
                    <tr key={item.month} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.month_name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ৳ {item.total_amount.toLocaleString('bn-BD')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {item.total_count.toLocaleString('bn-BD')}
                      </td>
                      {somitiIds.map(id => {
                        const somitiData = item.somitis.find(s => s.somiti_id === id);
                        return (
                          <td key={id} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            {somitiData ? `৳ ${somitiData.amount.toLocaleString('bn-BD')} (${somitiData.count})` : '-'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Summary row */}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      সর্বমোট
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ৳ {yearlyTotal.toLocaleString('bn-BD')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {yearlyCount.toLocaleString('bn-BD')}
                    </td>
                    {somitiIds.map(id => (
                      <td key={id} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ৳ {somitiTotals[id].amount.toLocaleString('bn-BD')} ({somitiTotals[id].count})
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </OrganizationLayout>
  );
};

export default MonthlySummary;
