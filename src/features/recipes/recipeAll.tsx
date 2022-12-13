import react, { useEffect, useState, createContext, useContext } from 'react';
import { useStyletron, styled } from 'baseui';
import qs from 'query-string';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
//import { useQuery } from '../../utility/routerHooks';
import { loadUserBase, userSelector } from '../user/userSlice';
import {
  recipeSelector,
  loadCategoryPaginated,
  getCountOfCategory,
  loadWithFiltersPaginated,
} from './recipeSlice';
import RecipeFilters from './recipeFilters';
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

export interface IFilterContext {
  filtersObj: {} | null;
  setFiltersObj: react.Dispatch<react.SetStateAction<{} | null>>;
}
export const filtersObjDefaults: IFilterContext = {
  filtersObj: {},
  setFiltersObj: () => {},
};
export const FilterContext = createContext(filtersObjDefaults);

export const RecipeAll = () => {
  //const { category } = useParams<{ category: string }>();
  const [filters, setFilters] = useState([]);
  const dispatch = useAppDispatch();
  const [css, theme] = useStyletron();
  const { t } = useTranslation();
  const { username } = useAppSelector(authSelector);
  const { families } = useAppSelector(userSelector);
  const { recipeList, filteredCount } = useAppSelector(recipeSelector);
  const history = useHistory();
  const location = useLocation();
  //let query = useQuery();
  const queryParams = qs.parse(location.search);
  let pageNumber: number = queryParams.page ? Number(queryParams.page) : 1;
  const category1: string | null | (string | null)[] = queryParams.category1;
  const category2: string | null | (string | null)[] = queryParams.category2;
  const category3: string | null | (string | null)[] = queryParams.category3;
  const difficulty: string | null | (string | null)[] = queryParams.difficulty;
  const keyword: string | null | (string | null)[] = queryParams.keyword;
  const category1FilterPortion: {} =
    typeof category1 === 'string'
      ? { in: category1.split('+') }
      : { in: ['appetizer', 'soup', 'main', 'dessert'] };
  const category2FilterPortion: {} =
    typeof category2 === 'string'
      ? { in: category2.split('+') }
      : { in: ['salty', 'sweet'] };
  const category3FilterPortion: {} =
    typeof category3 === 'string'
      ? { in: category3.split('+') }
      : { in: ['vegan', 'nonvegan'] };
  const difficultyFilterPortion =
    typeof difficulty === 'string'
      ? { in: difficulty.split('+') }
      : { in: ['easy', 'medium', 'hard'] };
  const keywordPortion =
    typeof keyword === 'string'
      ? [
          {
            ingredients: {
              contains: keyword,
              mode: 'insensitive',
            },
          },
          {
            title: {
              contains: keyword,
              mode: 'insensitive',
            },
          },
        ]
      : [];
  const [currentPage, setCurrentPage] = useState(pageNumber);
  const [filtersObj, setFiltersObj] = useState<{}>({
    category1: category1FilterPortion,
    category2: category2FilterPortion,
    category3: category3FilterPortion,
    difficulty: difficultyFilterPortion,
    OR: keywordPortion,
  });
  const contextValue = { filtersObj, setFiltersObj };
  useEffect(() => {
    if (families) {
      dispatch(
        getCountOfCategory({
          family: families[0].id,
          category: queryParams.category1,
        })
      );
    }
  }, [category1]);
  useEffect(() => {
    if (families) {
      /*dispatch(
        loadCategoryPaginated({
          family: families[0].id,
          category: category.slice(0, -1),
          fromIndex: currentPage === 1 ? 0 : currentPage,
        })
      );*/
      dispatch(
        loadWithFiltersPaginated({
          family: families[0].id,
          fromIndex: currentPage === 1 ? 0 : currentPage,
          /*filterObject: {
            category1: {
              equals: category.slice(0, -1),
            },
            difficulty: {
              in: ['easy', 'hard', 'medium'],
            },
            OR: [
              {
                ingredients: {
                  contains: 'ricotta',
                  mode: 'insensitive',
                },
              },
              {
                title: {
                  contains: 'magyaros',
                  mode: 'insensitive',
                },
              },
            ],
            },*/
          filterObject: filtersObj,
        })
      );
    }
  }, [category1, currentPage, filtersObj]);
  useEffect(() => {
    setCurrentPage(pageNumber);
  }, [pageNumber]);
  return (
    <FilterContext.Provider value={contextValue}>
      <div
        className={css({
          marginBottom: '40px',
        })}
      >
        <RecipeFilters isCategoryGiven={false} />
        <div
          className={css({
            marginBottom: '40px',
          })}
        >
          <h2>{t('Here is the choice')}</h2>
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
    </FilterContext.Provider>
  );
};
