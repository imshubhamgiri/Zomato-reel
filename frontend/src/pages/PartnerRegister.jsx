import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { partnerAPI, authAPI } from '../services/api';

function PartnerRegister() {
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  const [loading, setloading] = useState(false)

  const handleSubmit = async (e) => {
    setloading(true)
    e.preventDefault();

    const restaurantName = e.target['restaurant-name'].value;
    const name = e.target['owner-name'].value;
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const password = e.target.password.value;
    const address = e.target.address.value

    console.table({ restaurantName,name, email, phone, address, password });
    setEmailError('');
    setError('');
    // setloading(false)
    try {
       await partnerAPI.register({ restaurantName, name, email, phone, address, password });      
      // Check user type and navigate accordingly
      const authCheck = await authAPI.checkAuth();
      if (authCheck.userType === 'partner') {
        navigate('/partner/profile');
      } else {
        navigate('/user/profile');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.field === 'email') {
        setEmailError(error.response.data.message);
      } else {
        setError(error.response?.data?.message || 'Registration failed. Please try again.');
      }
    }finally{
      setloading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-start">
          <Link to="/" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            Become a Partner
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Register your restaurant with us
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="restaurant-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Restaurant name
              </label>
              <input
                id="restaurant-name"
                name="restaurant-name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Your Restaurant Name"
              />
            </div>
            <div>
              <label htmlFor="owner-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Owner name
              </label>
              <input
                id="owner-name"
                name="owner-name"
                type="text"
                autoComplete="name"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                  emailError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="partner@restaurant.com"
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{emailError}</p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="+91 (555) 000-0000"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                autoComplete="street-address"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="123 Main St, City, State, ZIP"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              I agree to the{' '}
              <a href="#" className="text-red-600 hover:text-red-500 dark:text-red-400">
                Partner Terms and Conditions
              </a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            disabled={loading}
            >
              {loading ? 'Registering...' : 'Register restaurant'}
            </button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/partner/login" className="font-medium text-red-600 hover:text-red-500 dark:text-red-400">
                Sign in
              </Link>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Looking to order food?{' '}
              <Link to="/user/register" className="font-medium text-red-600 hover:text-red-500 dark:text-red-400">
                Sign up as a User
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PartnerRegister;
