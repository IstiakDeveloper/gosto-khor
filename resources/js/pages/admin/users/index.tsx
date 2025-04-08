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
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Organization {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  slug: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  is_admin: boolean;
  photo?: string;
  organization?: Organization;
  roles: Role[];
  created_at: string;
}

interface UsersIndexProps {
  users: {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  organizations: Organization[];
  roles: Role[];
  filters: {
    search?: string;
    organization_id?: number;
    role?: string;
    sort_field?: string;
    sort_direction?: 'asc' | 'desc';
  };
}

const UsersIndex: React.FC<UsersIndexProps> = ({
  users,
  organizations,
  roles,
  filters
}) => {
  const [search, setSearch] = useState(filters.search || '');
  const [organizationId, setOrganizationId] = useState(filters.organization_id?.toString() || '');
  const [roleFilter, setRoleFilter] = useState(filters.role || '');
  const [sortField, setSortField] = useState(filters.sort_field || 'created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    filters.sort_direction || 'desc'
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    router.get('/admin/users', {
      search,
      organization_id: organizationId,
      role: roleFilter,
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

    router.get('/admin/users', {
      search,
      organization_id: organizationId,
      role: roleFilter,
      sort_field: field,
      sort_direction: direction
    }, {
      preserveState: true
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AdminLayout>
      <Head title="Users" />

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-800">Users</h1>
          <Link href="/admin/users/create">
            <Button className="bg-red-700 hover:bg-red-600">Create New User</Button>
          </Link>
        </div>

        <div className="flex space-x-4 mb-4">
          <form onSubmit={handleSearch} className="flex space-x-4 w-full">
            <Input
              type="search"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-grow"
            />
            <Select
              value={organizationId}
              onValueChange={(value) => {
                setOrganizationId(value);
                router.get('/admin/users', {
                  search,
                  organization_id: value,
                  role: roleFilter,
                  sort_field: sortField,
                  sort_direction: sortDirection
                }, {
                  preserveState: true
                });
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {organizations.map((org) => (
                  <SelectItem
                    key={org.id}
                    value={org.id.toString()}
                  >
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={roleFilter}
              onValueChange={(value) => {
                setRoleFilter(value);
                router.get('/admin/users', {
                  search,
                  organization_id: organizationId,
                  role: value,
                  sort_field: sortField,
                  sort_direction: sortDirection
                }, {
                  preserveState: true
                });
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem
                    key={role.id}
                    value={role.slug}
                  >
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </form>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead
                onClick={() => handleSort('email')}
                className="cursor-pointer hover:bg-gray-100"
              >
                Email
                {sortField === 'email' && (
                  <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead
                onClick={() => handleSort('created_at')}
                className="cursor-pointer hover:bg-gray-100"
              >
                Created At
                {sortField === 'created_at' && (
                  <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={user.photo ? `/storage/${user.photo}` : undefined}
                        alt={user.name}
                      />
                      <AvatarFallback className="bg-red-500 text-white">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      {user.phone && (
                        <div className="text-xs text-gray-500">{user.phone}</div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.organization?.name || 'No Organization'}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    {user.roles.map((role) => (
                      <Badge
                        key={role.id}
                        variant="secondary"
                        className="bg-red-100 text-red-800"
                      >
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.is_admin ? 'default' : 'outline'}
                    className={user.is_admin ? 'bg-red-700 text-white' : ''}
                  >
                    {user.is_admin ? 'Admin' : 'User'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href={`/admin/users/${user.id}`}>
                      <Button size="sm" variant="outline" className="text-red-700 border-red-700">
                        View
                      </Button>
                    </Link>
                    <Link href={`/admin/users/${user.id}/edit`}>
                      <Button size="sm" variant="outline" className="text-red-700 border-red-700">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {users.total > users.per_page && (
          <Pagination>
            <PaginationContent>
              {users.current_page > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href={`/admin/users?page=${users.current_page - 1}`}
                  />
                </PaginationItem>
              )}

              {[...Array(users.last_page)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href={`/admin/users?page=${index + 1}`}
                    isActive={users.current_page === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {users.current_page < users.last_page && (
                <PaginationItem>
                  <PaginationNext
                    href={`/admin/users?page=${users.current_page + 1}`}
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

export default UsersIndex;
