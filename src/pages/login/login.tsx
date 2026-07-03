import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useAppDispatch } from '../../services/hooks';
import { login } from '../../services/slices/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../services/hooks';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authError = useAppSelector((s) => s.auth.error) || '';

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const res: any = await dispatch(login({ email, password }));
      if (res && res.payload && res.payload.success) {
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (err) {}
  };

  return (
    <LoginUI
      errorText={authError}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
