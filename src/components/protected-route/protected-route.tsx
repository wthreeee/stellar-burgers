import { FC, ReactElement } from 'react';

type TProtectedRouteProps = {
  children: ReactElement;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({ children }) =>
  children;
