import { useState } from 'react';
import { styled, useStyletron } from 'baseui';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Block } from 'baseui/block';
import { Skeleton } from 'baseui/skeleton';
import { Button } from 'baseui/button';
import { RecipeData } from './types';

interface IRecipeCardProps {
  recipe?: RecipeData;
  recipeLoading?: boolean;
}

const RecipeDifficulty = styled('span', ({ $theme }) => ({
  margin: '0 0 10px 0',
  display: 'block',
  fontSize: '12px',
  lineHeight: '14px',
  [$theme.mediaQuery.medium]: {
    fontSize: '14px',
    lineHeight: '16px',
  },
  [$theme.mediaQuery.large]: {
    fontSize: '16px',
    lineHeight: '18px',
  },
}));

const showSkeleton = false;
const RecipeCard = ({ recipe, recipeLoading }: IRecipeCardProps) => {
  const [css, theme] = useStyletron();
  const [t] = useTranslation();
  const history = useHistory();
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <Block
      overrides={{
        Block: {
          style: {
            borderRadius: '12px',
            border: '2px solid rgb(226, 226, 226)',
            position: 'relative',
            overflow: 'hidden',
          },
        },
      }}
    >
      <Block width='100%'>
        {(!imageLoaded || recipeLoading || showSkeleton) && (
          <Skeleton
            width='100%'
            height='190px'
            animation
            overrides={{
              Root: {
                style: {
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '120px',
                  [theme.mediaQuery.medium]: {
                    height: '150px',
                  },
                  [theme.mediaQuery.large]: {
                    height: '190px',
                  },
                },
              },
            }}
          ></Skeleton>
        )}
        <img
          className={css({
            width: '100%',
            height: '120px',
            [theme.mediaQuery.medium]: {
              height: '150px',
            },
            [theme.mediaQuery.large]: {
              height: '190px',
            },
            objectFit: 'cover',
          })}
          alt=''
          onLoad={() => {
            setImageLoaded(true);
          }}
          src={
            recipe?.images && recipe.images.length && recipe.images[0].url
              ? recipe.images[0].url
              : '/food_placeholder.png'
          }
        />
      </Block>
      <div className={css({ padding: '15px' })}>
        <h2
          className={css({
            margin: '10px 0 0',
            fontSize: '15px',
            lineHeight: '18px',
            height: '36px',

            [theme.mediaQuery.medium]: {
              fontSize: '2vw',
              lineHeight: '2.2vw',
              height: 'auto',
              marginBottom: '10px',
            },
            [theme.mediaQuery.large]: {
              fontSize: '20px',
              lineHeight: '24px',
            },
          })}
        >
          {!recipeLoading && recipe && !showSkeleton ? (
            <>{recipe.title}</>
          ) : (
            <Skeleton height='27px' width='60px' />
          )}
        </h2>
        <RecipeDifficulty className={css({})}>
          {!recipeLoading && recipe && !showSkeleton ? (
            <>{`${t('Difficulty')}: ${t(recipe.difficulty || 'N/a')}`}</>
          ) : (
            <Skeleton height='20px' width='120px' />
          )}
        </RecipeDifficulty>
        {!recipeLoading && recipe && !showSkeleton ? (
          <Button
            overrides={{
              BaseButton: {
                style: {
                  width: '100%',
                  fontSize: '14px',
                  lineHeight: '16px',
                  [theme.mediaQuery.large]: {
                    fontSize: '16px',
                    lineHeight: '18px',
                  },
                },
              },
            }}
            onClick={() => history.push(`/recipes/detail/${recipe.id}`)}
          >
            {t('Read more')}
          </Button>
        ) : (
          <Skeleton width='100%' height='44px' />
        )}
      </div>
    </Block>
  );
};

export default RecipeCard;
