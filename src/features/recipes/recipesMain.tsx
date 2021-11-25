import react, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { loadUserBase } from '../user/userSlice';
import { authSelector } from '../auth/authSlice';

export const RecipesMain = () => {
  const dispatch = useAppDispatch();
  const { username } = useAppSelector(authSelector);
  useEffect(() => {
    dispatch(loadUserBase(username));
  }, []);

  return (
    <>
      <h1> This is the recipes path</h1>
    </>
  );
};
