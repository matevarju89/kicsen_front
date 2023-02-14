import React, { useEffect, useState } from 'react';
import { useStyletron } from 'baseui';
import { useTranslation } from 'react-i18next';
import { Block } from 'baseui/block';
import { Button, KIND, SHAPE, SIZE } from 'baseui/button';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  recipeSelector,
  loadRecipe,
  clearRecipeDetailState,
} from './recipeSlice';
import { useHistory, useParams } from 'react-router-dom';
import { Skeleton } from 'baseui/skeleton';
import { userSelector } from '../user/userSlice';

const CategoryTag = ({ children }: { children: React.ReactNode }) => {
  const [css, theme] = useStyletron();
  return (
    <span
      className={css({
        padding: '5px 15px',
        border: '1px solid #000',
        borderRadius: '20px',
        marginRight: '15px',
        marginBottom: '10px',
        fontSize: '0.8rem',
        [theme.mediaQuery.medium]: {
          fontSize: '1rem',
        },
      })}
    >
      {children}
    </span>
  );
};

export const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { recipeDetail, recipeDetailError, recipeDetailLoading } =
    useAppSelector(recipeSelector);
  const [t] = useTranslation();
  const [css, theme] = useStyletron();
  const [imageLoaded, setImageLoaded] = useState(false);
  const { lang } = useAppSelector(userSelector);
  useEffect(() => {
    dispatch(loadRecipe(id));
    return () => {
      dispatch(clearRecipeDetailState());
    };
  }, []);

  return (
    <div>
      {recipeDetailError && (
        <>
          <h2>We couldn't load the recipe. Please come back later!</h2>
          <p>{`Err reason: ${recipeDetailError}`}</p>
        </>
      )}
      {recipeDetailLoading && (
        <>
          <Skeleton width='500px' height='375px' animation />
          <Skeleton
            rows={3}
            width='200px'
            overrides={{
              Row: {
                style: {
                  height: '20px',
                  marginBottom: '15px',
                },
              },
            }}
            animation
          />
        </>
      )}
      {recipeDetail && (
        <>
          {!imageLoaded && (
            <Skeleton
              width='100%'
              height='375px'
              animation
              overrides={{
                Root: {
                  style: {
                    marginBottom: '10px',
                    [theme.mediaQuery.medium]: {
                      width: '500px',
                    },
                  },
                },
              }}
            />
          )}
          <img
            width={'100%'}
            alt='food'
            onLoad={() => {
              setImageLoaded(true);
            }}
            className={css({
              [theme.mediaQuery.medium]: {
                width: '500px',
              },
            })}
            style={imageLoaded ? { marginBottom: '10px' } : { display: 'none' }}
            src={
              recipeDetail.images &&
              recipeDetail.images.length &&
              recipeDetail.images[0].url
                ? recipeDetail.images[0].url
                : '/food_placeholder.png'
            }
          />
          <Block display='flex' marginBottom='30px' flexWrap={true}>
            <CategoryTag>
              {recipeDetail.category1 && t(recipeDetail.category1)}
            </CategoryTag>
            <CategoryTag>
              {recipeDetail.category2 && t(recipeDetail.category2)}
            </CategoryTag>
            <CategoryTag>
              {recipeDetail.category3 && t(recipeDetail.category3)}
            </CategoryTag>
            {recipeDetail.smartTags &&
              recipeDetail.smartTags
                .filter((tag) => {
                  return tag.lang === lang;
                })
                .map((tag) => {
                  return <CategoryTag key={tag.name}>{tag.name}</CategoryTag>;
                })}
          </Block>
          <h2
            className={css({
              marginBottom: '10px',
            })}
          >
            <span
              className={css({
                marginRight: '10px',
              })}
            >
              {recipeDetail.title}
            </span>
            <Button
              onClick={() => history.push(`/recipes/edit/${recipeDetail.id}`)}
              kind={KIND.secondary}
              shape={SHAPE.pill}
              size={SIZE.mini}
            >
              {t('Edit recipe')}
            </Button>
          </h2>
          <Block marginBottom='30px'>
            <span
              className={css({
                fontWeight: 'bold',
              })}
            >
              {t('Difficulty')}:{' '}
            </span>
            <span>{recipeDetail.difficulty && t(recipeDetail.difficulty)}</span>
          </Block>
          <Block>
            <span
              className={css({
                fontWeight: 'bold',
              })}
            >
              {t('Ingredients')}
            </span>
          </Block>
          <Block marginBottom='30px' marginTop='10px'>
            {recipeDetail.ingredients.split(',').map((ingredient) => {
              return (
                <p
                  key={ingredient}
                  className={css({
                    marginTop: '0px',
                    marginBottom: '5px',
                  })}
                >
                  {ingredient}
                </p>
              );
            })}
          </Block>
          <Block marginBottom={'5px'}>
            <span
              className={css({
                fontWeight: 'bold',
              })}
            >
              {t('Preparation')}
            </span>
          </Block>
          <div
            className='quill-desc'
            dangerouslySetInnerHTML={{ __html: recipeDetail.description }}
          />
        </>
      )}
    </div>
  );
};
