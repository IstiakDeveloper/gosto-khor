<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\OrganizationController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SubscriptionController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\DomainController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\Organization\DashboardController as OrganizationDashboardController;
use App\Http\Controllers\Organization\MemberController;
use App\Http\Controllers\Organization\PaymentController;
use App\Http\Controllers\Organization\ProfileController;
use App\Http\Controllers\Organization\ReportController;
use App\Http\Controllers\Organization\SomitiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Domain Resolver
Route::domain('{domain}.' . config('app.domain'))->group(function () {
    Route::get('/', [DomainController::class, 'resolve']);
});

// Main domain routes
Route::get('/', [LandingController::class, 'index'])->name('landing');
Route::get('/about', [LandingController::class, 'about'])->name('about');
Route::get('/pricing', [LandingController::class, 'pricing'])->name('pricing');
Route::get('/contact', [LandingController::class, 'contact'])->name('contact');
Route::post('/contact', [LandingController::class, 'submitContactForm'])->name('contact.submit');

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [LoginController::class, 'login']);

    Route::get('/register', [RegisterController::class, 'showRegistrationForm'])->name('register');
    Route::post('/register', [RegisterController::class, 'register']);

    Route::get('/forgot-password', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
    Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');

    Route::get('/reset-password/{token}', [ResetPasswordController::class, 'showResetForm'])->name('password.reset');
    Route::post('/reset-password', [ResetPasswordController::class, 'reset'])->name('password.update');
});

// Authenticated Routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
    Route::get('/home', [HomeController::class, 'index'])->name('home');

    // Admin Routes
    Route::prefix('admin')->middleware('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // Organizations
        Route::resource('organizations', OrganizationController::class);

        // Subscriptions
        Route::get('/subscriptions/plans', [SubscriptionController::class, 'plans'])->name('subscriptions.plans');
        Route::get('/subscriptions/plans/create', [SubscriptionController::class, 'createPlan'])->name('subscriptions.plans.create');
        Route::post('/subscriptions/plans', [SubscriptionController::class, 'storePlan'])->name('subscriptions.plans.store');
        Route::get('/subscriptions/plans/{plan}/edit', [SubscriptionController::class, 'editPlan'])->name('subscriptions.plans.edit');
        Route::put('/subscriptions/plans/{plan}', [SubscriptionController::class, 'updatePlan'])->name('subscriptions.plans.update');
        Route::delete('/subscriptions/plans/{plan}', [SubscriptionController::class, 'destroyPlan'])->name('subscriptions.plans.destroy');
        Route::resource('subscriptions', SubscriptionController::class);

        // Users
        Route::get('/users/{user}/password', [UserController::class, 'editPassword'])->name('users.password.edit');
        Route::put('/users/{user}/password', [UserController::class, 'updatePassword'])->name('users.password.update');
        Route::resource('users', UserController::class);

        // Roles & Permissions
        Route::post('/roles/generate-slug', [RoleController::class, 'generateSlug'])->name('roles.generate-slug');
        Route::resource('roles', RoleController::class);

        Route::post('/permissions/generate-slug', [PermissionController::class, 'generateSlug'])->name('permissions.generate-slug');
        Route::resource('permissions', PermissionController::class);
    });

    // Organization Routes
    Route::prefix('organization')->middleware('organization')->name('organization.')->group(function () {
        Route::get('/dashboard', [OrganizationDashboardController::class, 'index'])->name('dashboard');

        Route::get('/somitis', [SomitiController::class, 'index'])->name('somitis.index');
        Route::get('/somitis/create', [SomitiController::class, 'create'])->name('somitis.create');
        Route::post('/somitis', [SomitiController::class, 'store'])->name('somitis.store');
        Route::get('/somitis/{somiti}', [SomitiController::class, 'show'])->name('somitis.show');
        Route::get('/somitis/{somiti}/edit', [SomitiController::class, 'edit'])->name('somitis.edit');
        Route::put('/somitis/{somiti}', [SomitiController::class, 'update'])->name('somitis.update');
        Route::delete('/somitis/{somiti}', [SomitiController::class, 'destroy'])->name('somitis.destroy');

        // Somiti member management
        Route::get('/somitis/{somiti}/members', [SomitiController::class, 'members'])->name('somitis.members');
        Route::get('/somitis/{somiti}/add-members', [SomitiController::class, 'addMembersForm'])->name('somitis.add-members.form');
        Route::post('/somitis/{somiti}/add-members', [SomitiController::class, 'addMembers'])->name('somitis.add-members');
        Route::get('/somitis/{somiti}/members/{member}/remove', [SomitiController::class, 'removeMember'])->name('somitis.members.remove');
        Route::post('/somitis/{somiti}/members/{member}/status', [SomitiController::class, 'updateMemberStatus'])->name('somitis.members.status');

        // Somiti payment management
        Route::get('/somitis/{somiti}/payments', [SomitiController::class, 'payments'])->name('somitis.payments');
        Route::get('/somitis/{somiti}/process-collection', [SomitiController::class, 'processCollection'])->name('somitis.process-collection');
        Route::post('/somitis/{somiti}/save-collection', [SomitiController::class, 'saveCollection'])->name('somitis.save-collection');

        // Payment status management
        Route::post('/payments/{payment}/status', [SomitiController::class, 'updatePaymentStatus'])->name('payments.update-status');

        // Reports and analytics
        Route::get('/somitis/{somiti}/generate-report', [SomitiController::class, 'generateReport'])->name('somitis.report');
        Route::get('/somitis/{somiti}/collection-calendar', [SomitiController::class, 'collectionCalendar'])->name('somitis.calendar');

        // Members
        Route::get('/members/{member}/payments', [MemberController::class, 'payments'])->name('members.payments');
        Route::get('/members/{member}/make-payment', [MemberController::class, 'makePaymentForm'])->name('members.make-payment');
        Route::post('/members/{member}/make-payment', [MemberController::class, 'processPayment'])->name('members.process-payment');
        Route::resource('members', MemberController::class);

        // Payments
        Route::get('/payments/export', [PaymentController::class, 'export'])->name('payments.export');
        Route::put('/payments/{payment}/mark-as-paid', [PaymentController::class, 'markAsPaid'])->name('payments.mark-as-paid');
        Route::resource('payments', PaymentController::class)->except(['create', 'store']);

        // Reports
        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('/reports/somiti-collection', [ReportController::class, 'somitiCollection'])->name('reports.somiti-collection');
        Route::get('/reports/member-payments', [ReportController::class, 'memberPayments'])->name('reports.member-payments');
        Route::get('/reports/due', [ReportController::class, 'dueReport'])->name('reports.due');
        Route::get('/reports/monthly-summary', [ReportController::class, 'monthlySummary'])->name('reports.monthly-summary');
        Route::get('/reports/export', [ReportController::class, 'export'])->name('reports.export');

        // Profile
        Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
        Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');

        Route::get('/profile/password', [ProfileController::class, 'editPassword'])->name('profile.password.edit');
        Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');

        Route::get('/profile/organization', [ProfileController::class, 'organization'])->name('profile.organization');
        Route::get('/profile/organization/edit', [ProfileController::class, 'editOrganization'])->name('profile.organization.edit');
        Route::put('/profile/organization', [ProfileController::class, 'updateOrganization'])->name('profile.organization.update');

        Route::get('/profile/team', [ProfileController::class, 'team'])->name('profile.team');
        Route::get('/profile/team/create', [ProfileController::class, 'createTeamMember'])->name('profile.team.create');
        Route::post('/profile/team', [ProfileController::class, 'storeTeamMember'])->name('profile.team.store');
    });
});
