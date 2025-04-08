import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CreatePermission: React.FC = () => {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    slug: '',
    description: '',
  });

  const handleNameChange = (name: string) => {
    setData('name', name);

    // Generate slug
    fetch('/admin/permissions/generate-slug', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      },
      body: JSON.stringify({ name })
    })
    .then(response => response.json())
    .then(data => {
      setData('slug', data.slug);
    })
    .catch(error => {
      console.error('Error generating slug:', error);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/permissions');
  };

  return (
    <AdminLayout>
      <Head title="Create Permission" />

      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-red-800 mb-6">Create New Permission</h1>

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
                  onChange={(e) => handleNameChange(e.target.value)}
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
              {processing ? 'Creating...' : 'Create Permission'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreatePermission;
