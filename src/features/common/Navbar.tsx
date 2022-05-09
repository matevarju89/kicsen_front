import React, { useEffect, useMemo } from 'react';
import { useStyletron, styled } from 'baseui';
import { useAppDispatch } from '../../app/hooks';
import { logoutUser } from '../auth/authSlice';
import { AppNavBar, setItemActive, NavItemT } from 'baseui/app-nav-bar';
import { ChevronDown, ChevronRight, Delete, Overflow } from 'baseui/icon';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { authSelector } from '../auth/authSlice';

const StyledNavLink = styled(Link, (props) => ({
  textDecoration: 'none',
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#6b6b6b',
  paddingTop: '20px',
  paddingBottom: '20px',
  ':hover': {
    color: '#000',
  },
}));

const NavBar = () => {
  const { username, isAuthenticated } = useAppSelector(authSelector);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const [css] = useStyletron();
  const handleMainItemSelect = (item: NavItemT) => {
    setMainItems((prev) => setItemActive(prev, item));
    if (item?.info?.linkTo) {
      history.push(item.info.linkTo);
    }
  };
  const currentMenuItems: NavItemT[] = useMemo(() => {
    if (isAuthenticated) {
      return [
        {
          /*icon: ChevronRight,*/
          label: t('Recipes'),
          info: { linkTo: '/recipes' },
        },
        {
          //icon: ChevronRight,
          label: t('Categories'),
          navExitIcon: Delete,
          children: [
            {
              //icon: ChevronRight,
              label: t('Appetizer'),
              info: { linkTo: '/recipes/appetizers?page=1' },
            },
            {
              //icon: ChevronRight,
              label: t('Soup'),
              info: { linkTo: '/recipes/soups?page=1' },
            },
            {
              //icon: ChevronRight,
              label: t('Main'),
              info: { linkTo: '/recipes/mains?page=1' },
            },
            {
              //icon: ChevronRight,
              label: t('Dessert'),
              info: { linkTo: '/recipes/desserts?page=1' },
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
        title={
          <a
            className={css({
              textDecoration: 'none',
              color: '#000',
              fontFamily: 'cursive',
            })}
            href='/'
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
    </>
  );
};

export default NavBar;
