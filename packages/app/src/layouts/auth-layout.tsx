import type React from "react";

interface AuthLayoutProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

export function AuthLayout({ content, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl overflow-hidden">
        <div className="grid md:grid-cols-2 min-h-[600px]">
          {/* Left Column - SEO Content */}
          {content}

          {/* Right Column - Form */}
          <div className="p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
