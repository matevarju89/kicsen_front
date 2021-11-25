import React, { useEffect, useMemo } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { logoutUser } from '../auth/authSlice';
import { AppNavBar, setItemActive, NavItemT } from 'baseui/app-nav-bar';
import { ChevronDown, ChevronRight, Delete, Overflow } from 'baseui/icon';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { authSelector } from '../auth/authSlice';

const NavBar = () => {
  const { username, isAuthenticated } = useAppSelector(authSelector);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const handleMainItemSelect = (item: NavItemT) => {
    setMainItems((prev) => setItemActive(prev, item));
  };
  const currentMenuItems: NavItemT[] = useMemo(() => {
    if (isAuthenticated) {
      return [
        {
          icon: ChevronRight,
          label: t('Recipes'),
          info: { linkTo: '/recipes' },
        },
        {
          icon: ChevronDown,
          label: t('Categories'),
          navExitIcon: Delete,
          children: [
            {
              icon: ChevronRight,
              label: t('Appetizer'),
              info: { linkTo: '/recipes/appetizers' },
            },
            {
              icon: ChevronRight,
              label: t('Soup'),
              info: { linkTo: '/recipes/soups' },
            },
            {
              icon: ChevronRight,
              label: t('Main'),
              info: { linkTo: '/recipes/mains' },
            },
            {
              icon: ChevronRight,
              label: t('Dessert'),
              info: { linkTo: '/recipes/desserts' },
            },
          ],
        },
        {
          icon: ChevronRight,
          label: t('New Recipe'),
          info: { linkTo: '/recipes/new' },
        },
      ];
    } else {
      return [
        { icon: ChevronRight, label: t('About'), info: { linkTo: '/about' } },
      ];
    }
  }, [isAuthenticated, t]);
  const currentUserItems: NavItemT[] = useMemo(() => {
    if (isAuthenticated) {
      return [
        {
          icon: Overflow,
          label: t('Profile'),
          info: { linkTo: '/user' },
        },
        { icon: Overflow, label: t('Logout'), info: { clickAction: 'logout' } },
      ];
    } else {
      return [{ icon: Overflow, label: t('Log In') }];
    }
  }, [isAuthenticated, t]);

  useEffect(() => {
    setMainItems(currentMenuItems);
  }, [isAuthenticated]);

  const [mainItems, setMainItems] =
    React.useState<NavItemT[]>(currentMenuItems);
  return (
    <>
      <AppNavBar
        title='Kicsen App'
        mainItems={mainItems}
        userItems={currentUserItems}
        onMainItemSelect={handleMainItemSelect}
        username={isAuthenticated ? username : t('Anonymous')}
        usernameSubtitle={t('Welcome')}
        userImgUrl=''
        mapItemToNode={(item) => {
          if (item?.info?.linkTo) {
            return <Link to={item.info.linkTo}>{item.label}</Link>;
          } else if (item?.info?.clickAction) {
            return (
              <span onClick={() => dispatch(logoutUser())}>{item.label}</span>
            );
          } else {
            return <span>{item.label}</span>;
          }
        }}
      />
    </>
  );
};

export default NavBar;
