<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\Payment;
use App\Models\Somiti;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{

    /**
     * Display the reports index.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('organization/reports/index');
    }

    /**
     * Generate somiti collection report.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function somitiCollection(Request $request)
    {
        $organization = auth()->user()->organization;

        $somitis = Somiti::where('organization_id', $organization->id)
            ->orderBy('name')
            ->get();

        $selectedSomitiId = $request->input('somiti_id') ?: ($somitis->isNotEmpty() ? $somitis->first()->id : null);
        $startDate = $request->input('start_date') ?: now()->subMonths(3)->format('Y-m-d');
        $endDate = $request->input('end_date') ?: now()->format('Y-m-d');

        $report = [];

        if ($selectedSomitiId) {
            $somiti = Somiti::findOrFail($selectedSomitiId);

            // Get payments grouped by date
            $payments = Payment::where('somiti_id', $selectedSomitiId)
                ->whereBetween('payment_date', [$startDate, $endDate])
                ->orderBy('payment_date')
                ->get()
                ->groupBy(function ($payment) {
                    return $payment->payment_date->format('Y-m-d');
                });

            // Prepare data
            foreach ($payments as $date => $datePayments) {
                $report[] = [
                    'date' => $date,
                    'total_amount' => $datePayments->where('status', 'paid')->sum('amount'),
                    'pending_amount' => $datePayments->where('status', 'pending')->sum('amount'),
                    'payments_count' => $datePayments->count(),
                ];
            }
        }

        return Inertia::render('organization/reports/somiti-collection', [
            'somitis' => $somitis,
            'selected_somiti_id' => $selectedSomitiId,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'report_data' => $report,
        ]);
    }

    /**
     * Generate member payments report.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function memberPayments(Request $request)
    {
        $organization = auth()->user()->organization;

        $members = Member::where('organization_id', $organization->id)
            ->orderBy('name')
            ->get();

        $selectedMemberId = $request->input('member_id') ?: ($members->isNotEmpty() ? $members->first()->id : null);
        $startDate = $request->input('start_date') ?: now()->subMonths(3)->format('Y-m-d');
        $endDate = $request->input('end_date') ?: now()->format('Y-m-d');

        $report = [];

        if ($selectedMemberId) {
            $member = Member::findOrFail($selectedMemberId);

            // Get payments grouped by somiti
            $payments = Payment::where('member_id', $selectedMemberId)
                ->whereBetween('payment_date', [$startDate, $endDate])
                ->with('somiti')
                ->orderBy('payment_date')
                ->get()
                ->groupBy('somiti_id');

            // Prepare data
            foreach ($payments as $somitiId => $somitiPayments) {
                $somiti = $somitiPayments->first()->somiti;

                $report[] = [
                    'somiti_id' => $somitiId,
                    'somiti_name' => $somiti->name,
                    'total_amount' => $somitiPayments->where('status', 'paid')->sum('amount'),
                    'pending_amount' => $somitiPayments->where('status', 'pending')->sum('amount'),
                    'payments_count' => $somitiPayments->count(),
                ];
            }
        }

        return Inertia::render('organization/reports/member-payments', [
            'members' => $members,
            'selected_member_id' => $selectedMemberId,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'report_data' => $report,
        ]);
    }

    /**
     * Generate due report.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function dueReport(Request $request)
    {
        $organization = auth()->user()->organization;

        $somitis = Somiti::where('organization_id', $organization->id)
            ->orderBy('name')
            ->get();

        $selectedSomitiId = $request->input('somiti_id') ?: ($somitis->isNotEmpty() ? $somitis->first()->id : null);

        $report = [];

        if ($selectedSomitiId) {
            $somiti = Somiti::findOrFail($selectedSomitiId);

            // Get members with dues
            $members = $somiti->members()
                ->wherePivot('due_amount', '>', 0)
                ->withPivot('due_amount', 'is_active')
                ->orderByDesc('somiti_members.due_amount')
                ->get();

            // Prepare data
            foreach ($members as $member) {
                // Get last payment
                $lastPayment = Payment::where('somiti_id', $somiti->id)
                    ->where('member_id', $member->id)
                    ->where('status', 'paid')
                    ->orderByDesc('payment_date')
                    ->first();

                $report[] = [
                    'member_id' => $member->id,
                    'member_name' => $member->name,
                    'member_phone' => $member->phone,
                    'due_amount' => $member->pivot->due_amount,
                    'is_active' => $member->pivot->is_active,
                    'last_payment_date' => $lastPayment ? $lastPayment->payment_date->format('Y-m-d') : null,
                    'months_due' => $this->calculateMonthsDue($somiti, $lastPayment),
                ];
            }
        }

        return Inertia::render('organization/reports/due-report', [
            'somitis' => $somitis,
            'selected_somiti_id' => $selectedSomitiId,
            'report_data' => $report,
        ]);
    }

    /**
     * Generate monthly summary report.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function monthlySummary(Request $request)
    {
        $organization = auth()->user()->organization;

        $year = $request->input('year') ?: now()->year;

        $report = [];

        // Get somitis for the organization
        $somitis = Somiti::where('organization_id', $organization->id)->get();

        // Get all payments for the selected year
        $payments = Payment::whereIn('somiti_id', $somitis->pluck('id'))
            ->whereYear('payment_date', $year)
            ->where('status', 'paid')
            ->get();

        // Group by month
        for ($month = 1; $month <= 12; $month++) {
            $monthPayments = $payments->filter(function ($payment) use ($month) {
                return $payment->payment_date->month === $month;
            });

            $somitisData = [];

            // Group by somiti
            foreach ($somitis as $somiti) {
                $somitiPayments = $monthPayments->filter(function ($payment) use ($somiti) {
                    return $payment->somiti_id === $somiti->id;
                });

                $somitisData[] = [
                    'somiti_id' => $somiti->id,
                    'somiti_name' => $somiti->name,
                    'amount' => $somitiPayments->sum('amount'),
                    'count' => $somitiPayments->count(),
                ];
            }

            $report[] = [
                'month' => $month,
                'month_name' => date('F', mktime(0, 0, 0, $month, 1)),
                'total_amount' => $monthPayments->sum('amount'),
                'total_count' => $monthPayments->count(),
                'somitis' => $somitisData,
            ];
        }

        // Get years for the dropdown (last 5 years)
        $years = range(now()->year, now()->year - 4);

        return Inertia::render('organization/reports/monthly-summary', [
            'years' => $years,
            'selected_year' => $year,
            'report_data' => $report,
        ]);
    }

    /**
     * Export report to CSV.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function export(Request $request)
    {
        $organization = auth()->user()->organization;
        $reportType = $request->input('report_type');

        // Implement export logic based on report type
        $fileName = 'report_' . $reportType . '_' . now()->format('Y-m-d') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ];

        $callback = function () use ($request, $reportType, $organization) {
            $file = fopen('php://output', 'w');

            if ($reportType === 'somiti_collection') {
                $this->exportSomitiCollectionReport($file, $request, $organization);
            } elseif ($reportType === 'member_payments') {
                $this->exportMemberPaymentsReport($file, $request, $organization);
            } elseif ($reportType === 'due_report') {
                $this->exportDueReport($file, $request, $organization);
            } elseif ($reportType === 'monthly_summary') {
                $this->exportMonthlySummaryReport($file, $request, $organization);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Export somiti collection report to CSV.
     *
     * @param  resource  $file
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Organization  $organization
     * @return void
     */
    private function exportSomitiCollectionReport($file, $request, $organization)
    {
        $somitiId = $request->input('somiti_id');
        $startDate = $request->input('start_date') ?: now()->subMonths(3)->format('Y-m-d');
        $endDate = $request->input('end_date') ?: now()->format('Y-m-d');

        $somiti = Somiti::findOrFail($somitiId);

        // Add headers
        fputcsv($file, [
            'Date',
            'Total Amount',
            'Pending Amount',
            'Payments Count',
        ]);

        // Get payments grouped by date
        $payments = Payment::where('somiti_id', $somitiId)
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->orderBy('payment_date')
            ->get()
            ->groupBy(function ($payment) {
                return $payment->payment_date->format('Y-m-d');
            });

        // Add data
        foreach ($payments as $date => $datePayments) {
            fputcsv($file, [
                $date,
                $datePayments->where('status', 'paid')->sum('amount'),
                $datePayments->where('status', 'pending')->sum('amount'),
                $datePayments->count(),
            ]);
        }
    }

    /**
     * Export member payments report to CSV.
     *
     * @param  resource  $file
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Organization  $organization
     * @return void
     */
    private function exportMemberPaymentsReport($file, $request, $organization)
    {
        $memberId = $request->input('member_id');
        $startDate = $request->input('start_date') ?: now()->subMonths(3)->format('Y-m-d');
        $endDate = $request->input('end_date') ?: now()->format('Y-m-d');

        $member = Member::findOrFail($memberId);

        // Add headers
        fputcsv($file, [
            'Somiti',
            'Total Amount',
            'Pending Amount',
            'Payments Count',
        ]);

        // Get payments grouped by somiti
        $payments = Payment::where('member_id', $memberId)
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->with('somiti')
            ->get()
            ->groupBy('somiti_id');

        // Add data
        foreach ($payments as $somitiId => $somitiPayments) {
            $somiti = $somitiPayments->first()->somiti;

            fputcsv($file, [
                $somiti->name,
                $somitiPayments->where('status', 'paid')->sum('amount'),
                $somitiPayments->where('status', 'pending')->sum('amount'),
                $somitiPayments->count(),
            ]);
        }
    }

    /**
     * Export due report to CSV.
     *
     * @param  resource  $file
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Organization  $organization
     * @return void
     */
    private function exportDueReport($file, $request, $organization)
    {
        $somitiId = $request->input('somiti_id');
        $somiti = Somiti::findOrFail($somitiId);

        // Add headers
        fputcsv($file, [
            'Member Name',
            'Phone',
            'Due Amount',
            'Status',
            'Last Payment Date',
            'Months Due',
        ]);

        // Get members with dues
        $members = $somiti->members()
            ->wherePivot('due_amount', '>', 0)
            ->withPivot('due_amount', 'is_active')
            ->orderByDesc('somiti_members.due_amount')
            ->get();

        // Add data
        foreach ($members as $member) {
            // Get last payment
            $lastPayment = Payment::where('somiti_id', $somiti->id)
                ->where('member_id', $member->id)
                ->where('status', 'paid')
                ->orderByDesc('payment_date')
                ->first();

            fputcsv($file, [
                $member->name,
                $member->phone,
                $member->pivot->due_amount,
                $member->pivot->is_active ? 'Active' : 'Inactive',
                $lastPayment ? $lastPayment->payment_date->format('Y-m-d') : 'Never',
                $this->calculateMonthsDue($somiti, $lastPayment),
            ]);
        }
    }

    /**
     * Export monthly summary report to CSV.
     *
     * @param  resource  $file
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Organization  $organization
     * @return void
     */
    private function exportMonthlySummaryReport($file, $request, $organization)
    {
        $year = $request->input('year') ?: now()->year;

        // Get somitis for the organization
        $somitis = Somiti::where('organization_id', $organization->id)->get();

        // Add headers
        $headers = ['Month', 'Total Amount', 'Total Count'];
        foreach ($somitis as $somiti) {
            $headers[] = $somiti->name . ' (Amount)';
            $headers[] = $somiti->name . ' (Count)';
        }
        fputcsv($file, $headers);

        // Get all payments for the selected year
        $payments = Payment::whereIn('somiti_id', $somitis->pluck('id'))
            ->whereYear('payment_date', $year)
            ->where('status', 'paid')
            ->get();

        // Group by month
        for ($month = 1; $month <= 12; $month++) {
            $monthPayments = $payments->filter(function ($payment) use ($month) {
                return $payment->payment_date->month === $month;
            });

            $row = [
                date('F', mktime(0, 0, 0, $month, 1)),
                $monthPayments->sum('amount'),
                $monthPayments->count(),
            ];

            // Add data for each somiti
            foreach ($somitis as $somiti) {
                $somitiPayments = $monthPayments->filter(function ($payment) use ($somiti) {
                    return $payment->somiti_id === $somiti->id;
                });

                $row[] = $somitiPayments->sum('amount');
                $row[] = $somitiPayments->count();
            }

            fputcsv($file, $row);
        }
    }

    /**
     * Calculate months due based on somiti type and last payment.
     *
     * @param  \App\Models\Somiti  $somiti
     * @param  \App\Models\Payment|null  $lastPayment
     * @return int
     */
    private function calculateMonthsDue($somiti, $lastPayment)
    {
        if (!$lastPayment) {
            return 0; // No payments yet, can't calculate
        }

        $lastPaymentDate = $lastPayment->payment_date;
        $today = now();
        $monthsDifference = $today->diffInMonths($lastPaymentDate);

        if ($somiti->type === 'daily') {
            // Roughly calculate based on 30 days per month
            return ceil($today->diffInDays($lastPaymentDate) / 30);
        } elseif ($somiti->type === 'weekly') {
            // Roughly calculate based on 4 weeks per month
            return ceil($today->diffInWeeks($lastPaymentDate) / 4);
        } else {
            return $monthsDifference;
        }
    }
}
