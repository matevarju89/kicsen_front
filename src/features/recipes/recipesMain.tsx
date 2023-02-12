import { useContext, useEffect, useRef } from 'react';
import { useStyletron } from 'baseui';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, A11y } from 'swiper';
import { useHistory } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { recipeSelector, loadFirstRecipesOfCategories } from './recipeSlice';
import { userSelector } from '../user/userSlice';
import { ChevronLeft, ChevronRight } from 'baseui/icon';
import { useTranslation } from 'react-i18next';
import { recipeCategories } from './recipeApi';
import RecipeCard from './RecipeCard';
import SearchBox from '../search/searchBox';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import 'swiper/components/scrollbar/scrollbar.min.css';
import 'swiper/components/navigation/navigation.min.css';
import { CurrentFamilyContext } from '../common/Layout';

export const RecipesMain = () => {
  const dispatch = useAppDispatch();
  const [css, theme] = useStyletron();
  const { t } = useTranslation();
  const history = useHistory();
  const { recipeList } = useAppSelector(recipeSelector);
  const { families } = useAppSelector(userSelector);
  const { currentFamily } = useContext(CurrentFamilyContext);
  const prevRef = Array(recipeCategories.length).fill(useRef(null));
  const nextRef = Array(recipeCategories.length).fill(useRef(null));
  useEffect(() => {
    if (currentFamily) {
      dispatch(loadFirstRecipesOfCategories(currentFamily.id));
    }
  }, [currentFamily]);
  SwiperCore.use([Navigation, A11y]);
  return (
    <>
      <SearchBox />
      {recipeCategories.map((category, index) => {
        return (
          <div
            key={category}
            className={css({
              marginBottom: '20px',
              [theme.mediaQuery.medium]: {
                marginBottom: '40px',
              },
            })}
          >
            <div
              className={css({
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              })}
            >
              <h2>
                {t(`${category.charAt(0).toUpperCase() + category.slice(1)}`)}
              </h2>
              <div className='swiper-control-sup'>
                <span
                  id='swiper-control-left'
                  className={css({
                    cursor: 'pointer',
                  })}
                  ref={prevRef[index]}
                >
                  <ChevronLeft size={36} />
                </span>
                <span
                  id='swiper-control-right'
                  className={css({
                    cursor: 'pointer',
                  })}
                  ref={nextRef[index]}
                >
                  <ChevronRight size={36} />
                </span>
              </div>
            </div>
            <div>
              <Swiper
                spaceBetween={30}
                slidesPerView={2}
                // Responsive breakpoints
                breakpoints={{
                  [theme.breakpoints.small]: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                  },
                  [theme.breakpoints.medium]: {
                    slidesPerView: 3,
                    spaceBetween: 10,
                  },
                  [theme.breakpoints.large]: {
                    slidesPerView: 4,
                    spaceBetween: 40,
                  },
                }}
                onInit={(swiper) => {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  // eslint-disable-next-line no-param-reassign
                  swiper.params.navigation.prevEl = prevRef[index].current;
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  // eslint-disable-next-line no-param-reassign
                  swiper.params.navigation.nextEl = nextRef[index].current;
                }}
                watchOverflow={true}
                a11y={{
                  enabled: true,
                  containerRoleDescriptionMessage: 'Recipe List',
                  itemRoleDescriptionMessage: 'Card',
                }}
              >
                {recipeList &&
                  recipeList
                    .filter((recipe) => recipe.category1 === category)
                    .map((recipe) => (
                      <SwiperSlide key={recipe.id}>
                        <RecipeCard recipe={recipe} />
                      </SwiperSlide>
                    ))}
              </Swiper>
              <div slot='container-end'>
                <span
                  onClick={() => history.push(`/recipes/${category}s`)}
                  className={css({
                    display: 'inline-block',
                    fontWeight: 'bold',
                    marginTop: '20px',
                    cursor: 'pointer',
                  })}
                >
                  {t('Show All')}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
