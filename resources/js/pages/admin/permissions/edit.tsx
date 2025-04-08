import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Permission {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

interface EditPermissionProps {
  permission: Permission;
}

const EditPermission: React.FC<EditPermissionProps> = ({ permission }) => {
  const { data, setData, put, processing, errors } = useForm({
    name: permission.name,
    slug: permission.slug,
    description: permission.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/admin/permissions/${permission.id}`);
  };

  return (
    <AdminLayout>
      <Head title={`Edit Permission: ${permission.name}`} />

      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-red-800 mb-6">Edit Permission</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-800">Permission Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Permission Name</Label>
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
                  rows={4}
                />
                {errors.description && <p className="text-red-500 mt-1">{errors.description}</p>}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={processing}
              className="bg-red-700 hover:bg-red-600"
            >
              {processing ? 'Updating...' : 'Update Permission'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditPermission;
