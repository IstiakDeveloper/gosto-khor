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
import {
  Checkbox
} from '@/components/ui/checkbox';

interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  billing_cycle: string;
}

interface Organization {
  id: number;
  name: string;
}

interface Subscription {
  id: number;
  organization: Organization;
  plan: SubscriptionPlan;
  start_date: string;
  end_date: string;
  is_active: boolean;
  status: string;
  amount_paid: number;
  payment_method?: string;
  transaction_id?: string;
}

interface EditSubscriptionProps {
  subscription: Subscription;
  plans: SubscriptionPlan[];
}

const EditSubscription: React.FC<EditSubscriptionProps> = ({
  subscription,
  plans
}) => {
  const { data, setData, put, processing, errors } = useForm({
    subscription_plan_id: subscription.plan.id.toString(),
    start_date: new Date(subscription.start_date).toISOString().split('T')[0],
    end_date: new Date(subscription.end_date).toISOString().split('T')[0],
    is_active: subscription.is_active,
    status: subscription.status,
    amount_paid: subscription.amount_paid.toString(),
    payment_method: subscription.payment_method || '',
    transaction_id: subscription.transaction_id || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/admin/subscriptions/${subscription.id}`, {
      ...data,
      amount_paid: parseFloat(data.amount_paid),
    });
  };

  return (
    <AdminLayout title='Subscription'>
      <Head title={`Edit Subscription for ${subscription.organization.name}`} />

      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          Edit Subscription for {subscription.organization.name}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Organization</Label>
            <Input
              type="text"
              value={subscription.organization.name}
              disabled
              className="mt-1 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <Label htmlFor="subscription_plan_id">Subscription Plan</Label>
            <Select
              value={data.subscription_plan_id}
              onValueChange={(value) => {
                setData('subscription_plan_id', value);
                // Optionally update amount based on selected plan
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
            <Label htmlFor="end_date">End Date</Label>
            <Input
              id="end_date"
              type="date"
              value={data.end_date}
              onChange={(e) => setData('end_date', e.target.value)}
              className="mt-1"
              required
            />
            {errors.end_date && (
              <p className="text-red-500 mt-1">{errors.end_date}</p>
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

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={data.status}
              onValueChange={(value) => setData('status', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-red-500 mt-1">{errors.status}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={data.is_active}
              onCheckedChange={(checked) => setData('is_active', !!checked)}
            />
            <Label htmlFor="is_active">Active Subscription</Label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              disabled={processing}
            >
              {processing ? 'Updating...' : 'Update Subscription'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditSubscription;
