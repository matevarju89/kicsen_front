import react, { useEffect, useState, createContext, useContext } from 'react';
import { useStyletron } from 'baseui';
import qs from 'query-string';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { userSelector } from '../user/userSlice';
import {
  recipeSelector,
  loadFilteredMeta,
  loadWithFiltersPaginated,
} from './recipeSlice';
import RecipeCard from './RecipeCard';
import RecipeFilters from './recipeFilters';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Pagination } from 'baseui/pagination';
import { useTranslation } from 'react-i18next';
import { numberOfResultsPerPage } from './recipeSlice';
import { CurrentFamilyContext } from '../common/Layout';

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
  const dispatch = useAppDispatch();
  const [css] = useStyletron();
  const { t } = useTranslation();
  const { recipesLoading, recipeList, filteredCount } =
    useAppSelector(recipeSelector);
  const history = useHistory();
  const location = useLocation();
  const { currentFamily } = useContext(CurrentFamilyContext);
  const queryParams = qs.parse(location.search);
  let pageNumber: number = queryParams.page ? Number(queryParams.page) : 1;
  const category1: string | null | (string | null)[] = queryParams.category1;
  const category2: string | null | (string | null)[] = queryParams.category2;
  const category3: string | null | (string | null)[] = queryParams.category3;
  const difficulty: string | null | (string | null)[] = queryParams.difficulty;
  const keyword: string | null | (string | null)[] = queryParams.keyword;
  const smartTag: string | null | (string | null)[] = queryParams.smarttag;
  const category1FilterPortion: {} =
    typeof category1 === 'string' && category1.length
      ? { in: category1.split('+') }
      : { in: ['appetizer', 'soup', 'main', 'dessert'] };
  const category2FilterPortion: {} =
    typeof category2 === 'string' && category2.length
      ? { in: category2.split('+') }
      : { in: ['salty', 'sweet'] };
  const category3FilterPortion: {} =
    typeof category3 === 'string' && category3.length
      ? { in: category3.split('+') }
      : { in: ['vegan', 'nonvegan'] };
  const difficultyFilterPortion =
    typeof difficulty === 'string' && difficulty.length
      ? { in: difficulty.split('+') }
      : { in: ['easy', 'medium', 'hard'] };
  const keywordPortion =
    typeof keyword === 'string' && keyword.length
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
  const smartTagPortion =
    typeof smartTag === 'string'
      ? {
          some: {
            name: {
              contains: smartTag,
              mode: 'insensitive',
            },
          },
        }
      : {};
  const [currentPage, setCurrentPage] = useState(pageNumber);
  const [filtersObj, setFiltersObj] = useState<{}>({
    category1: category1FilterPortion,
    category2: category2FilterPortion,
    category3: category3FilterPortion,
    difficulty: difficultyFilterPortion,
    smartTags: smartTagPortion,
    OR: keywordPortion,
  });
  const contextValue = { filtersObj, setFiltersObj };
  useEffect(() => {
    if (currentFamily) {
      if (currentPage === 1) {
        dispatch(
          loadWithFiltersPaginated({
            family: currentFamily.id,
            fromIndex: 0,
            filterObject: filtersObj,
          })
        );
      } else {
        setCurrentPage(1);
        const queryParams = qs.parse(location.search);
        const newQueryParams = { ...queryParams, page: '1' };
        history.replace({
          pathname: location.pathname,
          search: qs.stringify(newQueryParams),
        });
      }
      dispatch(
        loadFilteredMeta({
          filterObject: filtersObj,
          family: currentFamily.id,
          category: queryParams.category1,
        })
      );
    }
  }, [filtersObj, currentFamily]);
  useEffect(() => {
    if (currentFamily) {
      dispatch(
        loadWithFiltersPaginated({
          family: currentFamily.id,
          fromIndex:
            currentPage === 1 ? 0 : (currentPage - 1) * numberOfResultsPerPage,
          filterObject: filtersObj,
        })
      );
    }
  }, [currentPage, currentFamily]);
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
          <h2 className={css({ display: 'flex', alignItems: 'center' })}>
            <span
              className={css({ display: 'inline-block', marginRight: '10px' })}
            >
              {t('Here is the choice')}
            </span>
            <span
              className={css({
                display: 'inline-block',
                fontWeight: 'normal',
                fontSize: '14px',
              })}
            >{`(${filteredCount} ${t('results')})`}</span>
          </h2>
          <FlexGrid
            flexGridColumnCount={[1, 2, 3, 4]}
            flexGridColumnGap={['scale400', 'scale400', 'scale600', 'scale800']}
            flexGridRowGap={['scale400', 'scale400', 'scale600', 'scale800']}
          >
            {recipesLoading && (
              <>
                <FlexGridItem>
                  <RecipeCard recipeLoading={recipesLoading} />
                </FlexGridItem>
              </>
            )}
            {recipeList &&
              !recipesLoading &&
              recipeList.map((recipe) => (
                <FlexGridItem key={recipe.id}>
                  <RecipeCard recipe={recipe} recipeLoading={recipesLoading} />
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
            PrevButton: {
              style: ({ $theme }) => ({
                paddingRight: '0',
                [$theme.mediaQuery.medium]: {
                  paddingRight: '16px',
                },
              }),
            },
            NextButton: {
              style: ({ $theme }) => ({
                paddingLeft: '0',
                [$theme.mediaQuery.medium]: {
                  paddingLeft: '16px',
                },
              }),
            },
          }}
          onPageChange={({ nextPage }) => {
            const newPage = Math.min(Math.max(nextPage, 1), 20);
            setCurrentPage(newPage);
            const queryParams = qs.parse(location.search);
            const newQueryParams = { ...queryParams, page: newPage.toString() };
            history.replace({
              pathname: location.pathname,
              search: qs.stringify(newQueryParams),
            });
            window.scrollTo(0, 0);
          }}
        />
      </div>
    </FilterContext.Provider>
  );
};
