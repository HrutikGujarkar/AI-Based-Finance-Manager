import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              AI Finance Manager
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Smart expense tracking with AI-powered insights
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
