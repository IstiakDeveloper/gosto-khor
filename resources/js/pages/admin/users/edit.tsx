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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger
} from '@/components/ui/multi-selector';
import { X, Upload } from 'lucide-react';

interface Organization {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  organization_id?: number;
  is_admin: boolean;
  phone?: string;
  address?: string;
  photo?: string;
}

interface EditUserProps {
  user: User;
  organizations: Organization[];
  roles: Role[];
  userRoles: number[];
}

const EditUser: React.FC<EditUserProps> = ({
  user,
  organizations,
  roles,
  userRoles
}) => {
  const { data, setData, put, processing, errors } = useForm({
    name: user.name,
    email: user.email,
    organization_id: user.organization_id?.toString() || '',
    is_admin: user.is_admin,
    phone: user.phone || '',
    address: user.address || '',
    photo: null as File | null,
    roles: userRoles,
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(
    user.photo ? `/storage/${user.photo}` : null
  );

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('photo', file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setData('photo', null);
    setPhotoPreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('is_admin', data.is_admin.toString());
    formData.append('_method', 'PUT'); // Laravel form method spoofing

    if (data.organization_id) {
      formData.append('organization_id', data.organization_id);
    }

    if (data.phone) formData.append('phone', data.phone);
    if (data.address) formData.append('address', data.address);

    if (data.photo) formData.append('photo', data.photo);

    data.roles.forEach(roleId => {
      formData.append('roles[]', roleId.toString());
    });

    put(`/admin/users/${user.id}`, formData);
  };

  return (
    <AdminLayout>
      <Head title={`Edit User: ${user.name}`} />

      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-red-800 mb-6">Edit User</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-800">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
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
                  <Label htmlFor="email">Email Address</Label>
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
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
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
                  <Input
                    id="address"
                    type="text"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    className="mt-1"
                  />
                  {errors.address && <p className="text-red-500 mt-1">{errors.address}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Account & Photo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-800">Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="organization_id">Organization (Optional)</Label>
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
                  <Label>Roles</Label>
                  <MultiSelector
                    values={data.roles.map(String)}
                    onValuesChange={(values) =>
                      setData('roles', values.map(Number))
                    }
                    className="mt-1"
                  >
                    <MultiSelectorTrigger>
                      <div>Select Roles</div>
                    </MultiSelectorTrigger>
                    <MultiSelectorContent>
                      <MultiSelectorList>
                        {roles.map((role) => (
                          <MultiSelectorItem
                            key={role.id}
                            value={role.id.toString()}
                          >
                            {role.name}
                          </MultiSelectorItem>
                        ))}
                      </MultiSelectorList>
                    </MultiSelectorContent>
                  </MultiSelector>
                  {errors.roles && <p className="text-red-500 mt-1">{errors.roles}</p>}
                </div>

                <div>
                  <Label htmlFor="photo">Profile Photo (Optional)</Label>
                  <div className="mt-1 flex items-center space-x-4">
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="photo"
                      className="cursor-pointer flex items-center space-x-2
                        px-4 py-2 border border-red-700 text-red-700
                        rounded hover:bg-red-50 transition"
                    >
                      <Upload className="h-5 w-5" />
                      <span>Upload Photo</span>
                    </label>

                    {photoPreview && (
                      <div className="relative">
                        <img
                          src={photoPreview}
                          alt="Profile Preview"
                          className="h-20 w-20 rounded-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  {errors.photo && <p className="text-red-500 mt-1">{errors.photo}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_admin"
                    checked={data.is_admin}
                    onCheckedChange={(checked) => setData('is_admin', !!checked)}
                  />
                  <Label htmlFor="is_admin">Administrator</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              disabled={processing}
              className="bg-red-700 hover:bg-red-600"
            >
              {processing ? 'Updating...' : 'Update User'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditUser;
