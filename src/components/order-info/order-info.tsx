import { FC, useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { fetchFeeds } from '../../services/slices/feedsSlice';
import { fetchUserOrders } from '../../services/slices/ordersSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const ingredients = useAppSelector((state) => state.ingredients.ingredients);
  const feedOrders = useAppSelector((state) => state.feeds.orders);
  const feedLoading = useAppSelector((state) => state.feeds.isLoading);
  const profileOrders = useAppSelector((state) => state.orders.orders);
  const profileLoading = useAppSelector((state) => state.orders.isLoading);

  const orderNumber = Number(number);
  const isProfile = location.pathname.startsWith('/profile/orders');
  const orders = isProfile ? profileOrders : feedOrders;
  const isLoading = isProfile ? profileLoading : feedLoading;

  useEffect(() => {
    if (isProfile) {
      if (!profileOrders.length && !profileLoading) {
        dispatch(fetchUserOrders());
      }
    } else {
      if (!feedOrders.length && !feedLoading) {
        dispatch(fetchFeeds());
      }
    }
  }, [
    dispatch,
    profileOrders.length,
    profileLoading,
    feedOrders.length,
    feedLoading,
    isProfile
  ]);

  const orderData = useMemo(
    () => orders.find((item) => item.number === orderNumber) || null,
    [orders, orderNumber]
  );

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderData || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
