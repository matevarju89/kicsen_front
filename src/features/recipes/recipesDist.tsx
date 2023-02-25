import { useContext } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { useStyletron } from 'baseui';
import { useTranslation } from 'react-i18next';
import { RecipesMain } from './recipesMain';
import { RecipeCategory } from './recipeCategory';
import { RecipeAll } from './recipeAll';
import { RecipeDetail } from './recipeDetail';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { userSelector } from '../user/userSlice';
import { Avatar } from 'baseui/avatar';
import { Spinner } from 'baseui/spinner';
import RecipeAdd from './recipeAdd';
import RecipeEdit from './recipeEdit';
import { CurrentFamilyContext } from '../common/Layout';

export const RecipesDist = () => {
  const dispatch = useAppDispatch();
  const [css, theme] = useStyletron();
  const { t } = useTranslation();
  const { path } = useRouteMatch();
  const history = useHistory();

  const { currentFamily } = useContext(CurrentFamilyContext);
  const { families, username } = useAppSelector(userSelector);
  return (
    <>
      {families?.length ? (
        <>
          <div
            className={css({
              width: '305px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flexStart',
              marginBottom: '30px',
              [theme.mediaQuery.medium]: {
                width: '340px',
                marginBottom: '50px',
              },
            })}
          >
            <div
              onClick={() => {
                history.push('/user');
              }}
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
            </div>
            <div>
              <h3
                className={css({
                  margin: '0px 0px 5px 0px',
                })}
              >
                {username}
              </h3>
              <p
                className={css({
                  margin: '0px 0px 10px 0px',
                  fontSize: '0.9rem',
                  [theme.mediaQuery.medium]: {
                    fontSize: '1rem',
                  },
                })}
              >
                {currentFamily
                  ? `${t('Currently viewed family')}: ${
                      currentFamily.description
                    }`
                  : t('You are not part of a family')}
              </p>
            </div>
          </div>
          <Switch>
            <Route exact path={path}>
              <RecipesMain />
            </Route>
            <Route exact path={`${path}/new`} children={<RecipeAdd />} />
            <Route exact path={`${path}/all`} children={<RecipeAll />} />
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
