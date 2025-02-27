import { Route, Routes, Navigate } from "react-router-dom";
import Interceptor from "./interceptor.js";
import AdminLayout from "./layouts/Admin.js";
import ManagerLayout from "layouts/Manager.js";
import EmployeeLayout from "./layouts/Employee.js";
import LoginForm from "components/LoginForm/LoginForm";
import {
  AdminRoutes,
  EmployeeRoutes,
  ManagerRoutes,
  PublicRoutes,
  useTokenInfo,
} from "./authRoutes/PrivateRoutes.js";
import GeneratePassword from "components/GeneratePassword/GeneratePassword.js";
import PageNotFound from "components/PageNotFound/PageNotFound.js";
import ForgotPassword from "components/ForgotPassword/Forgotpassword.js";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const { userRole } = useTokenInfo();

  const isAdmin = userRole === "1";
  const isEmployee = userRole === "2";
  const isManager = userRole === "3";

  return (
    <>
      <Interceptor />
      <Routes>
        <Route
          path="/"
          element={
            isAdmin ? (
              <Navigate to="/admin/employee-report" />
            ) : isEmployee ? (
              <Navigate to="/employee/employee-report" />
            ) : isManager ? (
              <Navigate to="/manager/employee-report" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route element={<AdminRoutes />}>
          <Route path="/admin/*" element={<AdminLayout />} />
        </Route>
        <Route element={<EmployeeRoutes />}>
          <Route path="/employee/*" element={<EmployeeLayout />} />
        </Route>
        <Route element={<ManagerRoutes />}>
          <Route path="/manager/*" element={<ManagerLayout />} />
        </Route>
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/generate-password" element={<GeneratePassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
