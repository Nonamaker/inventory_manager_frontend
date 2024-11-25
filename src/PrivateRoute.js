import { useContext } from 'react';
import { Navigate, Outlet } from "react-router";

import { authContext } from './contexts.js';

export function PrivateRoute() {
  const context = useContext(authContext);

  return (
    context.authenticated ? <Outlet /> : <Navigate to="/login" />
  )
}