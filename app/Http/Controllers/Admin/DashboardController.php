<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\Payment;
use App\Models\Somiti;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{

    /**
     * Show the admin dashboard.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Get counts for dashboard statistics
        $totalOrganizations = Organization::count();
        $activeOrganizations = Organization::whereHas('activeSubscription')->count();

        $totalUsers = User::count();
        $activeUsers = User::where('created_at', '>=', now()->subDays(30))->count();

        $totalSomitis = Somiti::count();
        $totalSubscriptions = Subscription::count();

        $recentOrganizations = Organization::latest()->take(5)->get();
        $recentSubscriptions = Subscription::with('organization', 'plan')
            ->latest()
            ->take(5)
            ->get();

        $monthlyRevenue = Subscription::whereYear('created_at', now()->year)
            ->selectRaw('strftime("%m", created_at) as month, SUM(amount_paid) as revenue')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('revenue', 'month')
            ->toArray();


        // Fill in missing months with zero
        $formattedMonthlyRevenue = [];
        for ($i = 1; $i <= 12; $i++) {
            $formattedMonthlyRevenue[$i] = $monthlyRevenue[$i] ?? 0;
        }

        return Inertia::render('admin/dashboard', [
            'statistics' => [
                'totalOrganizations' => $totalOrganizations,
                'activeOrganizations' => $activeOrganizations,
                'totalUsers' => $totalUsers,
                'activeUsers' => $activeUsers,
                'totalSomitis' => $totalSomitis,
                'totalSubscriptions' => $totalSubscriptions,
            ],
            'recentOrganizations' => $recentOrganizations,
            'recentSubscriptions' => $recentSubscriptions,
            'monthlyRevenue' => $formattedMonthlyRevenue,
        ]);
    }
}
