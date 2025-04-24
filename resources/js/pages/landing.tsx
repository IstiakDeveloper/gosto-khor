import React, { useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import { SubscriptionPlan } from '@/types';

interface LandingProps {
  plans: SubscriptionPlan[];
}

const Landing: React.FC<LandingProps> = ({ plans }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <Head title="GostoKhor - Easy Somiti Management System" />

      <div className="bg-white">
        {/* Navigation */}
        <nav className="bg-red-700 text-white shadow-md relative z-20">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">GostoKhor</Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden flex items-center"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>

            {/* Desktop menu */}
            <div className="hidden md:flex space-x-6 items-center">
              <Link href="/about" className="hover:text-red-200 transition-colors">About</Link>
              <Link href="/pricing" className="hover:text-red-200 transition-colors">Pricing</Link>
              <Link href="/contact" className="hover:text-red-200 transition-colors">Contact</Link>
              <Link href="/login" className="hover:text-red-200 transition-colors">Login</Link>
              <Link href="/register" className="bg-white text-red-700 hover:bg-red-100 px-4 py-2 rounded-md transition-colors">Register</Link>
            </div>
          </div>

          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-red-800 absolute w-full">
              <div className="px-4 py-2 space-y-3 flex flex-col">
                <Link href="/about" className="hover:text-red-200 py-2 transition-colors">About</Link>
                <Link href="/pricing" className="hover:text-red-200 py-2 transition-colors">Pricing</Link>
                <Link href="/contact" className="hover:text-red-200 py-2 transition-colors">Contact</Link>
                <Link href="/login" className="hover:text-red-200 py-2 transition-colors">Login</Link>
                <Link href="/register" className="bg-white text-red-700 hover:bg-red-100 px-4 py-2 rounded-md text-center my-2 transition-colors">Register</Link>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-700 to-red-500 text-white py-12 md:py-20">
          <div className="container mx-auto px-4 flex flex-col items-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6">সহজেই আপনার সমিতি ব্যবস্থাপনা করুন</h1>
            <p className="text-lg md:text-xl text-center mb-8 max-w-2xl">
              GostoKhor হল একটি সহজ এবং শক্তিশালী সমিতি ব্যবস্থাপনা সিস্টেম যা আপনাকে সদস্য, পেমেন্ট এবং হিসাব সহজেই ট্র্যাক করতে সাহায্য করে
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
              <Link href="/register" className="bg-white text-red-700 hover:bg-gray-100 font-semibold px-6 py-3 rounded-md text-lg text-center transition-colors">
                শুরু করুন
              </Link>
              <Link href="/login" className="bg-red-800 text-white hover:bg-red-900 font-semibold px-6 py-3 rounded-md text-lg text-center transition-colors">
                লগইন করুন
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">আমাদের মূল বৈশিষ্ট্য</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">সদস্য ব্যবস্থাপনা</h3>
                <p className="text-gray-600">সদস্যদের তথ্য সহজেই সংরক্ষণ করুন, তাদের অবস্থা ট্র্যাক করুন এবং সদস্য যোগ করা বা বাদ দেওয়া সহজেই করুন</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">পেমেন্ট ট্র্যাকিং</h3>
                <p className="text-gray-600">পেমেন্ট কালেকশন স্বয়ংক্রিয়ভাবে ট্র্যাক করুন, বকেয়া ম্যানেজ করুন এবং আর্থিক রিপোর্ট তৈরি করুন</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1 sm:mx-auto lg:mx-0 sm:max-w-md lg:max-w-none">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">রিপোর্টিং সিস্টেম</h3>
                <p className="text-gray-600">বিভিন্ন ধরনের রিপোর্ট তৈরি করুন, পরিসংখ্যান দেখুন এবং বিভিন্ন ফরম্যাটে এক্সপোর্ট করুন</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">সাবস্ক্রিপশন প্ল্যান</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {plans.map((plan) => (
                <div key={plan.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col h-full">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-2xl md:text-3xl font-bold text-red-700 mb-4">
                    ৳{plan.price}<span className="text-gray-500 text-sm font-normal">/{plan.billing_cycle}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <ul className="mb-8 flex-grow">
                    <li className="flex items-start mb-2">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>সর্বোচ্চ {plan.max_somitis} সমিতি</span>
                    </li>
                    <li className="flex items-start mb-2">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>সর্বোচ্চ {plan.max_members} সদস্য</span>
                    </li>
                    {plan.features && plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start mb-2">
                        <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/register?plan=${plan.id}`}
                    className="bg-red-700 text-white hover:bg-red-800 text-center py-2 px-4 rounded-md font-medium mt-auto transition-colors"
                  >
                    শুরু করুন
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-red-700 text-white py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">আজই আপনার সমিতি ডিজিটাল করুন</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              GostoKhor দিয়ে আপনার সমিতি ব্যবস্থাপনা সহজ করুন, সময় বাঁচান এবং আরও বেশি দক্ষতার সাথে কাজ করুন।
            </p>
            <Link
              href="/register"
              className="bg-white text-red-700 hover:bg-gray-100 font-semibold px-6 py-3 rounded-md text-lg inline-block transition-colors"
            >
              বিনামূল্যে শুরু করুন
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-10 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">GostoKhor</h3>
                <p className="text-gray-300">
                  সহজ এবং দক্ষ সমিতি ব্যবস্থাপনা সিস্টেম।
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">কোম্পানি</h4>
                <ul className="space-y-2">
                  <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">আমাদের সম্পর্কে</Link></li>
                  <li><Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">মূল্য তালিকা</Link></li>
                  <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">যোগাযোগ</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">সম্পদ</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">ব্লগ</Link></li>
                  <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">ভিডিও টিউটোরিয়াল</Link></li>
                  <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">যোগাযোগ</h4>
                <ul className="space-y-2">
                  <li className="text-gray-300 flex items-center">
                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    desginfic.com@gmail.com
                  </li>
                  <li className="text-gray-300 flex items-center">
                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +880 1717 893432
                  </li>
                  <li className="text-gray-300 flex items-center">
                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    জয়পুরহাট, বাংলাদেশ
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} GostoKhor. সর্বস্বত্ব সংরক্ষিত।</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Landing;
