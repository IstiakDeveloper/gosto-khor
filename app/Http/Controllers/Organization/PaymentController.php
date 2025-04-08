<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Somiti;
use App\Models\SomitiMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PaymentController extends Controller
{

    /**
     * Display a listing of the payments.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $organization = auth()->user()->organization;

        $query = Payment::query()
            ->with(['somiti', 'member'])
            ->whereHas('somiti', function ($query) use ($organization) {
                $query->where('organization_id', $organization->id);
            });

        // Search
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->whereHas('member', function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('phone', 'like', "%{$searchTerm}%");
            });
        }

        // Filter by somiti
        if ($request->has('somiti_id') && $request->input('somiti_id')) {
            $query->where('somiti_id', $request->input('somiti_id'));
        }

        // Filter by date range
        if ($request->has('date_from') && $request->input('date_from')) {
            $query->where('payment_date', '>=', $request->input('date_from'));
        }

        if ($request->has('date_to') && $request->input('date_to')) {
            $query->where('payment_date', '<=', $request->input('date_to'));
        }

        // Filter by status
        if ($request->has('status') && $request->input('status')) {
            $query->where('status', $request->input('status'));
        }

        // Sort
        $sortField = $request->input('sort_field', 'payment_date');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $payments = $query->paginate(10)->withQueryString();

        // Get somitis for filter dropdown
        $somitis = Somiti::where('organization_id', $organization->id)->get();

        return Inertia::render('organization/payments/index', [
            'payments' => $payments,
            'somitis' => $somitis,
            'filters' => $request->only(['search', 'somiti_id', 'date_from', 'date_to', 'status', 'sort_field', 'sort_direction']),
        ]);
    }

    /**
     * Display the specified payment.
     *
     * @param  \App\Models\Payment  $payment
     * @return \Inertia\Response
     */
    public function show(Payment $payment)
    {
        $organization = auth()->user()->organization;

        // Check if payment belongs to organization
        $somiti = Somiti::findOrFail($payment->somiti_id);
        if ($somiti->organization_id !== $organization->id) {
            abort(403, 'Unauthorized action.');
        }

        $payment->load(['somiti', 'member', 'createdBy']);

        return Inertia::render('organization/payments/show', [
            'payment' => $payment,
        ]);
    }

    /**
     * Show the form for editing the specified payment.
     *
     * @param  \App\Models\Payment  $payment
     * @return \Inertia\Response
     */
    public function edit(Payment $payment)
    {
        $organization = auth()->user()->organization;

        // Check if payment belongs to organization
        $somiti = Somiti::findOrFail($payment->somiti_id);
        if ($somiti->organization_id !== $organization->id) {
            abort(403, 'Unauthorized action.');
        }

        $payment->load(['somiti', 'member']);

        return Inertia::render('organization/payments/edit', [
            'payment' => $payment,
        ]);
    }

    /**
     * Update the specified payment in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Payment $payment)
    {
        $organization = auth()->user()->organization;

        // Check if payment belongs to organization
        $somiti = Somiti::findOrFail($payment->somiti_id);
        if ($somiti->organization_id !== $organization->id) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'status' => 'required|in:paid,pending,failed',
            'payment_method' => 'nullable|string|max:255',
            'transaction_id' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($payment, $validated) {
            $oldStatus = $payment->status;
            $oldAmount = $payment->amount;

            // Update payment record
            $payment->update($validated);

            // Update due amount based on status change
            $somitiMember = SomitiMember::where('somiti_id', $payment->somiti_id)
                ->where('member_id', $payment->member_id)
                ->first();

            if ($somitiMember) {
                $dueAmount = $somitiMember->due_amount;

                // If payment was pending and now paid, reduce due amount
                if ($oldStatus === 'pending' && $validated['status'] === 'paid') {
                    $dueAmount -= $oldAmount;
                }

                // If payment was paid and now pending, increase due amount
                if ($oldStatus === 'paid' && $validated['status'] === 'pending') {
                    $dueAmount += $validated['amount'];
                }

                // If payment was pending and now failed, reduce due amount (since pending already increased it)
                if ($oldStatus === 'pending' && $validated['status'] === 'failed') {
                    $dueAmount -= $oldAmount;
                }

                // If amount changed, adjust due amount accordingly
                if ($oldAmount !== $validated['amount'] && $validated['status'] === 'pending') {
                    $dueAmount = $dueAmount - $oldAmount + $validated['amount'];
                }

                // Ensure due amount is not negative
                $dueAmount = max(0, $dueAmount);

                $somitiMember->update(['due_amount' => $dueAmount]);
            }

            return redirect()->route('organization.payments.index')
                ->with('success', 'Payment updated successfully.');
        });
    }

    /**
     * Remove the specified payment from storage.
     *
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Payment $payment)
    {
        $organization = auth()->user()->organization;

        // Check if payment belongs to organization
        $somiti = Somiti::findOrFail($payment->somiti_id);
        if ($somiti->organization_id !== $organization->id) {
            abort(403, 'Unauthorized action.');
        }

        return DB::transaction(function () use ($payment) {
            // If payment was pending, update due amount
            if ($payment->status === 'pending') {
                $somitiMember = SomitiMember::where('somiti_id', $payment->somiti_id)
                    ->where('member_id', $payment->member_id)
                    ->first();

                if ($somitiMember) {
                    $dueAmount = max(0, $somitiMember->due_amount - $payment->amount);
                    $somitiMember->update(['due_amount' => $dueAmount]);
                }
            }

            $payment->delete();

            return redirect()->route('organization.payments.index')
                ->with('success', 'Payment deleted successfully.');
        });
    }

    /**
     * Change payment status to paid.
     *
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\RedirectResponse
     */
    public function markAsPaid(Payment $payment)
    {
        $organization = auth()->user()->organization;

        // Check if payment belongs to organization
        $somiti = Somiti::findOrFail($payment->somiti_id);
        if ($somiti->organization_id !== $organization->id) {
            abort(403, 'Unauthorized action.');
        }

        // Only allow changing pending payments to paid
        if ($payment->status !== 'pending') {
            return back()->with('error', 'Only pending payments can be marked as paid.');
        }

        return DB::transaction(function () use ($payment) {
            // Update payment status
            $payment->update([
                'status' => 'paid',
                'payment_date' => now()->format('Y-m-d'),
            ]);

            // Update due amount
            $somitiMember = SomitiMember::where('somiti_id', $payment->somiti_id)
                ->where('member_id', $payment->member_id)
                ->first();

            if ($somitiMember) {
                $dueAmount = max(0, $somitiMember->due_amount - $payment->amount);
                $somitiMember->update(['due_amount' => $dueAmount]);
            }

            return back()->with('success', 'Payment marked as paid.');
        });
    }

    /**
     * Export payments to CSV.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function export(Request $request)
    {
        $organization = auth()->user()->organization;

        $query = Payment::query()
            ->with(['somiti', 'member'])
            ->whereHas('somiti', function ($query) use ($organization) {
                $query->where('organization_id', $organization->id);
            });

        // Filter by somiti
        if ($request->has('somiti_id') && $request->input('somiti_id')) {
            $query->where('somiti_id', $request->input('somiti_id'));
        }

        // Filter by date range
        if ($request->has('date_from') && $request->input('date_from')) {
            $query->where('payment_date', '>=', $request->input('date_from'));
        }

        if ($request->has('date_to') && $request->input('date_to')) {
            $query->where('payment_date', '<=', $request->input('date_to'));
        }

        // Filter by status
        if ($request->has('status') && $request->input('status')) {
            $query->where('status', $request->input('status'));
        }

        $payments = $query->orderBy('payment_date', 'desc')->get();

        $fileName = 'payments_' . now()->format('Y-m-d') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ];

        $callback = function () use ($payments) {
            $file = fopen('php://output', 'w');

            // Add headers
            fputcsv($file, [
                'Payment ID',
                'Somiti',
                'Member',
                'Phone',
                'Amount',
                'Payment Date',
                'Collection Date',
                'Status',
                'Payment Method',
                'Transaction ID',
                'Notes',
            ]);

            // Add data
            foreach ($payments as $payment) {
                fputcsv($file, [
                    $payment->id,
                    $payment->somiti->name,
                    $payment->member->name,
                    $payment->member->phone,
                    $payment->amount,
                    $payment->payment_date,
                    $payment->collection_date,
                    $payment->status,
                    $payment->payment_method ?? '',
                    $payment->transaction_id ?? '',
                    $payment->notes ?? '',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
