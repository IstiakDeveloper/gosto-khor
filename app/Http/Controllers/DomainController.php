<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DomainController extends Controller
{
    /**
     * Determine the organization based on domain and redirect accordingly.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Inertia\Response
     */
    public function resolve(Request $request)
    {
        $host = $request->getHost();

        // If it's the main application domain
        if ($host === config('app.domain')) {
            return $this->handleMainDomain();
        }

        // Find organization by domain
        $organization = Organization::where('domain', $host)->first();

        if (!$organization) {
            return $this->handleInvalidDomain();
        }

        // Store organization in session
        session(['organization_id' => $organization->id]);

        // Check if user is authenticated
        if (auth()->check()) {
            return redirect()->route('organization.dashboard');
        }

        // Show organization login page
        return Inertia::render('organization/auth/login', [
            'organization' => [
                'id' => $organization->id,
                'name' => $organization->name,
                'logo' => $organization->logo,
            ],
        ]);
    }

    /**
     * Handle request for main application domain.
     *
     * @return \Illuminate\Http\RedirectResponse|\Inertia\Response
     */
    private function handleMainDomain()
    {
        // Clear any organization from session
        session()->forget('organization_id');

        // If user is authenticated
        if (auth()->check()) {
            return redirect()->route('home');
        }

        // Show landing page
        return app(LandingController::class)->index();
    }

    /**
     * Handle invalid domain.
     *
     * @return \Illuminate\Http\RedirectResponse|\Inertia\Response
     */
    private function handleInvalidDomain()
    {
        return Inertia::render('errors/domain-not-found');
    }
}
