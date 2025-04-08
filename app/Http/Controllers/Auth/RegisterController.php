<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\Role;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;

class RegisterController extends Controller
{
    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;


    /**
     * Show the application registration form.
     *
     * @return \Inertia\Response
     */
    public function showRegistrationForm()
    {
        $plans = SubscriptionPlan::active()->get();

        return Inertia::render('auth/register', [
            'plans' => $plans,
        ]);
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'organization_name' => ['required', 'string', 'max:255'],
            'domain' => ['required', 'string', 'max:255', 'unique:organizations,domain'],
            'plan_id' => ['required', 'exists:subscription_plans,id'],
        ]);
    }

    /**
     * Handle a registration request for the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function register(Request $request)
    {
        $this->validator($request->all())->validate();

        event(new Registered($user = $this->create($request->all())));

        Auth::login($user);

        return redirect($this->redirectPath());
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\Models\User
     */
    protected function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            // Create organization
            $organization = Organization::create([
                'name' => $data['organization_name'],
                'domain' => $data['domain'],
                'email' => $data['email'],
            ]);

            // Create user
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'organization_id' => $organization->id,
            ]);

            // Assign admin role
            $adminRole = Role::where('slug', 'organization-admin')->first();
            if ($adminRole) {
                $user->roles()->attach($adminRole->id);
            }

            // Create subscription
            $plan = SubscriptionPlan::findOrFail($data['plan_id']);

            Subscription::create([
                'organization_id' => $organization->id,
                'subscription_plan_id' => $plan->id,
                'start_date' => now(),
                'end_date' => now()->addMonths($plan->duration_in_months),
                'is_active' => true,
                'status' => 'active',
                'amount_paid' => $plan->price,
            ]);

            return $user;
        });
    }

    /**
     * Get the post register / login redirect path.
     *
     * @return string
     */
    public function redirectPath()
    {
        if (method_exists($this, 'redirectTo')) {
            return $this->redirectTo();
        }

        return property_exists($this, 'redirectTo') ? $this->redirectTo : '/home';
    }
}
