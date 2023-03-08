import React, { useEffect, useMemo } from 'react';
import { useStyletron } from 'baseui';
import { useAppDispatch } from '../../app/hooks';
import { logoutUser } from '../auth/authSlice';
import { AppNavBar, setItemActive, NavItemT } from 'baseui/app-nav-bar';
import { ChevronRight, Delete, Overflow } from 'baseui/icon';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { authSelector } from '../auth/authSlice';

const NavBar = () => {
  const { username, isAuthenticated } = useAppSelector(authSelector);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const [css] = useStyletron();
  const currentMenuItems: NavItemT[] = useMemo(() => {
    if (isAuthenticated) {
      return [
        {
          /*icon: ChevronRight,*/
          label: t('Home'),
          info: { linkTo: '/recipes' },
        },
        {
          /*icon: ChevronRight,*/
          label: t('Recipes'),
          info: { linkTo: '/recipes/all' },
        },
        {
          //icon: ChevronRight,
          label: t('Categories'),
          navExitIcon: Delete,
          children: [
            {
              //icon: ChevronRight,
              label: t('Appetizer'),
              info: { linkTo: '/recipes/appetizers' },
            },
            {
              //icon: ChevronRight,
              label: t('Soup'),
              info: { linkTo: '/recipes/soups' },
            },
            {
              //icon: ChevronRight,
              label: t('Main'),
              info: { linkTo: '/recipes/mains' },
            },
            {
              //icon: ChevronRight,
              label: t('Dessert'),
              info: { linkTo: '/recipes/desserts' },
            },
          ],
        },
        {
          //icon: ChevronRight,
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
      return [{ icon: Overflow, label: t('Log In'), info: { linkTo: '/' } }];
    }
  }, [isAuthenticated, t]);

  const [mainItems, setMainItems] =
    React.useState<NavItemT[]>(currentMenuItems);

  const handleMainItemSelect = (item: NavItemT) => {
    setMainItems((prev) => setItemActive(prev, item));
    if (item?.info?.linkTo) {
      history.push(item.info.linkTo);
    }
  };

  useEffect(() => {
    setMainItems(currentMenuItems);
  }, [isAuthenticated]);

  return (
    <div
      className={css({
        boxSizing: 'border-box',
        position: 'fixed',
        width: '100vw',
        top: '0',
        left: '0',
        zIndex: '2',
      })}
    >
      <AppNavBar
        title={
          <a
            className={css({
              textDecoration: 'none',
              color: '#000',
              fontFamily: 'cursive',
            })}
            href='/recipes'
          >
            Kicsen App
          </a>
        }
        mainItems={mainItems}
        userItems={currentUserItems}
        onMainItemSelect={handleMainItemSelect}
        username={isAuthenticated ? username : t('Anonymous')}
        usernameSubtitle={t('Welcome')}
        onUserItemSelect={(item) => {
          if (item?.info?.linkTo) {
            history.push(item.info.linkTo);
          }
          if (item?.info?.clickAction === 'logout') {
            dispatch(logoutUser());
          }
        }}
        userImgUrl=''
        overrides={{
          MobileDrawer: {
            props: {
              overrides: {
                Root: {
                  style: {
                    zIndex: 10,
                  },
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default NavBar;
