import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AdminPanel from "../pages/AdminPanel";
import { Api } from "../services/Api";
import { clearAuthToken, getAuthToken } from "../services/auth";

export default function ProtectedAdminRoute() {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(() =>
    getAuthToken() ? null : false,
  );

  useEffect(() => {
    let isMounted = true;

    if (!getAuthToken()) {
      return;
    }

    Api.get("/auth/session")
      .then(() => {
        if (isMounted) setIsAuthorized(true);
      })
      .catch(() => {
        clearAuthToken();
        if (isMounted) setIsAuthorized(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isAuthorized === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span
          className="loading loading-spinner loading-lg"
          aria-label="Validando sesión"
        />
      </div>
    );
  }

  return isAuthorized ? <AdminPanel /> : <Navigate to="/admin-login" replace />;
}
