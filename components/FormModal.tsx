'use client';

import { useState, useEffect } from 'react';
import { db, id } from '@/lib/instant';

interface CohortDate {
  id: string;
  courseId: string;
  startDate: string;
  title?: string;
  subtitle?: string;
  description?: string;
  isActive: boolean;
  createdAt?: number;
}

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  cohortDates?: CohortDate[];
}

export default function FormModal({ isOpen, onClose, cohortDates }: FormModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [timezone, setTimezone] = useState('');
  const [classInterest, setClassInterest] = useState('');
  const [whatYouWantToBuild, setWhatYouWantToBuild] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFullName('');
      setEmail('');
      setRole('');
      setTimezone('');
      setClassInterest('');
      setWhatYouWantToBuild('');
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate form
      if (!fullName || !email || !role || !timezone || !classInterest || !whatYouWantToBuild) {
        setError('Please fill in all fields');
        setIsSubmitting(false);
        return;
      }

      // Submit to InstantDB
      await db.transact(
        db.tx.formSubmissions[id()].create({
          fullName,
          email,
          role,
          timezone,
          classInterest,
          whatYouWantToBuild,
          submittedAt: Date.now(),
        })
      );

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Form submission error:', err);

      // Handle error without using 'any' type
      let errorMessage = 'Please try again.';
      if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
        console.error('Error message:', err.message);
      }

      // Log additional error details if available
      if (err && typeof err === 'object') {
        console.error('Error details:', {
          ...err,
          stringified: JSON.stringify(err)
        });
      }

      setError(`Failed to submit form. ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus,
        textarea:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px white inset !important;
          -webkit-text-fill-color: #000000 !important;
          background-color: white !important;
        }
      `}</style>
      <div className="fixed inset-0 backdrop-blur-lg bg-gradient-to-br from-gray-100/50 via-white/30 to-gray-100/50 dark:from-black/50 dark:via-gray-900/30 dark:to-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700 animate-slideIn">
          <div className="relative z-10 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Apply Now
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {success ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Thank you!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                We&apos;ll be in touch soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="fullName" className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Paul Graham"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500 transition-colors"
                  style={{
                    color: fullName ? '#000000' : '#9CA3AF',
                    backgroundColor: '#FFFFFF',
                    WebkitTextFillColor: fullName ? '#000000' : '#9CA3AF',
                    opacity: 1,
                    WebkitAppearance: 'none',
                    appearance: 'none'
                  }}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hackers_painters@example.com"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500 transition-colors"
                  style={{
                    color: email ? '#000000' : '#9CA3AF',
                    backgroundColor: '#FFFFFF',
                    WebkitTextFillColor: email ? '#000000' : '#9CA3AF',
                    opacity: 1,
                    WebkitAppearance: 'none',
                    appearance: 'none'
                  }}
                  required
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Founder, PM, Designer"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500 transition-colors"
                  style={{
                    color: role ? '#000000' : '#9CA3AF',
                    backgroundColor: '#FFFFFF',
                    WebkitTextFillColor: role ? '#000000' : '#9CA3AF',
                    opacity: 1,
                    WebkitAppearance: 'none',
                    appearance: 'none'
                  }}
                  required
                />
              </div>

              <div>
                <label htmlFor="timezone" className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Time Zone
                </label>
                <input
                  type="text"
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  placeholder="e.g., PST, EST, GMT"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500 transition-colors"
                  style={{
                    color: timezone ? '#000000' : '#9CA3AF',
                    backgroundColor: '#FFFFFF',
                    WebkitTextFillColor: timezone ? '#000000' : '#9CA3AF',
                    opacity: 1,
                    WebkitAppearance: 'none',
                    appearance: 'none'
                  }}
                  required
                />
              </div>

              <div>
                <label htmlFor="classInterest" className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Which class are you interested in?
                </label>
                <select
                  id="classInterest"
                  value={classInterest}
                  onChange={(e) => setClassInterest(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 transition-colors"
                  style={{
                    color: classInterest ? '#000000' : '#9CA3AF',
                    backgroundColor: '#FFFFFF',
                    WebkitTextFillColor: classInterest ? '#000000' : '#9CA3AF',
                    opacity: 1,
                    WebkitAppearance: 'none',
                    appearance: 'none'
                  }}
                  required
                >
                  <option value="">Select a class</option>
                  {cohortDates?.map((cohort) => (
                    <option key={cohort.id} value={cohort.title || ''}>
                      {cohort.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="whatYouWantToBuild" className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  What do you want to build?
                </label>
                <textarea
                  id="whatYouWantToBuild"
                  value={whatYouWantToBuild}
                  onChange={(e) => setWhatYouWantToBuild(e.target.value)}
                  placeholder="Tell us about your project idea and why you want to join AI Study Camp"
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500 transition-colors resize-none"
                  style={{
                    color: whatYouWantToBuild ? '#000000' : '#9CA3AF',
                    backgroundColor: '#FFFFFF',
                    WebkitTextFillColor: whatYouWantToBuild ? '#000000' : '#9CA3AF',
                    opacity: 1,
                    WebkitAppearance: 'none',
                    appearance: 'none'
                  }}
                  required
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-6 rounded-full transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 shadow-lg shadow-purple-600/20 hover:shadow-xl hover:shadow-purple-600/30 hover:scale-105 border border-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
    </>
  );
}