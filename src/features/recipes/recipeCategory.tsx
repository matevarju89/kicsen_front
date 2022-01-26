import react, { useEffect, useRef } from 'react';
import { useStyletron, styled } from 'baseui';
import { useParams, useHistory } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { loadUserBase, userSelector } from '../user/userSlice';
import { recipeSelector, loadCategoryPaginated } from './recipeSlice';
import { authSelector } from '../auth/authSlice';
import { Avatar } from 'baseui/avatar';
import { Card, StyledBody, StyledAction } from 'baseui/card';
import { ChevronLeft, ChevronRight } from 'baseui/icon';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Button } from 'baseui/button';
import { useTranslation } from 'react-i18next';
import { recipeCategories } from './recipeApi';

const RecipeDifficulty = styled('span', ({ $theme }) => ({
  ...$theme.typography.font150,
  [$theme.mediaQuery.small]: {
    ...$theme.typography.font250,
  },
  [$theme.mediaQuery.large]: {
    ...$theme.typography.font350,
  },
}));

export const RecipeCategory = () => {
  //const { category } = useParams();
  const dispatch = useAppDispatch();
  const [css, theme] = useStyletron();
  const { t } = useTranslation();
  const { username } = useAppSelector(authSelector);
  const { families } = useAppSelector(userSelector);
  const { recipeList } = useAppSelector(recipeSelector);
  const history = useHistory();
  useEffect(() => {
    dispatch(loadUserBase(username));
    dispatch(loadCategoryPaginated({ category: 'appetizers', fromIndex: 0 }));
  }, []);
  return (
    <>
      <div
        className={css({
          marginBottom: '40px',
        })}
      >
        <div>
          <h2>{t(`Appetizers`)}</h2>
          <FlexGrid
            flexGridColumnCount={4}
            flexGridColumnGap='scale800'
            flexGridRowGap='scale800'
          >
            {recipeList &&
              recipeList.map((recipe) => (
                <FlexGridItem key={recipe.id}>
                  <Card
                    overrides={{
                      Root: { style: {} },
                      Title: {
                        style: {
                          fontSize: '20px',
                        },
                      },
                    }}
                    headerImage={'/food_placeholder.png'}
                    title={recipe.title}
                  >
                    <StyledBody>
                      <RecipeDifficulty
                        className={css({
                          margin: '0 0 10px 0',
                        })}
                      >{`${t('Difficulty')}: ${t(
                        recipe.difficulty || 'N/a'
                      )}`}</RecipeDifficulty>
                    </StyledBody>
                    <StyledAction>
                      <Button
                        overrides={{
                          BaseButton: { style: { width: '100%' } },
                        }}
                        onClick={() =>
                          history.push(`/recipes/detail/${recipe.id}`)
                        }
                      >
                        {t('Read more')}
                      </Button>
                    </StyledAction>
                  </Card>
                </FlexGridItem>
              ))}
          </FlexGrid>
        </div>
      </div>
    </>
  );
};
