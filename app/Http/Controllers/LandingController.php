<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingController extends Controller
{
    /**
     * Show the landing page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Get active subscription plans
        $plans = SubscriptionPlan::active()->get();

        return Inertia::render('landing', [
            'plans' => $plans,
        ]);
    }

    /**
     * Show the about page.
     *
     * @return \Inertia\Response
     */
    public function about()
    {
        return Inertia::render('about');
    }

    /**
     * Show the pricing page.
     *
     * @return \Inertia\Response
     */
    public function pricing()
    {
        // Get active subscription plans with more details
        $plans = SubscriptionPlan::active()->get();

        return Inertia::render('pricing', [
            'plans' => $plans,
        ]);
    }

    /**
     * Show the contact page.
     *
     * @return \Inertia\Response
     */
    public function contact()
    {
        return Inertia::render('contact');
    }

    /**
     * Process contact form submission.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function submitContactForm(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        // Process contact form (send email, save to database, etc.)
        // ...

        return redirect()->back()->with('success', 'Your message has been sent successfully!');
    }
}
