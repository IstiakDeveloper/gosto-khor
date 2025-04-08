import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

interface Role {
    id: number;
    name: string;
}

interface Permission {
    id: number;
    name: string;
    slug: string;
    description?: string;
    roles: Role[];
    roles_count: number;
    created_at: string;
}

interface PermissionsIndexProps {
    permissions: {
        data: Permission[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        sort_field?: string;
        sort_direction?: 'asc' | 'desc';
    };
}

const PermissionsIndex: React.FC<PermissionsIndexProps> = ({
    permissions,
    filters
}) => {
    const [search, setSearch] = useState(filters.search || '');
    const [sortField, setSortField] = useState(filters.sort_field || 'name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
        filters.sort_direction || 'asc'
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const applyFilters = () => {
        router.get('/admin/permissions', {
            search,
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

        router.get('/admin/permissions', {
            search,
            sort_field: field,
            sort_direction: direction
        }, {
            preserveState: true
        });
    };

    const handleDelete = (permissionId: number) => {
        router.delete(`/admin/permissions/${permissionId}`);
    };

    return (
        <AdminLayout>
            <Head title="Permissions" />

            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-red-800">Permissions Management</h1>
                    <Link href="/admin/permissions/create">
                        <Button className="bg-red-700 hover:bg-red-600">Create New Permission</Button>
                    </Link>
                </div>

                <div className="mb-4">
                    <form onSubmit={handleSearch}>
                        <Input
                            type="search"
                            placeholder="Search permissions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full"
                        />
                    </form>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead
                                onClick={() => handleSort('name')}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                Name
                                {sortField === 'name' && (
                                    <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                                )}
                            </TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Assigned Roles</TableHead>
                            <TableHead
                                onClick={() => handleSort('created_at')}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                Created At
                                {sortField === 'created_at' && (
                                    <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                                )}
                            </TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {permissions?.data?.map((permission) => (
                            <TableRow key={permission.id}>
                                <TableCell>{permission.name}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{permission.slug}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {(permission.roles ?? []).slice(0, 3).map((role) => (
                                            <Badge
                                                key={role.id}
                                                variant="outline"
                                                className="bg-red-100 text-red-800"
                                            >
                                                {role.name}
                                            </Badge>
                                        ))}
                                        {permission.roles_count > 3 && (
                                            <Badge variant="outline">
                                                +{permission.roles_count - 3} more
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {new Date(permission.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Link href={`/admin/permissions/${permission.id}`}>
                                            <Button size="sm" variant="outline" className="text-red-700 border-red-700">
                                                View
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/permissions/${permission.id}/edit`}>
                                            <Button size="sm" variant="outline" className="text-red-700 border-red-700">
                                                Edit
                                            </Button>
                                        </Link>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                >
                                                    Delete
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently delete the permission.
                                                        {permission.roles_count > 0 && ` This permission is currently assigned to ${permission.roles_count} roles.`}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(permission.id)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {permissions.total > permissions.per_page && (
                    <Pagination>
                        <PaginationContent>
                            {permissions.current_page > 1 && (
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={`/admin/permissions?page=${permissions.current_page - 1}`}
                                    />
                                </PaginationItem>
                            )}

                            {[...Array(permissions.last_page)].map((_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        href={`/admin/permissions?page=${index + 1}`}
                                        isActive={permissions.current_page === index + 1}
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            {permissions.current_page < permissions.last_page && (
                                <PaginationItem>
                                    <PaginationNext
                                        href={`/admin/permissions?page=${permissions.current_page + 1}`}
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

export default PermissionsIndex;
