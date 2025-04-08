import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface Organization {
  id: number;
  name: string;
  domain: string;
  email: string;
  active_subscription?: {
    plan: {
      name: string;
    };
  };
  created_at: string;
}

interface OrganizationsIndexProps {
  organizations: {
    data: Organization[];
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

const OrganizationsIndex: React.FC<OrganizationsIndexProps> = ({
  organizations,
  filters
}) => {
  const [search, setSearch] = useState(filters.search || '');
  const [sortField, setSortField] = useState(filters.sort_field || 'created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    filters.sort_direction || 'desc'
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/admin/organizations', {
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

    router.get('/admin/organizations', {
      search,
      sort_field: field,
      sort_direction: direction
    }, {
      preserveState: true
    });
  };

  return (
    <AdminLayout>
      <Head title="Organizations" />

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Organizations</h1>
          <Link href="/admin/organizations/create">
            <Button>Create New Organization</Button>
          </Link>
        </div>

        <div className="flex space-x-4 mb-4">
          <form onSubmit={handleSearch} className="flex-grow">
            <Input
              type="search"
              placeholder="Search organizations..."
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
              <TableHead
                onClick={() => handleSort('domain')}
                className="cursor-pointer hover:bg-gray-100"
              >
                Domain
                {sortField === 'domain' && (
                  <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </TableHead>
              <TableHead
                onClick={() => handleSort('email')}
                className="cursor-pointer hover:bg-gray-100"
              >
                Email
                {sortField === 'email' && (
                  <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </TableHead>
              <TableHead>Active Plan</TableHead>
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
            {organizations.data.map((org) => (
              <TableRow key={org.id}>
                <TableCell>{org.name}</TableCell>
                <TableCell>{org.domain}</TableCell>
                <TableCell>{org.email}</TableCell>
                <TableCell>
                  {org.active_subscription?.plan?.name || 'No Active Plan'}
                </TableCell>
                <TableCell>
                  {new Date(org.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href={`/admin/organizations/${org.id}`}>
                      <Button size="sm" variant="outline">View</Button>
                    </Link>
                    <Link href={`/admin/organizations/${org.id}/edit`}>
                      <Button size="sm" variant="outline">Edit</Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {organizations.total > organizations.per_page && (
          <Pagination>
            <PaginationContent>
              {organizations.current_page > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href={`/admin/organizations?page=${organizations.current_page - 1}`}
                  />
                </PaginationItem>
              )}

              {[...Array(organizations.last_page)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href={`/admin/organizations?page=${index + 1}`}
                    isActive={organizations.current_page === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {organizations.current_page < organizations.last_page && (
                <PaginationItem>
                  <PaginationNext
                    href={`/admin/organizations?page=${organizations.current_page + 1}`}
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

export default OrganizationsIndex;
