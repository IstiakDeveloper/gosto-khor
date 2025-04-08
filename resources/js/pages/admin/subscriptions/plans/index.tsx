import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Badge
} from '@/components/ui/badge';

interface SubscriptionPlan {
    id: number;
    name: string;
    price: number;
    billing_cycle: string;
    max_organizations: number;
    max_somitis: number;
    max_members: number;
    features?: string[];
    is_active: boolean;
}

interface SubscriptionPlansIndexProps {
    plans: SubscriptionPlan[];
}

const SubscriptionPlansIndex: React.FC<SubscriptionPlansIndexProps> = ({ plans }) => {
    return (
        <AdminLayout title='Subscription Plan'>
            <Head title="Subscription Plans" />

            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Subscription Plans</h1>
                    <Link href="/admin/subscriptions/plans/create">
                        <Button>Create New Plan</Button>
                    </Link>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Billing Cycle</TableHead>
                            <TableHead>Max Organizations</TableHead>
                            <TableHead>Max Somitis</TableHead>
                            <TableHead>Max Members</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {plans.map((plan) => (
                            <TableRow key={plan.id}>
                                <TableCell>{plan.name}</TableCell>
                                <TableCell>${Number(plan.price).toFixed(2)}</TableCell>
                                <TableCell>{plan.billing_cycle}</TableCell>
                                <TableCell>{plan.max_organizations}</TableCell>
                                <TableCell>{plan.max_somitis}</TableCell>
                                <TableCell>{plan.max_members}</TableCell>
                                <TableCell>
                                    <Badge variant={plan.is_active ? 'default' : 'destructive'}>
                                        {plan.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Link href={`/admin/subscriptions/plans/${plan.id}/edit`}>
                                            <Button size="sm" variant="outline">Edit</Button>
                                        </Link>
                                        <Button size="sm" variant="destructive">Delete</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Feature Details Section */}
                {plans.some(plan => plan.features && plan.features.length > 0) && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-4">Plan Features</h2>
                        {plans.map((plan) => (
                            plan.features && plan.features.length > 0 && (
                                <div key={plan.id} className="mb-4">
                                    <h3 className="font-medium">{plan.name} Features:</h3>
                                    <ul className="list-disc list-inside">
                                        {plan.features.map((feature, index) => (
                                            <li key={index}>{feature}</li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default SubscriptionPlansIndex;
