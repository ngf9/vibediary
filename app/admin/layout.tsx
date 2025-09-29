'use client';

import React, { useState } from 'react';
import { db } from '@/lib/instant';
import { motion } from 'motion/react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';

// Login component with magic code authentication
function AdminLogin() {
  const [sentEmail, setSentEmail] = useState('');

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full">
        {!sentEmail ? (
          <EmailStep onSendEmail={setSentEmail} />
        ) : (
          <CodeStep sentEmail={sentEmail} />
        )}
      </div>
    </div>
  );
}

function EmailStep({ onSendEmail }: { onSendEmail: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await db.auth.sendMagicCode({ email });
      onSendEmail(email);
    } catch (err: unknown) {
      const error = err as { body?: { message?: string } };
      setError(error.body?.message || 'Failed to send code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl shadow-gray-300/50 p-8 backdrop-blur-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/favicon.ico" alt="Logo" className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">Portfolio Admin</h2>
          <p className="text-gray-600 font-light">Enter your email to receive a verification code</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-transparent transition-all duration-200 text-gray-900"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-8 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform active:scale-[0.98]"
        >
          {isLoading ? 'Sending...' : 'Send Verification Code'}
        </button>

        <Link
          href="/"
          className="block w-full py-4 px-8 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform active:scale-[0.98] text-center"
        >
          Back to Home
        </Link>
      </form>
    </motion.div>
  );
}

function CodeStep({ sentEmail }: { sentEmail: string }) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await db.auth.signInWithMagicCode({ email: sentEmail, code });
    } catch (err: unknown) {
      const error = err as { body?: { message?: string } };
      setError(error.body?.message || 'Invalid code');
      setCode('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl shadow-gray-300/50 p-8 backdrop-blur-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/favicon.ico" alt="Logo" className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Enter Verification Code</h2>
          <p className="text-gray-600">
            We sent a code to <strong>{sentEmail}</strong>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            id="code"
            type="text"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-2xl font-mono text-gray-900"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            autoFocus
            maxLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-8 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform active:scale-[0.98]"
        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </button>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="w-full py-4 px-8 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform active:scale-[0.98]"
        >
          Use a different email
        </button>
      </form>
    </motion.div>
  );
}

// Admin header component
function AdminHeader() {
  const user = db.useUser();

  return (
    <header className="bg-gradient-to-br from-white to-gray-50 border-b border-gray-100 px-8 py-4 shadow-sm">
      <div className="mb-2">
        <h1 className="text-lg font-bold text-gray-900">Diary of a Vibe Coder | Admin</h1>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 font-light">
            Welcome back, {user.email}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{getGreeting()}</p>
            <button
              onClick={() => db.auth.signOut()}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <db.SignedIn>
        <div className="flex min-h-screen bg-gray-50">
          <AdminSidebar />
          <div className="flex-1">
            <AdminHeader />
            <main className="p-8">
              {children}
            </main>
          </div>
        </div>
      </db.SignedIn>

      <db.SignedOut>
        <AdminLogin />
      </db.SignedOut>
    </div>
  );
}