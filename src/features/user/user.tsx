import { useTranslation } from 'react-i18next';
import { userSelector } from './userSlice';
import { useAppSelector } from '../../app/hooks';
import { Avatar } from 'baseui/avatar';

const User = () => {
  const { t } = useTranslation();
  const userData = useAppSelector(userSelector);
  return (
    <>
      <h1>{`${t('Welcome')}, ${userData.username}`}</h1>
      {['64px'].map((size) => (
        <Avatar name={userData.username} size={size} key={size} />
      ))}
      <p></p>
    </>
  );
};

export default User;
