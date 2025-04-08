import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  duration_in_months: number;
}

interface Subscription {
  id: number;
  start_date: string;
  end_date: string;
  status: string;
  amount_paid: number;
  plan: SubscriptionPlan;
}

interface Somiti {
  id: number;
  name: string;
  members_count: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Organization {
  id: number;
  name: string;
  domain: string;
  email: string;
  phone?: string;
  address?: string;
  logo?: string | null;
  active_subscription?: Subscription;
  subscriptions: Subscription[];
  somitis: Somiti[];
  users: User[];
}

interface OrganizationShowProps {
  organization: Organization;
}

const OrganizationShow: React.FC<OrganizationShowProps> = ({ organization }) => {
  return (
    <AdminLayout>
      <Head title={`Organization: ${organization.name}`} />

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{organization.name}</h1>
          <div className="flex space-x-2">
            <Link href={`/admin/organizations/${organization.id}/edit`}>
              <Button variant="outline">Edit</Button>
            </Link>
            <Button variant="destructive">Delete</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Organization Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
            </CardHeader>
            <CardContent>
              {organization.logo && (
                <div className="mb-4">
                  <img
                    src={`/storage/${organization.logo}`}
                    alt="Organization Logo"
                    className="max-w-[200px] max-h-[200px] object-contain"
                  />
                </div>
              )}
              <div className="space-y-2">
                <p><strong>Domain:</strong> {organization.domain}</p>
                <p><strong>Email:</strong> {organization.email}</p>
                {organization.phone && (
                  <p><strong>Phone:</strong> {organization.phone}</p>
                )}
                {organization.address && (
                  <p><strong>Address:</strong> {organization.address}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Active Subscription Card */}
          <Card>
            <CardHeader>
              <CardTitle>Active Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              {organization.active_subscription ? (
                <div className="space-y-2">
                  <p><strong>Plan:</strong> {organization.active_subscription.plan.name}</p>
                  <p><strong>Price:</strong> ${organization.active_subscription.amount_paid}</p>
                  <p><strong>Start Date:</strong> {new Date(organization.active_subscription.start_date).toLocaleDateString()}</p>
                  <p><strong>End Date:</strong> {new Date(organization.active_subscription.end_date).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {organization.active_subscription.status}</p>
                </div>
              ) : (
                <p>No active subscription</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Somitis Section */}
        <Card>
          <CardHeader>
            <CardTitle>Somitis</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Number of Members</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organization.somitis.map((somiti) => (
                  <TableRow key={somiti.id}>
                    <TableCell>{somiti.name}</TableCell>
                    <TableCell>{somiti.members_count}</TableCell>
                    <TableCell>
                      <Link href={`/admin/somitis/${somiti.id}`}>
                        <Button size="sm" variant="outline">View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Users Section */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organization.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Link href={`/admin/users/${user.id}`}>
                        <Button size="sm" variant="outline">View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Subscription History */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organization.subscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>{subscription.plan.name}</TableCell>
                    <TableCell>${subscription.amount_paid}</TableCell>
                    <TableCell>{new Date(subscription.start_date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(subscription.end_date).toLocaleDateString()}</TableCell>
                    <TableCell>{subscription.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default OrganizationShow;
