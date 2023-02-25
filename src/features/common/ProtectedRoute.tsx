import React, { useEffect } from 'react';
import { authSelector } from '../auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Redirect } from 'react-router';
import { logout } from '../auth/authSlice';

export interface PrivateRouteProps {
  element: React.ReactNode;
}

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const ProtectedRoute = (props: PrivateRouteProps) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isFetching } = useAppSelector(authSelector);
  useEffect(() => {
    const user_from_storage = localStorage.getItem('user');
    if (user_from_storage) {
      const user = JSON.parse(user_from_storage);
      if (user) {
        const decodedJwt = parseJwt(user.token);
        if (decodedJwt.exp * 1000 < Date.now()) {
          dispatch(logout());
        }
      }
    }
  }, []);
  if (isFetching) return <div>Loading...</div>;
  if (isAuthenticated) return <>{props.element}</>;

  return <Redirect to='/' />;
};

export default ProtectedRoute;
