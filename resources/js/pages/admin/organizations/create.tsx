import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  duration_in_months: number;
}

interface CreateOrganizationProps {
  plans: SubscriptionPlan[];
}

const CreateOrganization: React.FC<CreateOrganizationProps> = ({ plans }) => {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    domain: '',
    email: '',
    phone: '',
    address: '',
    logo: null as File | null,
    plan_id: '' as string | number,
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('domain', data.domain);
    formData.append('email', data.email);

    if (data.phone) formData.append('phone', data.phone);
    if (data.address) formData.append('address', data.address);
    if (data.logo) formData.append('logo', data.logo);

    formData.append('plan_id', data.plan_id.toString());

    post('/admin/organizations', formData);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('logo', file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <AdminLayout>
      <Head title="Create Organization" />

      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Organization</h1>

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
              <div className="mt-2">
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="max-w-[200px] max-h-[200px] object-contain"
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="plan_id">Subscription Plan</Label>
            <Select
              value={data.plan_id.toString()}
              onValueChange={(value) => setData('plan_id', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem
                    key={plan.id}
                    value={plan.id.toString()}
                  >
                    {plan.name} - ${plan.price} ({plan.duration_in_months} months)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.plan_id && <p className="text-red-500 mt-1">{errors.plan_id}</p>}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              disabled={processing}
            >
              {processing ? 'Creating...' : 'Create Organization'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreateOrganization;
