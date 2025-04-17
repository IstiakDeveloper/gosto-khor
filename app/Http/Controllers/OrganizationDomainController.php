<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrganizationDomainController extends Controller
{
    public function show($domain)
    {
        $organization = Organization::where('domain', $domain)
            ->with([
                'somitis',
                'members',
                'members.somitiMembers',
                'members.somitiMembers.somiti', // Make sure this is here
                'members.payments'
            ])
            ->firstOrFail();

        $membersData = $organization->members->map(function ($member) {
            $totalPaid = $member->payments->sum('amount');
            $totalDue = $member->somitiMembers->sum('due_amount');

            return [
                'id' => $member->id,
                'name' => $member->name,
                'phone' => $member->phone,
                'photo' => $member->photo,
                'email' => $member->email,
                'is_active' => $member->is_active,
                'total_paid' => $totalPaid,
                'total_due' => $totalDue,
                'somitis' => $member->somitiMembers->map(function ($somitiMember) {
                    return [
                        'somiti_id' => $somitiMember->somiti_id,
                        'somiti_name' => $somitiMember->somiti ? $somitiMember->somiti->name : 'Unknown Somiti',
                        'due_amount' => $somitiMember->due_amount,
                    ];
                }),
            ];
        });

        return Inertia::render('organization/show', [
            'organization' => $organization,
            'membersData' => $membersData,
            'totalDue' => $membersData->sum('total_due'),
            'totalPaid' => $membersData->sum('total_paid'),
        ]);
    }

    public function memberPayments($domain, $memberId)
    {
        $organization = Organization::where('domain', $domain)->firstOrFail();
        $member = $organization->members()->findOrFail($memberId);

        $payments = $member->payments()
            ->with('somiti')
            ->orderBy('payment_date', 'desc')
            ->get();

        return Inertia::render('organization/member-payments', [
            'organization' => $organization,
            'member' => $member,
            'payments' => $payments
        ]);
    }
}
