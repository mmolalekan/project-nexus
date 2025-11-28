"use client";

import { isLoggedIn } from "@/shared/utils/auth";
import { PageLoadingState } from "@/shared/allIcons";
import { useEffect, useState, toast } from "@/shared/common";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        toast.error("Not logged in, redirecting to sign-in...");
        window.location.href = "/sign-in";
      } else {
        setAuthorized(true); // Allow access to the protected route
      }
    };

    checkAuth();
  }, []);

  if (!authorized) {
    return <PageLoadingState />;
  }
  return children;
};
