import react, { useEffect, useState } from 'react';
import { useStyletron, styled } from 'baseui';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { useQuery } from '../../utility/routerHooks';
import { loadUserBase, userSelector } from '../user/userSlice';
import {
  recipeSelector,
  loadCategoryPaginated,
  getCountOfCategory,
} from './recipeSlice';
import { authSelector } from '../auth/authSlice';
import { Avatar } from 'baseui/avatar';
import { Card, StyledBody, StyledAction } from 'baseui/card';
import { ChevronLeft, ChevronRight } from 'baseui/icon';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Button } from 'baseui/button';
import { Pagination } from 'baseui/pagination';
import { useTranslation } from 'react-i18next';
import { recipeCategories } from './recipeApi';
import { numberOfResultsPerPage } from './recipeSlice';
import { number } from 'yup';

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
  const { category } = useParams<{ category: string }>();
  const dispatch = useAppDispatch();
  const [css, theme] = useStyletron();
  const { t } = useTranslation();
  const { username } = useAppSelector(authSelector);
  const { families } = useAppSelector(userSelector);
  const { recipeList, filteredCount } = useAppSelector(recipeSelector);
  const history = useHistory();
  const location = useLocation();
  let query = useQuery();
  let pageNumber: number = query.get('page') ? Number(query.get('page')) : 1;
  const [currentPage, setCurrentPage] = useState(pageNumber);
  useEffect(() => {
    if (families) {
      dispatch(
        getCountOfCategory({
          family: families[0].id,
          category: category.slice(0, -1),
        })
      );
    }
  }, [category]);
  useEffect(() => {
    if (families) {
      dispatch(
        loadCategoryPaginated({
          family: families[0].id,
          category: category.slice(0, -1),
          fromIndex: currentPage === 1 ? 0 : currentPage,
        })
      );
    }
  }, [category, currentPage]);
  useEffect(() => {
    setCurrentPage(pageNumber);
  }, [pageNumber]);
  return (
    <>
      <div
        className={css({
          marginBottom: '40px',
        })}
      >
        <div
          className={css({
            marginBottom: '40px',
          })}
        >
          <h2>{t(category.charAt(0).toUpperCase() + category.slice(1))}</h2>
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

        <Pagination
          numPages={Math.ceil(filteredCount / numberOfResultsPerPage)}
          currentPage={currentPage}
          overrides={{
            Root: {
              style: {
                justifyContent: 'center',
              },
            },
          }}
          onPageChange={({ nextPage }) => {
            const newPage = Math.min(Math.max(nextPage, 1), 20);
            setCurrentPage(newPage);
            const newParams = new URLSearchParams({
              page: newPage.toString(),
            });
            history.replace({
              pathname: location.pathname,
              search: newParams.toString(),
            });
          }}
        />
      </div>
    </>
  );
};
