import { useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useStyletron } from 'baseui';
import { useTranslation } from 'react-i18next';
import { RecipesMain } from './recipesMain';
import { RecipeCategory } from './recipeCategory';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { loadUserBase, userSelector } from '../user/userSlice';
import { authSelector } from '../auth/authSlice';
import { Avatar } from 'baseui/avatar';

export const RecipesDist = () => {
  const dispatch = useAppDispatch();
  const [css, theme] = useStyletron();
  const { t } = useTranslation();
  const { path } = useRouteMatch();
  const { username } = useAppSelector(authSelector);
  const { families } = useAppSelector(userSelector);
  useEffect(() => {
    dispatch(loadUserBase(username));
  }, []);
  return (
    <>
      <div
        className={css({
          width: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flexStart',
          marginBottom: '50px',
        })}
      >
        <Avatar
          name={username}
          size='scale1600'
          src=''
          overrides={{
            Root: {
              style: { marginRight: '20px' },
            },
          }}
        />
        <div>
          <h3
            className={css({
              margin: '0px 0px 10px 0px',
            })}
          >
            {username}
          </h3>
          <p
            className={css({
              margin: 0,
            })}
          >
            {families?.length
              ? `${t('Your Family')}: ${families[0]}`
              : t('You are not part of a family')}
          </p>
        </div>
      </div>
      <Switch>
        <Route exact path={path}>
          <RecipesMain />
        </Route>
        <Route path={`${path}/:category`} children={<RecipeCategory />} />
      </Switch>
    </>
  );
};
