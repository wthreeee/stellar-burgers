import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { fetchFeeds } from '../../services/slices/feedsSlice';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();

  const orders = useAppSelector((s) => s.feeds.orders) as TOrder[];
  const isLoading = useAppSelector((s) => s.feeds.isLoading);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (isLoading) return <Preloader />;

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
