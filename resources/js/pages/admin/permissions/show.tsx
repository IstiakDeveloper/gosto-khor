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
  Shield,
  BookOpen
} from 'lucide-react';

interface Role {
  id: number;
  name: string;
  slug: string;
}

interface Permission {
  id: number;
  name: string;
  slug: string;
  description?: string;
  roles: Role[];
  created_at: string;
}

interface PermissionShowProps {
  permission: Permission;
}

const PermissionShow: React.FC<PermissionShowProps> = ({ permission }) => {
  const handleDelete = () => {
    // Implement delete logic
    window.location.href = `/admin/permissions/${permission.id}/delete`;
  };

  return (
    <AdminLayout>
      <Head title={`Permission: ${permission.name}`} />

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-800">Permission Details</h1>
          <div className="flex space-x-2">
            <Link href={`/admin/permissions/${permission.id}/edit`}>
              <Button variant="outline" className="text-red-700 border-red-700">
                Edit Permission
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Permission</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the permission.
                    {permission.roles.length > 0 && ` This permission is currently assigned to ${permission.roles.length} roles.`}
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
          {/* Permission Details Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center">
                <Shield className="mr-2 h-6 w-6" />
                Permission Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Permission Name</p>
                  <p className="font-semibold">{permission.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Slug</p>
                  <Badge variant="secondary">{permission.slug}</Badge>
                </div>
              </div>

              {permission.description && (
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p>{permission.description}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 mb-2">Created At</p>
                <p>{new Date(permission.created_at).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Roles Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center">
                <BookOpen className="mr-2 h-6 w-6" />
                Assigned Roles
              </CardTitle>
            </CardHeader>
            <CardContent>
              {permission.roles.length > 0 ? (
                <div className="space-y-2">
                  {permission.roles.map((role) => (
                    <div
                      key={role.id}
                      className="flex justify-between items-center"
                    >
                      <Badge
                        variant="outline"
                        className="bg-red-100 text-red-800"
                      >
                        {role.name}
                      </Badge>
                      <Link href={`/admin/roles/${role.id}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-700"
                        >
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No roles assigned</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PermissionShow;
