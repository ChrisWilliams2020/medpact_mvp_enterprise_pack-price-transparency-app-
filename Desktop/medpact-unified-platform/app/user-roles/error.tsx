'use client';

import { useEffect } from 'react';

export default function UserRolesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('User roles error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          User Roles Error
        </h2>
        <p className="text-gray-600 mb-4">
          Unable to load user roles. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}