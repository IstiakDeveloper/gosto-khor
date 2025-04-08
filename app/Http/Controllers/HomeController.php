<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{

    /**
     * Show the application dashboard.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Redirect based on user role
        if (auth()->user()->isSuperAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('organization.dashboard');
    }
}
