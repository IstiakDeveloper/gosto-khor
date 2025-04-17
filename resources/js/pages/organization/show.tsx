// resources/js/Pages/Organization/Show.tsx
import React from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import {
    Users,
    Phone,
    Mail,
    MapPin,
    CreditCard,
    AlertCircle,
    ChevronRight,
    DollarSign,
    Building,
    User
} from 'lucide-react';

interface Somiti {
    somiti_id: number;
    somiti_name: string;
    due_amount: number;
}

interface Member {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    is_active: boolean;
    total_paid: number;
    total_due: number;
    somitis: Somiti[];
    photo?: string; // Added photo property
}

interface Organization {
    id: number;
    name: string;
    domain: string;
    description: string | null;
    logo: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
}

interface Props {
    organization: Organization;
    membersData: Member[];
    totalDue: number;
    totalPaid: number;
}

export default function Show({ organization, membersData, totalDue, totalPaid }: Props) {
    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                {/* Organization Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                        <div className="flex items-center">
                            {organization.logo ? (
                                <img
                                    src={`/storage/${organization.logo}`}
                                    alt={organization.name}
                                    className="h-16 w-16 mr-4 rounded-lg"
                                />
                            ) : (
                                <div className="h-16 w-16 bg-red-100 flex items-center justify-center rounded-lg mr-4">
                                    <Building className="h-8 w-8 text-red-600" />
                                </div>
                            )}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">{organization.name}</h1>
                                {organization.description && (
                                    <p className="text-gray-600 mt-1">{organization.description}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            {organization.address && (
                                <div className="flex items-center text-gray-600">
                                    <MapPin className="h-4 w-4 mr-2 text-red-500" />
                                    <span>{organization.address}</span>
                                </div>
                            )}
                            {organization.phone && (
                                <div className="flex items-center text-gray-600">
                                    <Phone className="h-4 w-4 mr-2 text-red-500" />
                                    <span>{organization.phone}</span>
                                </div>
                            )}
                            {organization.email && (
                                <div className="flex items-center text-gray-600">
                                    <Mail className="h-4 w-4 mr-2 text-red-500" />
                                    <span>{organization.email}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg shadow-md p-6 border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-700 font-medium">Total Collected</p>
                                <h2 className="text-3xl font-bold text-green-600 mt-2">৳{totalPaid.toFixed(2)}</h2>
                            </div>
                            <div className="bg-white p-3 rounded-full">
                                <DollarSign className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg shadow-md p-6 border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-700 font-medium">Total Due</p>
                                <h2 className="text-3xl font-bold text-red-600 mt-2">৳{totalDue.toFixed(2)}</h2>
                            </div>
                            <div className="bg-white p-3 rounded-full">
                                <AlertCircle className="h-8 w-8 text-red-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Member Search/Filter */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center text-gray-800">
                        <Users className="mr-2 h-5 w-5 text-red-600" />
                        Members
                    </h2>

                    <div className="flex space-x-4">
                        <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
                            <option>All Members</option>
                            <option>Active Members</option>
                            <option>Inactive Members</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Search members..."
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                        />
                    </div>
                </div>

                {/* Members Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {membersData.map((member) => (
                        <div
                            key={member.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                        >
                            <div className={`h-2 ${member.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    {/* Profile Photo */}
                                    <div className="relative mr-4">
                                        {member.photo ? (
                                            <img
                                                src={`/storage/${member.photo}`}
                                                alt={member.name}
                                                className="h-14 w-14 rounded-full object-cover border-2 border-red-100"
                                            />
                                        ) : (
                                            <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center border-2 border-red-100">
                                                <User className="h-8 w-8 text-red-500" />
                                            </div>
                                        )}
                                        <span
                                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${member.is_active ? 'bg-green-500' : 'bg-red-500'
                                                } border border-white`}
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-lg text-gray-800 truncate">{member.name}</h3>
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${member.is_active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {member.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-gray-600">
                                        <Phone className="h-4 w-4 mr-2 text-red-500" />
                                        <span>{member.phone}</span>
                                    </div>

                                    {member.email && (
                                        <div className="flex items-center text-gray-600">
                                            <Mail className="h-4 w-4 mr-2 text-red-500" />
                                            <span className="truncate">{member.email}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-green-50 p-3 rounded-lg text-center">
                                        <p className="text-xs text-gray-600">Total Paid</p>
                                        <p className="text-green-600 font-bold">৳{member.total_paid.toFixed(2)}</p>
                                    </div>
                                    <div className="bg-red-50 p-3 rounded-lg text-center">
                                        <p className="text-xs text-gray-600">Total Due</p>
                                        <p className="text-red-600 font-bold">৳{member.total_due.toFixed(2)}</p>
                                    </div>
                                </div>

                                <Link
                                    href={`/${organization.domain}/members/${member.id}/payments`}
                                    className="flex items-center justify-center w-full py-2 bg-red-600 hover:bg-red-700 transition-colors text-white rounded-md"
                                >
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    <span>View Payments</span>
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
