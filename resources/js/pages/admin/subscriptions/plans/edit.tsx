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
import {
  Checkbox
} from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

interface SubscriptionPlan {
  id: number;
  name: string;
  description?: string;
  price: number;
  billing_cycle: string;
  max_organizations: number;
  max_somitis: number;
  max_members: number;
  features?: string[];
  is_active: boolean;
}

interface EditSubscriptionPlanProps {
  plan: SubscriptionPlan;
}

const EditSubscriptionPlan: React.FC<EditSubscriptionPlanProps> = ({ plan }) => {
  const { data, setData, put, processing, errors } = useForm({
    name: plan.name,
    description: plan.description || '',
    price: plan.price.toString(),
    billing_cycle: plan.billing_cycle,
    max_organizations: plan.max_organizations.toString(),
    max_somitis: plan.max_somitis.toString(),
    max_members: plan.max_members.toString(),
    features: plan.features || [],
    is_active: plan.is_active,
  });

  const [newFeature, setNewFeature] = useState('');

  const addFeature = () => {
    if (newFeature.trim()) {
      setData('features', [...data.features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = data.features.filter((_, i) => i !== index);
    setData('features', updatedFeatures);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/admin/subscriptions/plans/${plan.id}`, {
      ...data,
      price: parseFloat(data.price),
      max_organizations: parseInt(data.max_organizations),
      max_somitis: parseInt(data.max_somitis),
      max_members: parseInt(data.max_members),
    });
  };

  return (
    <AdminLayout>
      <Head title={`Edit Subscription Plan: ${plan.name}`} />

      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Subscription Plan</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Plan Name</Label>
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
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              className="mt-1"
            />
            {errors.description && <p className="text-red-500 mt-1">{errors.description}</p>}
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={data.price}
              onChange={(e) => setData('price', e.target.value)}
              className="mt-1"
              required
            />
            {errors.price && <p className="text-red-500 mt-1">{errors.price}</p>}
          </div>

          <div>
            <Label htmlFor="billing_cycle">Billing Cycle</Label>
            <Select
              value={data.billing_cycle}
              onValueChange={(value) => setData('billing_cycle', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Billing Cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            {errors.billing_cycle && <p className="text-red-500 mt-1">{errors.billing_cycle}</p>}
          </div>

          <div>
            <Label htmlFor="max_organizations">Max Organizations</Label>
            <Input
              id="max_organizations"
              type="number"
              value={data.max_organizations}
              onChange={(e) => setData('max_organizations', e.target.value)}
              className="mt-1"
              required
              min="1"
            />
            {errors.max_organizations && <p className="text-red-500 mt-1">{errors.max_organizations}</p>}
          </div>

          <div>
            <Label htmlFor="max_somitis">Max Somitis</Label>
            <Input
              id="max_somitis"
              type="number"
              value={data.max_somitis}
              onChange={(e) => setData('max_somitis', e.target.value)}
              className="mt-1"
              required
              min="1"
            />
            {errors.max_somitis && <p className="text-red-500 mt-1">{errors.max_somitis}</p>}
          </div>

          <div>
            <Label htmlFor="max_members">Max Members</Label>
            <Input
              id="max_members"
              type="number"
              value={data.max_members}
              onChange={(e) => setData('max_members', e.target.value)}
              className="mt-1"
              required
              min="1"
            />
            {errors.max_members && <p className="text-red-500 mt-1">{errors.max_members}</p>}
          </div>

          <div>
            <Label>Plan Features (Optional)</Label>
            <div className="flex mt-1">
              <Input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Enter a feature"
                className="flex-grow mr-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addFeature();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addFeature}
              >
                Add Feature
              </Button>
            </div>

            {data.features.length > 0 && (
              <div className="mt-2 space-y-2">
                {data.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded"
                  >
                    <span>{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      className="text-red-500 hover:bg-red-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={data.is_active}
              onCheckedChange={(checked) => setData('is_active', !!checked)}
            />
            <Label htmlFor="is_active">Active Plan</Label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              disabled={processing}
            >
              {processing ? 'Updating...' : 'Update Subscription Plan'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditSubscriptionPlan;
