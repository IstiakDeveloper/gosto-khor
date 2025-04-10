<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\Payment;
use App\Models\Somiti;
use App\Models\SomitiMember;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{


    /**
     * Show the organization dashboard.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $organization = auth()->user()->organization;

        // Get counts for dashboard statistics
        $totalSomitis = Somiti::where('organization_id', $organization->id)->count();
        $totalMembers = Member::where('organization_id', $organization->id)->count();

        $totalDue = SomitiMember::whereHas('somiti', function ($query) use ($organization) {
            $query->where('organization_id', $organization->id);
        })->sum('due_amount');

        $totalCollected = Payment::whereHas('somiti', function ($query) use ($organization) {
            $query->where('organization_id', $organization->id);
        })->where('status', 'paid')->sum('amount');

        // Recent somitis
        $recentSomitis = Somiti::where('organization_id', $organization->id)
            ->withCount('members')
            ->latest()
            ->take(5)
            ->get();

        // Recent members
        $recentMembers = Member::where('organization_id', $organization->id)
            ->latest()
            ->take(5)
            ->get();

        // Recent payments
        $recentPayments = Payment::whereHas('somiti', function ($query) use ($organization) {
            $query->where('organization_id', $organization->id);
        })
            ->with(['somiti', 'member'])
            ->latest('payment_date')
            ->take(5)
            ->get();

        // Monthly collections chart data
        $monthlyCollections = Payment::whereHas('somiti', function ($query) use ($organization) {
            $query->where('organization_id', $organization->id);
        })
            ->where('status', 'paid')
            ->whereRaw("strftime('%Y', payment_date) = ?", [now()->format('Y')])
            ->selectRaw('strftime("%m", payment_date) as month, SUM(amount) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('total', 'month')
            ->toArray();


        // Fill in missing months with zero
        $formattedMonthlyCollections = [];
        for ($i = 1; $i <= 12; $i++) {
            $formattedMonthlyCollections[$i] = $monthlyCollections[$i] ?? 0;
        }

        // Upcoming collections
        $upcomingCollections = [];
        $somitis = Somiti::where('organization_id', $organization->id)
            ->where('is_active', true)
            ->get();

        foreach ($somitis as $somiti) {
            $nextCollectionDate = $this->getNextCollectionDate($somiti);

            if ($nextCollectionDate) {
                $upcomingCollections[] = [
                    'somiti_id' => $somiti->id,
                    'somiti_name' => $somiti->name,
                    'collection_date' => $nextCollectionDate->format('Y-m-d'),
                    'day' => $nextCollectionDate->format('l'),
                    'type' => $somiti->type,
                    'amount' => $somiti->amount,
                    'members_count' => $somiti->members()->where('somiti_members.is_active', true)->count(),
                    'total_amount' => $somiti->amount * $somiti->members()->where('somiti_members.is_active', true)->count(),
                ];
            }
        }

        // Sort upcoming collections by date
        usort($upcomingCollections, function ($a, $b) {
            return strtotime($a['collection_date']) - strtotime($b['collection_date']);
        });

        // Keep only next 5 upcoming collections
        $upcomingCollections = array_slice($upcomingCollections, 0, 5);

        // Subscription info
        $subscription = $organization->activeSubscription;

        // Calculate dues for all somitis
        $somitisWithDues = [];
        foreach ($somitis as $somiti) {
            $somitisWithDues[$somiti->id] = $this->calculateSomitiDues($somiti->id);
        }

        return Inertia::render('organization/dashboard', [
            'statistics' => [
                'totalSomitis' => $totalSomitis,
                'totalMembers' => $totalMembers,
                'totalDue' => $totalDue,
                'totalCollected' => $totalCollected,
            ],
            'recentSomitis' => $recentSomitis,
            'recentMembers' => $recentMembers,
            'recentPayments' => $recentPayments,
            'monthlyCollections' => $formattedMonthlyCollections,
            'upcomingCollections' => $upcomingCollections,
            'somitisWithDues' => $somitisWithDues,
            'subscription' => $subscription ? [
                'plan_name' => $subscription->plan->name,
                'end_date' => $subscription->end_date->format('Y-m-d'),
                'remaining_days' => $subscription->remaining_days,
                'is_expiring_soon' => $subscription->remaining_days <= 7,
            ] : null,
        ]);
    }

    /**
     * Calculate due amounts for all members of a somiti
     *
     * @param int $somitiId
     * @return array
     */
    private function calculateSomitiDues($somitiId)
    {
        // Get somiti details with its members
        $somiti = Somiti::with('members')->findOrFail($somitiId);

        // If somiti doesn't have a start date, return empty result
        if (!$somiti->start_date) {
            return [
                'somiti' => $somiti,
                'total_due' => 0,
                'members_due' => []
            ];
        }

        // Get current date
        $currentDate = now()->startOfDay();
        $startDate = Carbon::parse($somiti->start_date)->startOfDay();

        // If start date is in the future, no dues yet
        if ($startDate->gt($currentDate)) {
            return [
                'somiti' => $somiti,
                'total_due' => 0,
                'members_due' => []
            ];
        }

        // Calculate number of payment periods based on type
        $numberOfPeriods = 0;

        switch ($somiti->type) {
            case 'daily':
                $numberOfPeriods = $startDate->diffInDays($currentDate);
                break;

            case 'weekly':
                // Calculate number of weeks with the specific collection day
                $collectionDay = $somiti->collection_day; // 0 (Sunday) to 6 (Saturday)

                $tempDate = clone $startDate;
                // Move to the first collection day if start date is not on a collection day
                if ($tempDate->dayOfWeek != $collectionDay) {
                    $daysToAdd = ($collectionDay - $tempDate->dayOfWeek + 7) % 7;
                    $tempDate->addDays($daysToAdd);
                }

                // Count collection days
                $numberOfPeriods = 0;
                while ($tempDate->lte($currentDate)) {
                    $numberOfPeriods++;
                    $tempDate->addWeek();
                }
                break;

            case 'monthly':
                $collectionDay = $somiti->collection_day;

                $tempDate = clone $startDate;
                // Move to the first collection day if start date is not on collection day
                if ($tempDate->day != $collectionDay) {
                    // If collection day has already passed in the start month, move to next month
                    if ($tempDate->day > $collectionDay) {
                        $tempDate->addMonth();
                    }
                    $tempDate->day = min($collectionDay, $tempDate->daysInMonth);
                }

                // Count collection days
                $numberOfPeriods = 0;
                while ($tempDate->lte($currentDate)) {
                    $numberOfPeriods++;
                    $tempDate->addMonth();
                    // Handle months with fewer days
                    $tempDate->day = min($collectionDay, $tempDate->daysInMonth);
                }
                break;
        }

        // Calculate expected amount per member
        $expectedAmount = $somiti->amount * $numberOfPeriods;

        // Calculate dues for each member
        $membersDue = [];
        $totalDue = 0;

        // Get the somiti members through the pivot table
        $somitiMembers = SomitiMember::where('somiti_id', $somiti->id)
            ->with('member')
            ->get();

        foreach ($somitiMembers as $somitiMember) {
            // Get total payments made by the member
            $totalPaid = Payment::where('somiti_id', $somiti->id)
                ->where('member_id', $somitiMember->member_id)
                ->where('status', 'paid')
                ->sum('amount');

            // Calculate due amount
            $dueAmount = $expectedAmount - $totalPaid;

            // Update member's due in the database
            $somitiMember->due_amount = $dueAmount;
            $somitiMember->save();

            // Add to the array for returning
            $membersDue[] = [
                'member' => $somitiMember->member,
                'expected_amount' => $expectedAmount,
                'paid_amount' => $totalPaid,
                'due_amount' => $dueAmount
            ];

            $totalDue += $dueAmount;
        }

        return [
            'somiti' => $somiti,
            'total_periods' => $numberOfPeriods,
            'expected_amount' => $expectedAmount,
            'total_due' => $totalDue,
            'members_due' => $membersDue
        ];
    }

    /**
     * Get the next collection date for a somiti.
     *
     * @param  \App\Models\Somiti  $somiti
     * @return \Carbon\Carbon|null
     */
    private function getNextCollectionDate($somiti)
    {
        $today = now();

        if ($somiti->type === 'daily') {
            return $today->addDay();
        } elseif ($somiti->type === 'weekly' && $somiti->collection_day !== null) {
            $nextDate = $today->copy();
            $daysUntilNextCollection = ($somiti->collection_day - $today->dayOfWeek + 7) % 7;
            if ($daysUntilNextCollection === 0) {
                $daysUntilNextCollection = 7; // If today is the collection day, get next week
            }
            return $nextDate->addDays($daysUntilNextCollection);
        } elseif ($somiti->type === 'monthly' && $somiti->collection_day !== null) {
            $nextDate = $today->copy();
            if ($today->day > $somiti->collection_day) {
                $nextDate = $nextDate->addMonth();
            }

            // Handle months with fewer days
            $daysInMonth = $nextDate->daysInMonth;
            $collectionDay = min($somiti->collection_day, $daysInMonth);

            return $nextDate->day($collectionDay);
        }

        return null;
    }


}
