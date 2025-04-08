import React from 'react';
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

interface Organization {
  id: number;
  name: string;
}

interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  billing_cycle: string;
}

interface CreateSubscriptionProps {
  organizations: Organization[];
  plans: SubscriptionPlan[];
}

const CreateSubscription: React.FC<CreateSubscriptionProps> = ({
  organizations,
  plans
}) => {
  const { data, setData, post, processing, errors } = useForm({
    organization_id: '',
    subscription_plan_id: '',
    start_date: new Date().toISOString().split('T')[0],
    amount_paid: '',
    payment_method: '',
    transaction_id: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/subscriptions', {
      ...data,
      amount_paid: parseFloat(data.amount_paid),
    });
  };

  return (
    <AdminLayout title='Subscription'>
      <Head title="Create Subscription" />

      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Subscription</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="organization_id">Organization</Label>
            <Select
              value={data.organization_id}
              onValueChange={(value) => setData('organization_id', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Organization" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem
                    key={org.id}
                    value={org.id.toString()}
                  >
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.organization_id && (
              <p className="text-red-500 mt-1">{errors.organization_id}</p>
            )}
          </div>

          <div>
            <Label htmlFor="subscription_plan_id">Subscription Plan</Label>
            <Select
              value={data.subscription_plan_id}
              onValueChange={(value) => {
                setData('subscription_plan_id', value);
                // Optionally set default amount based on selected plan
                const selectedPlan = plans.find(plan => plan.id === parseInt(value));
                if (selectedPlan) {
                  setData('amount_paid', selectedPlan.price.toString());
                }
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem
                    key={plan.id}
                    value={plan.id.toString()}
                  >
                    {plan.name} - ${plan.price} ({plan.billing_cycle})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subscription_plan_id && (
              <p className="text-red-500 mt-1">{errors.subscription_plan_id}</p>
            )}
          </div>

          <div>
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              type="date"
              value={data.start_date}
              onChange={(e) => setData('start_date', e.target.value)}
              className="mt-1"
              required
            />
            {errors.start_date && (
              <p className="text-red-500 mt-1">{errors.start_date}</p>
            )}
          </div>

          <div>
            <Label htmlFor="amount_paid">Amount Paid</Label>
            <Input
              id="amount_paid"
              type="number"
              step="0.01"
              value={data.amount_paid}
              onChange={(e) => setData('amount_paid', e.target.value)}
              className="mt-1"
              required
            />
            {errors.amount_paid && (
              <p className="text-red-500 mt-1">{errors.amount_paid}</p>
            )}
          </div>

          <div>
            <Label htmlFor="payment_method">Payment Method (Optional)</Label>
            <Input
              id="payment_method"
              type="text"
              value={data.payment_method}
              onChange={(e) => setData('payment_method', e.target.value)}
              className="mt-1"
            />
            {errors.payment_method && (
              <p className="text-red-500 mt-1">{errors.payment_method}</p>
            )}
          </div>

          <div>
            <Label htmlFor="transaction_id">Transaction ID (Optional)</Label>
            <Input
              id="transaction_id"
              type="text"
              value={data.transaction_id}
              onChange={(e) => setData('transaction_id', e.target.value)}
              className="mt-1"
            />
            {errors.transaction_id && (
              <p className="text-red-500 mt-1">{errors.transaction_id}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              disabled={processing}
            >
              {processing ? 'Creating...' : 'Create Subscription'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreateSubscription;
