import React, { FormEventHandler, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { SubscriptionPlan } from '@/types';

interface RegisterProps {
    plans: SubscriptionPlan[];
}

const Register: React.FC<RegisterProps> = ({ plans }) => {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        organization_name: '',
        domain: '',
        plan_id: plans.length > 0 ? plans[0].id.toString() : '',
    });

    // Check if there's a plan ID in the query string
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const planId = searchParams.get('plan');
        if (planId) {
            setData('plan_id', planId);
        }
    }, []);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register');
    };

    const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove spaces and special characters, convert to lowercase
        const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
        setData('domain', value);
    };

    return (
        <>
            <Head title="Register" />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <div className="text-center text-4xl font-bold text-red-700">GostoKhor</div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            নতুন অ্যাকাউন্ট তৈরি করুন
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            অথবা{' '}
                            <Link href="/login" className="font-medium text-red-700 hover:text-red-500">
                                আপনার অ্যাকাউন্টে লগইন করুন
                            </Link>
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    আপনার নাম
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${errors.name ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300 placeholder-gray-500 text-gray-900'
                                        } rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm`}
                                    placeholder="আপনার নাম"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    ইমেইল অ্যাড্রেস
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${errors.email ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300 placeholder-gray-500 text-gray-900'
                                        } rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm`}
                                    placeholder="ইমেইল অ্যাড্রেস"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    পাসওয়ার্ড
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${errors.password ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300 placeholder-gray-500 text-gray-900'
                                        } rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm`}
                                    placeholder="পাসওয়ার্ড"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                    পাসওয়ার্ড নিশ্চিত করুন
                                </label>
                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                                    placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="text-lg font-medium text-gray-900">সংস্থার তথ্য</h3>
                            </div>

                            <div>
                                <label htmlFor="organization_name" className="block text-sm font-medium text-gray-700">
                                    সংস্থার নাম
                                </label>
                                <input
                                    id="organization_name"
                                    name="organization_name"
                                    type="text"
                                    required
                                    className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${errors.organization_name ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300 placeholder-gray-500 text-gray-900'
                                        } rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm`}
                                    placeholder="সংস্থার নাম"
                                    value={data.organization_name}
                                    onChange={(e) => setData('organization_name', e.target.value)}
                                />
                                {errors.organization_name && (
                                    <p className="mt-2 text-sm text-red-600">{errors.organization_name}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
                                    ডোমেইন (URL সাবডোমেইন)
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                        gosto.designfic.com/
                                    </span>
                                    <input
                                        id="domain"
                                        name="domain"
                                        type="text"
                                        required
                                        className={`appearance-none relative block w-full px-3 py-2 border ${errors.domain ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300 placeholder-gray-500 text-gray-900'
                                            } rounded-l-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm`}
                                        placeholder="apnar-somiti"
                                        value={data.domain}
                                        onChange={handleDomainChange}
                                    />

                                </div>
                                {errors.domain && (
                                    <p className="mt-2 text-sm text-red-600">{errors.domain}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">শুধুমাত্র লোয়ারকেস অক্ষর, সংখ্যা এবং হাইফেন (-) ব্যবহার করুন</p>
                            </div>

                            <div>
                                <label htmlFor="plan_id" className="block text-sm font-medium text-gray-700">
                                    সাবস্ক্রিপশন প্ল্যান
                                </label>
                                <select
                                    id="plan_id"
                                    name="plan_id"
                                    required
                                    className={`mt-1 block w-full py-2 px-3 border ${errors.plan_id ? 'border-red-300 text-red-900' : 'border-gray-300'
                                        } bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                                    value={data.plan_id}
                                    onChange={(e) => setData('plan_id', e.target.value)}
                                >
                                    {plans.map((plan) => (
                                        <option key={plan.id} value={plan.id}>
                                            {plan.name} - ৳{plan.price}/{plan.billing_cycle}
                                        </option>
                                    ))}
                                </select>
                                {errors.plan_id && (
                                    <p className="mt-2 text-sm text-red-600">{errors.plan_id}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                {processing ? 'প্রসেসিং...' : 'রেজিস্টার করুন'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/" className="text-sm font-medium text-red-700 hover:text-red-500">
                            &larr; হোম পেজে ফিরে যান
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
