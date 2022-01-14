import react, { useEffect, useRef } from 'react';
import { useStyletron, withStyle, styled } from 'baseui';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, A11y } from 'swiper';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { loadUserBase, userSelector } from '../user/userSlice';
import { loadAllRecipes, recipeSelector } from './recipeSlice';
import { authSelector } from '../auth/authSlice';
import { Avatar } from 'baseui/avatar';
import { Card, StyledBody, StyledAction } from 'baseui/card';
import { ChevronLeft, ChevronRight } from 'baseui/icon';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Button } from 'baseui/button';
import { useTranslation } from 'react-i18next';
import { recipeCategories } from './recipeApi';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import 'swiper/components/scrollbar/scrollbar.min.css';
import 'swiper/components/navigation/navigation.min.css';

const RecipeDifficulty = styled('span', ({ $theme }) => ({
  ...$theme.typography.font150,
  [$theme.mediaQuery.small]: {
    ...$theme.typography.font250,
  },
  [$theme.mediaQuery.large]: {
    ...$theme.typography.font350,
  },
}));

export const RecipesMain = () => {
  const dispatch = useAppDispatch();
  const [css, theme] = useStyletron();
  const { t } = useTranslation();
  const { username } = useAppSelector(authSelector);
  const { families } = useAppSelector(userSelector);
  const { recipeList } = useAppSelector(recipeSelector);
  const prevRef = Array(recipeCategories.length).fill(useRef(null));
  const nextRef = Array(recipeCategories.length).fill(useRef(null));
  useEffect(() => {
    dispatch(loadUserBase(username));
    dispatch(loadAllRecipes());
  }, []);
  SwiperCore.use([Navigation, A11y]);
  return (
    <>
      <Switch>
        <Route path='/'>
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
          {recipeCategories.map((category, index) => {
            return (
              <div
                key={category}
                className={css({
                  marginBottom: '40px',
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
                    {t(
                      `${category.charAt(0).toUpperCase() + category.slice(1)}`
                    )}
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
                        spaceBetween: 20,
                      },
                      [theme.breakpoints.medium]: {
                        slidesPerView: 3,
                        spaceBetween: 30,
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
                    {recipeList.map((recipe) => (
                      <SwiperSlide key={recipe.id}>
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
                            >
                              {t('Read more')}
                            </Button>
                          </StyledAction>
                        </Card>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div slot='container-end'>
                    <span
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
        </Route>
      </Switch>
    </>
  );
};
