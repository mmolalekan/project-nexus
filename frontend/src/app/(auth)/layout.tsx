"use client";

import { Suspense } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen min-w-screen p-6 bg-sec-50 grid place-content-center">
      <div className="max-w-[400px] bg-white p-6 rounded-xl w-full">
        <Suspense>{children}</Suspense>
      </div>
    </div>
  );
}
