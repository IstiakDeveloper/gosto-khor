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

interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  slug: string;
  description?: string;
  permissions: Permission[];
  users_count: number;
  created_at: string;
}

interface RolesIndexProps {
  roles: {
    data: Role[];
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

const RolesIndex: React.FC<RolesIndexProps> = ({
  roles,
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
    router.get('/admin/roles', {
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

    router.get('/admin/roles', {
      search,
      sort_field: field,
      sort_direction: direction
    }, {
      preserveState: true
    });
  };

  const handleDelete = (roleId: number) => {
    router.delete(`/admin/roles/${roleId}`);
  };

  return (
    <AdminLayout title='Role'>
      <Head title="Roles" />

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-800">Roles Management</h1>
          <Link href="/admin/roles/create">
            <Button className="bg-red-700 hover:bg-red-600">Create New Role</Button>
          </Link>
        </div>

        <div className="mb-4">
          <form onSubmit={handleSearch}>
            <Input
              type="search"
              placeholder="Search roles..."
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
              <TableHead>Permissions</TableHead>
              <TableHead>Users</TableHead>
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
            {roles.data.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{role.slug}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 3).map((permission) => (
                      <Badge
                        key={permission.id}
                        variant="outline"
                        className="bg-red-100 text-red-800"
                      >
                        {permission.name}
                      </Badge>
                    ))}
                    {role.permissions.length > 3 && (
                      <Badge variant="outline">
                        +{role.permissions.length - 3} more
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={role.users_count > 0 ? 'default' : 'outline'}
                    className={role.users_count > 0 ? 'bg-red-700' : ''}
                  >
                    {role.users_count}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(role.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href={`/admin/roles/${role.id}`}>
                      <Button size="sm" variant="outline" className="text-red-700 border-red-700">
                        View
                      </Button>
                    </Link>
                    <Link href={`/admin/roles/${role.id}/edit`}>
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
                            This will permanently delete the role.
                            {role.users_count > 0 && ` This role is currently assigned to ${role.users_count} users.`}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(role.id)}
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

        {roles.total > roles.per_page && (
          <Pagination>
            <PaginationContent>
              {roles.current_page > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href={`/admin/roles?page=${roles.current_page - 1}`}
                  />
                </PaginationItem>
              )}

              {[...Array(roles.last_page)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href={`/admin/roles?page=${index + 1}`}
                    isActive={roles.current_page === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {roles.current_page < roles.last_page && (
                <PaginationItem>
                  <PaginationNext
                    href={`/admin/roles?page=${roles.current_page + 1}`}
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

export default RolesIndex;
