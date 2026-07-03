import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../services/hooks';

type TProtectedRouteProps = {
  children: ReactElement;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuth = useAppSelector((s) => s.auth.isAuth);

  const pathname = location.pathname;

  // Routes that should be accessible only to guests
  const guestOnly = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password'
  ];

  if (guestOnly.includes(pathname) && isAuth) {
    return <Navigate to='/' replace />;
  }

  if (pathname.startsWith('/profile') && !isAuth) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return children;
};
