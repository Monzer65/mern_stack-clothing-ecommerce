import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
export default function RequireAuth() {
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <Outlet />;
}
