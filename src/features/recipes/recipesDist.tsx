import { useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useStyletron } from 'baseui';
import { useTranslation } from 'react-i18next';
import { RecipesMain } from './recipesMain';
import { RecipeCategory } from './recipeCategory';
import { RecipeDetail } from './recipeDetail';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { loadUserBase, loadUserFamily, userSelector } from '../user/userSlice';
import { authSelector } from '../auth/authSlice';
import { Avatar } from 'baseui/avatar';
import { Spinner } from 'baseui/spinner';
import RecipeAdd from './recipeAdd';
import RecipeEdit from './recipeEdit';

export const RecipesDist = () => {
  const dispatch = useAppDispatch();
  const [css, theme] = useStyletron();
  const { t } = useTranslation();
  const { path } = useRouteMatch();
  const { username } = useAppSelector(authSelector);
  const { families, id } = useAppSelector(userSelector);
  useEffect(() => {
    dispatch(loadUserBase(username));
  }, []);
  return (
    <>
      {families?.length ? (
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
                  ? `${t('Your Family')}: ${families[0].description}`
                  : t('You are not part of a family')}
              </p>
            </div>
          </div>
          <Switch>
            <Route exact path={path}>
              <RecipesMain />
            </Route>
            <Route exact path={`${path}/new`} children={<RecipeAdd />} />

            <Route
              exact
              path={`${path}/:category`}
              children={<RecipeCategory />}
            />
            <Route path={`${path}/detail/:id`} children={<RecipeDetail />} />
            <Route path={`${path}/edit/:id`}>
              <RecipeEdit />
            </Route>
          </Switch>
        </>
      ) : (
        <div
          className={css({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          })}
        >
          <Spinner color='#000' />
        </div>
      )}
    </>
  );
};
