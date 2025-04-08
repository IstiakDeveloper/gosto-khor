import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface User {
  id: number;
  name: string;
}

interface ChangePasswordProps {
  user: User;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ user }) => {
  const { data, setData, put, processing, errors } = useForm({
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/admin/users/${user.id}/password`);
  };

  return (
    <AdminLayout>
      <Head title={`Change Password for ${user.name}`} />

      <div className="p-6 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-800">
              Change Password for {user.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className="mt-1"
                  required
                  minLength={8}
                />
                {errors.password && (
                  <p className="text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password_confirmation">Confirm New Password</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  className="mt-1"
                  required
                  minLength={8}
                />
                {errors.password_confirmation && (
                  <p className="text-red-500 mt-1">{errors.password_confirmation}</p>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={processing}
                  className="bg-red-700 hover:bg-red-600"
                >
                  {processing ? 'Updating...' : 'Change Password'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ChangePassword;
