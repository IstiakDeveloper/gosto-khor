<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OrganizationMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check() || !auth()->user()->organization_id) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Unauthorized. Organization access required.'], 403);
            }

            return redirect()->route('home')->with('error', 'You don\'t have organization access.');
        }

        // Check if organization has active subscription
        $organization = auth()->user()->organization;
        $subscription = $organization->activeSubscription;

        if (!$subscription && !auth()->user()->is_admin) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Your organization\'s subscription has expired.'], 403);
            }

            return redirect()->route('home')->with('error', 'Your organization\'s subscription has expired. Please contact administrator.');
        }

        return $next($request);
    }
}
