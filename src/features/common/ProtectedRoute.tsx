import React from 'react';
import { authSelector } from '../auth/authSlice';
import { useAppSelector } from '../../app/hooks';
import { Redirect } from 'react-router';

export interface PrivateRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute = (props: PrivateRouteProps) => {
  const { isAuthenticated, isFetching } = useAppSelector(authSelector);
  if (isFetching) return <div>Loading...</div>;
  if (isAuthenticated) return <>{props.element}</>;

  return <Redirect to='/' />;
};

export default ProtectedRoute;
