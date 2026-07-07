import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { createOrder } from '../../services/slices/ordersSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const bun = useAppSelector((s) => s.burgerConstructor.bun);
  const ingredients = useAppSelector((s) => s.burgerConstructor.ingredients);
  const isAuth = useAppSelector((s) => s.auth.isAuth);

  const orderRequest = useAppSelector((s) => s.orders.isLoading);
  const orderModalData = useAppSelector((s) => s.orders.lastOrder);

  const onOrderClick = () => {
    if (!bun || orderRequest) return;
    if (!isAuth) {
      navigate('/login', { replace: true, state: { from: { pathname: '/' } } });
      return;
    }
    dispatch(createOrder());
  };

  const closeOrderModal = () => {
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  const constructorItems = { bun: bun || undefined, ingredients };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
