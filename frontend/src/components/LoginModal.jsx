import React from 'react';
import { X, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginModal = ({ isOpen, onClose, userType = 'user' }) => {
  if (!isOpen) return null;

  const loginPath = userType === 'partner' ? '/partner/login' : '/user/login';
  const registerPath = userType === 'partner' ? '/partner/register' : '/user/register';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-emerald-100/50 dark:border-slate-700/50 overflow-hidden animate-in fade-in scale-95 transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-linear-to-r from-emerald-500 to-cyan-500 dark:from-black dark:to-black/10 p-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LogIn className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Login Required</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              You need to be logged in to access your profile. Please login or create an account to continue.
            </p>

            <div className="space-y-3">
              {/* Login Button */}
              <Link
                to={loginPath}
                onClick={onClose}
                className="w-full block px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors text-center"
              >
                Login to your Account
              </Link>

              {/* Register Button */}
              <Link
                to={registerPath}
                onClick={onClose}
                className="w-full block px-4 py-3 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800/50 font-semibold rounded-lg transition-colors text-center"
              >
                Create New Account
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 dark:bg-slate-800/30 px-6 py-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              We'll protect your privacy. See our Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
