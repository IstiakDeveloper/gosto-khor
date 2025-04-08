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
  BookOpen,
  Users,
  Shield
} from 'lucide-react';

interface Permission {
  id: number;
  name: string;
  description?: string;
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

interface RoleShowProps {
  role: Role;
}

const RoleShow: React.FC<RoleShowProps> = ({ role }) => {
  const handleDelete = () => {
    // Implement delete logic
    window.location.href = `/admin/roles/${role.id}/delete`;
  };

  return (
    <AdminLayout>
      <Head title={`Role: ${role.name}`} />

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-800">Role Details</h1>
          <div className="flex space-x-2">
            <Link href={`/admin/roles/${role.id}/edit`}>
              <Button variant="outline" className="text-red-700 border-red-700">
                Edit Role
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Role</Button>
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
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Role Details Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center">
                <Shield className="mr-2 h-6 w-6" />
                Role Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Role Name</p>
                  <p className="font-semibold">{role.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Slug</p>
                  <Badge variant="secondary">{role.slug}</Badge>
                </div>
              </div>

              {role.description && (
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p>{role.description}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 mb-2">Created At</p>
                <p>{new Date(role.created_at).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Role Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center">
                <Users className="mr-2 h-6 w-6" />
                Role Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Assigned Users</span>
                <Badge
                  variant={role.users_count > 0 ? 'default' : 'outline'}
                  className={role.users_count > 0 ? 'bg-red-700' : ''}
                >
                  {role.users_count}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Permissions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <BookOpen className="mr-2 h-6 w-6" />
              Assigned Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {role.permissions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {role.permissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-800"
                        >
                          {permission.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {permission.description || 'No description'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500">No permissions assigned to this role.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default RoleShow;
