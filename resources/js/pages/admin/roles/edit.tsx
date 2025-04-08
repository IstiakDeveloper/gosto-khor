import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger
} from '@/components/ui/multi-selector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
}

interface EditRoleProps {
  role: Role;
  permissions: Permission[];
  rolePermissions: number[];
}

const EditRole: React.FC<EditRoleProps> = ({
  role,
  permissions,
  rolePermissions
}) => {
  const { data, setData, put, processing, errors } = useForm({
    name: role.name,
    slug: role.slug,
    description: role.description || '',
    permissions: rolePermissions,
  });

  const [permissionsMap, setPermissionsMap] = useState<{[key: string]: Permission}>({});

  useEffect(() => {
    // Create a map of permissions for easy lookup
    const map = permissions.reduce((acc, perm) => {
      acc[perm.id.toString()] = perm;
      return acc;
    }, {} as {[key: string]: Permission});
    setPermissionsMap(map);
  }, [permissions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/admin/roles/${role.id}`);
  };

  return (
    <AdminLayout>
      <Head title={`Edit Role: ${role.name}`} />

      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-red-800 mb-6">Edit Role</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-800">Role Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="mt-1"
                  required
                />
                {errors.name && <p className="text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  type="text"
                  value={data.slug}
                  onChange={(e) => setData('slug', e.target.value)}
                  className="mt-1"
                  required
                />
                {errors.slug && <p className="text-red-500 mt-1">{errors.slug}</p>}
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="mt-1"
                  rows={3}
                />
                {errors.description && <p className="text-red-500 mt-1">{errors.description}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-800">Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <MultiSelector
                values={data.permissions.map(String)}
                onValuesChange={(values) =>
                  setData('permissions', values.map(Number))
                }
              >
                <MultiSelectorTrigger className="w-full">
                  Select Permissions
                </MultiSelectorTrigger>
                <MultiSelectorContent>
                  <MultiSelectorList>
                    {permissions.map((permission) => (
                      <MultiSelectorItem
                        key={permission.id}
                        value={permission.id.toString()}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <div className="font-medium">{permission.name}</div>
                          {permission.description && (
                            <div className="text-xs text-gray-500">
                              {permission.description}
                            </div>
                          )}
                        </div>
                      </MultiSelectorItem>
                    ))}
                  </MultiSelectorList>
                </MultiSelectorContent>
              </MultiSelector>
              {errors.permissions && <p className="text-red-500 mt-1">{errors.permissions}</p>}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={processing}
              className="bg-red-700 hover:bg-red-600"
            >
              {processing ? 'Updating...' : 'Update Role'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditRole;
