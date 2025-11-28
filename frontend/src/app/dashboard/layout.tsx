"use client";

import { ProtectedRoute } from "./components/protectedRoute";

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <div className="bg-sec-50 h-screen w-full">
        <div className="w-full">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
