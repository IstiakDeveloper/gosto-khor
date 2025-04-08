import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Organization {
  id: number;
  name: string;
  domain: string;
  email: string;
  phone?: string;
  address?: string;
  logo?: string | null;
  active_subscription?: {
    plan: {
      id: number;
      name: string;
    };
  };
}

interface EditOrganizationProps {
  organization: Organization;
}

const EditOrganization: React.FC<EditOrganizationProps> = ({ organization }) => {
  const { data, setData, post, processing, errors } = useForm({
    name: organization.name,
    domain: organization.domain,
    email: organization.email,
    phone: organization.phone || '',
    address: organization.address || '',
    logo: null as File | null,
    _method: 'PUT', // For Laravel form method spoofing
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(
    organization.logo ? `/storage/${organization.logo}` : null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('domain', data.domain);
    formData.append('email', data.email);
    formData.append('_method', 'PUT');

    if (data.phone) formData.append('phone', data.phone);
    if (data.address) formData.append('address', data.address);
    if (data.logo) formData.append('logo', data.logo);

    post(`/admin/organizations/${organization.id}`, formData);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('logo', file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleLogoRemove = () => {
    setData('logo', null);
    setLogoPreview(null);
  };

  return (
    <AdminLayout>
      <Head title={`Edit Organization: ${organization.name}`} />

      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Organization</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Organization Name</Label>
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
            <Label htmlFor="domain">Domain</Label>
            <Input
              id="domain"
              type="text"
              value={data.domain}
              onChange={(e) => setData('domain', e.target.value)}
              className="mt-1"
              required
            />
            {errors.domain && <p className="text-red-500 mt-1">{errors.domain}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className="mt-1"
              required
            />
            {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
              className="mt-1"
            />
            {errors.phone && <p className="text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <Label htmlFor="address">Address (Optional)</Label>
            <Textarea
              id="address"
              value={data.address}
              onChange={(e) => setData('address', e.target.value)}
              className="mt-1"
            />
            {errors.address && <p className="text-red-500 mt-1">{errors.address}</p>}
          </div>

          <div>
            <Label htmlFor="logo">Logo (Optional)</Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="mt-1"
            />
            {errors.logo && <p className="text-red-500 mt-1">{errors.logo}</p>}

            {logoPreview && (
              <div className="mt-2 flex items-center space-x-4">
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="max-w-[200px] max-h-[200px] object-contain"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleLogoRemove}
                >
                  Remove Logo
                </Button>
              </div>
            )}
          </div>

          {organization.active_subscription && (
            <div>
              <Label>Current Subscription</Label>
              <div className="mt-1 p-3 bg-gray-100 rounded">
                <p>Plan: {organization.active_subscription.plan.name}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              disabled={processing}
            >
              {processing ? 'Updating...' : 'Update Organization'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditOrganization;
