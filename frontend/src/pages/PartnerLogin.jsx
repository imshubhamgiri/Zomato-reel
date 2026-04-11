import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

function PartnerLogin() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { partnerLogin, user, isAuthenticated, isAuthLoading } = useAppContext();

  useEffect(() => {
    // If auth finishes loading and user is already authenticated, don't let them see login
    if (!isAuthLoading && user && isAuthenticated) {
      if (user.userType === 'partner') {
        navigate('/partner/profile');
      } else {
        navigate('/user/profile');
      }
    }
  }, [user, isAuthenticated, isAuthLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      setLoading(true);
      await partnerLogin({email, password});
      navigate('/partner/profile');
    } catch (error) {
      console.error("Error reason :", error.response?.data?.message || error.message);
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const customStyles = `
    @keyframes fadeInUp {
      from{ opacity: 0; transform: translateY(-20px); }
      to{ opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInDown{
      from{ opacity: 0; transform: translateY(20px); }
      to{ opacity: 1; transform: translateY(0); }
    } 
    @keyframes slideInLeft{
      from{ opacity: 0; transform: translateX(-20px); }
      to{ opacity: 1; transform: translateX(0); }
    }
    .animate-fadeInUp { animation: fadeInUp 0.6s ease forwards; }
    .animate-fadeInDown { animation: fadeInDown 0.6s ease forwards; }
    .animate-slideInLeft { animation: slideInLeft 0.6s ease forwards; }
    .initial-hidden { opacity: 0; }
    .delay-200 { animation-delay: 0.2s; }
    .delay-300 { animation-delay: 0.3s; }
  `;

  return (
    <div className='grid grid-cols-2'>
      <div className="min-h-screen flex items-center col-span-2 md:col-span-1 justify-center bg-linear-to-br from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 px-4 relative overflow-hidden">
        {/* Decorative elements for glassmorphism background */}
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>

        <style>{customStyles}</style>
        
        {/* Glassmorphism Card */}
        <div className="relative z-10 max-w-md w-full bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/60 dark:border-gray-700/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-3xl p-8 space-y-8">
          <div className="flex justify-start">
            <Link to="/" className="inline-flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors font-medium">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
          <div className='initial-hidden animate-fadeInUp delay-200'>
            <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
              Partner Portal
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 font-medium">
              Sign in to your restaurant account
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 initial-hidden animate-slideInLeft delay-300">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Email address
                </label>
                <div className='relative mt-1'>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full py-2.5 pr-3 pl-10 border border-white/50 dark:border-gray-600/50 rounded-xl shadow-xs placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white font-medium transition-all"
                    placeholder="partner@restaurant.com"
                  />
                  <Mail className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400' size={18} />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-1 block w-full px-4 py-2.5 border border-white/50 dark:border-gray-600/50 rounded-xl shadow-xs placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white font-medium transition-all"
                  placeholder="••••••••"
                />
                {error && <p className="text-sm absolute text-red-600 dark:text-red-400 font-medium mt-1">{error}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-sky-500 focus:ring-sky-400 border-white/50 dark:border-gray-600/50 rounded bg-white/50 dark:bg-gray-800/50"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-800 dark:text-gray-200 font-medium">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className='initial-hidden animate-fadeInDown mt-6'>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-sky-600/90 hover:bg-sky-700/90 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all"
                disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                Not a partner yet?{' '}
                <Link to="/partner/register" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Register your restaurant
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <div className='hidden sm:block w-full h-screen'>
        <img 
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80" 
          className='w-full h-full object-cover rounded-l-2xl' 
          alt="Login visual" 
        />
      </div>
    </div>
  );
}

export default PartnerLogin;
