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
import { Badge } from '@/components/ui/badge';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar';
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
import {
  Mail,
  Phone,
  MapPin,
  Shield,
  Building2
} from 'lucide-react';

interface Organization {
  id: number;
  name: string;
  domain: string;
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
  address?: string;
  photo?: string;
  is_admin: boolean;
  organization?: Organization;
  roles: Role[];
  created_at: string;
}

interface UserShowProps {
  user: User;
}

const UserShow: React.FC<UserShowProps> = ({ user }) => {
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
      <Head title={`User: ${user.name}`} />

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-800">User Details</h1>
          <div className="flex space-x-2">
            <Link href={`/admin/users/${user.id}/edit`}>
              <Button variant="outline" className="text-red-700 border-red-700">
                Edit User
              </Button>
            </Link>
            <Link href={`/admin/users/${user.id}/password`}>
              <Button variant="outline" className="text-red-700 border-red-700">
                Change Password
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete User</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the user account. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      // You'll need to implement the delete method in your form
                      // This is just a placeholder
                      document.getElementById('delete-user-form')?.submit();
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <form
              id="delete-user-form"
              method="POST"
              action={`/admin/users/${user.id}`}
              className="hidden"
            >
              <input type="hidden" name="_method" value="DELETE" />
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-red-800">Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage
                  src={user.photo ? `/storage/${user.photo}` : undefined}
                  alt={user.name}
                />
                <AvatarFallback className="bg-red-500 text-white text-4xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-red-800">{user.name}</h2>
                <Badge
                  variant={user.is_admin ? 'default' : 'secondary'}
                  className={user.is_admin ? 'bg-red-700 text-white' : 'bg-gray-100 text-gray-800'}
                >
                  {user.is_admin ? 'Administrator' : 'Regular User'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-red-800">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Mail className="h-6 w-6 text-red-700" />
                <div>
                  <p className="font-medium">Email</p>
                  <p>{user.email}</p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center space-x-4">
                  <Phone className="h-6 w-6 text-red-700" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p>{user.phone}</p>
                  </div>
                </div>
              )}

              {user.address && (
                <div className="flex items-center space-x-4">
                  <MapPin className="h-6 w-6 text-red-700" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p>{user.address}</p>
                  </div>
                </div>
              )}

              {user.organization && (
                <div className="flex items-center space-x-4">
                  <Building2 className="h-6 w-6 text-red-700" />
                  <div>
                    <p className="font-medium">Organization</p>
                    <Link
                      href={`/admin/organizations/${user.organization.id}`}
                      className="hover:underline text-red-700"
                    >
                      {user.organization.name}
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Roles Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-800">Roles & Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            {user.roles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
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
            ) : (
              <p className="text-gray-500">No roles assigned</p>
            )}
          </CardContent>
        </Card>

        {/* Account Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-800">Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableHead className="font-medium">Created At</TableHead>
                  <TableCell>
                    {new Date(user.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default UserShow;
