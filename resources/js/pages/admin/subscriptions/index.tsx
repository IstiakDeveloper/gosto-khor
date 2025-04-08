import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';

interface Organization {
    id: number;
    name: string;
}

interface Plan {
    id: number;
    name: string;
}

interface Subscription {
    id: number;
    organization: Organization;
    plan: Plan;
    start_date: string;
    end_date: string;
    is_active: boolean;
    status: string;
    amount_paid: number;
}

interface SubscriptionsIndexProps {
    subscriptions: {
        data: Subscription[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
        sort_field?: string;
        sort_direction?: 'asc' | 'desc';
    };
}

const SubscriptionsIndex: React.FC<SubscriptionsIndexProps> = ({
    subscriptions,
    filters
}) => {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [sortField, setSortField] = useState(filters.sort_field || 'created_at');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
        filters.sort_direction || 'desc'
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const applyFilters = () => {
        router.get('/admin/subscriptions', {
            search,
            status,
            sort_field: sortField,
            sort_direction: sortDirection
        }, {
            preserveState: true
        });
    };

    const handleSort = (field: string) => {
        const direction =
            sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';

        setSortField(field);
        setSortDirection(direction);

        router.get('/admin/subscriptions', {
            search,
            status,
            sort_field: field,
            sort_direction: direction
        }, {
            preserveState: true
        });
    };

    return (
        <AdminLayout title="Subscription">

            <Head title="Subscriptions" />

            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Subscriptions</h1>
                    <Link href="/admin/subscriptions/create">
                        <Button>Create New Subscription</Button>
                    </Link>
                </div>

                <div className="flex space-x-4 mb-4">
                    <form onSubmit={handleSearch} className="flex space-x-4 w-full">
                        <Input
                            type="search"
                            placeholder="Search subscriptions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-grow"
                        />
                        <Select
                            value={status}
                            onValueChange={(value) => {
                                setStatus(value);
                                router.get('/admin/subscriptions', {
                                    search,
                                    status: value,
                                    sort_field: sortField,
                                    sort_direction: sortDirection
                                }, {
                                    preserveState: true
                                });
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                            </SelectContent>
                        </Select>
                    </form>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead
                                onClick={() => handleSort('organization.name')}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                Organization
                                {sortField === 'organization.name' && (
                                    <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                                )}
                            </TableHead>
                            <TableHead
                                onClick={() => handleSort('plan.name')}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                Plan
                                {sortField === 'plan.name' && (
                                    <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                                )}
                            </TableHead>
                            <TableHead
                                onClick={() => handleSort('start_date')}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                Start Date
                                {sortField === 'start_date' && (
                                    <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                                )}
                            </TableHead>
                            <TableHead
                                onClick={() => handleSort('end_date')}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                End Date
                                {sortField === 'end_date' && (
                                    <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                                )}
                            </TableHead>
                            <TableHead
                                onClick={() => handleSort('amount_paid')}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                Amount Paid
                                {sortField === 'amount_paid' && (
                                    <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                                )}
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscriptions.data.map((subscription) => (
                            <TableRow key={subscription.id}>
                                <TableCell>{subscription.organization.name}</TableCell>
                                <TableCell>{subscription.plan.name}</TableCell>
                                <TableCell>
                                    {new Date(subscription.start_date).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {new Date(subscription.end_date).toLocaleDateString()}
                                </TableCell>
                                <TableCell>${Number(subscription.amount_paid).toFixed(2)}</TableCell>
                                <TableCell>
                                    <span
                                        className={`
                      px-2 py-1 rounded-full text-xs
                      ${subscription.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    `}
                                    >
                                        {subscription.status}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Link href={`/admin/subscriptions/${subscription.id}`}>
                                            <Button size="sm" variant="outline">View</Button>
                                        </Link>
                                        <Link href={`/admin/subscriptions/${subscription.id}/edit`}>
                                            <Button size="sm" variant="outline">Edit</Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {subscriptions.total > subscriptions.per_page && (
                    <Pagination>
                        <PaginationContent>
                            {subscriptions.current_page > 1 && (
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={`/admin/subscriptions?page=${subscriptions.current_page - 1}`}
                                    />
                                </PaginationItem>
                            )}

                            {[...Array(subscriptions.last_page)].map((_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        href={`/admin/subscriptions?page=${index + 1}`}
                                        isActive={subscriptions.current_page === index + 1}
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            {subscriptions.current_page < subscriptions.last_page && (
                                <PaginationItem>
                                    <PaginationNext
                                        href={`/admin/subscriptions?page=${subscriptions.current_page + 1}`}
                                    />
                                </PaginationItem>
                            )}
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </AdminLayout>
    );
};

export default SubscriptionsIndex;
