import jwtDecode from "jwt-decode";
import React, { useMemo } from "react";
import { Outlet, Navigate } from "react-router-dom";

// Custom hook for getting user role and user email from token
export const useTokenInfo = () => {
  const token = localStorage.getItem("token");

  const userInfo = useMemo(() => {
    if (!token) {
      return { userRole: null, userEmail: null, userId: null };
    }

    const decodedToken = jwtDecode(token);
    return {
      userRole: decodedToken.role,
      userEmail: decodedToken.email,
      userId: decodedToken.userId,
    };
  }, [token]);

  return userInfo;
};

export const AdminRoutes = () => {
  const token = localStorage.getItem("token");
  const { userRole } = useTokenInfo();
  if (token && userRole === "1") {
    return <Outlet />;
  }
};

export const EmployeeRoutes = () => {
  const token = localStorage.getItem("token");
  const { userRole } = useTokenInfo();
  if (token && userRole === "2") {
    return <Outlet />;
  }
};

export const ManagerRoutes = () => {
  const token = localStorage.getItem("token");
  const { userRole } = useTokenInfo();
  if (token && userRole === "3") {
    return <Outlet />;
  }
};

export const PublicRoutes = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" /> : <Outlet />;
};
