import { useState } from 'react';
import { styled, useStyletron } from 'baseui';
import { useTranslation } from 'react-i18next';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Block } from 'baseui/block';
import { Skeleton } from 'baseui/skeleton';
import { Button } from 'baseui/button';
import { RecipeData } from './types';

interface IRecipeCardProps {
  recipe: RecipeData;
}

const RecipeDifficulty = styled('span', ({ $theme }) => ({
  ...$theme.typography.font150,
  [$theme.mediaQuery.small]: {
    ...$theme.typography.font250,
  },
  [$theme.mediaQuery.large]: {
    ...$theme.typography.font350,
  },
}));

const RecipeCard = ({ recipe }: IRecipeCardProps) => {
  const [css] = useStyletron();
  const [t] = useTranslation();
  const history = useHistory();
  const { path } = useRouteMatch();
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <Block
      overrides={{
        Block: {
          style: {
            borderRadius: '12px',
            border: '2px solid rgb(226, 226, 226)',
          },
        },
      }}
    >
      <Block width='100%'>
        {!imageLoaded && (
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
                },
              },
            }}
          ></Skeleton>
        )}
        <img
          className={css({
            width: '100%',
            height: '190px',
            objectFit: 'cover',
          })}
          alt=''
          onLoad={() => {
            setImageLoaded(true);
          }}
          src='/food_placeholder.png'
        />
      </Block>
      <div className={css({ padding: '15px' })}>
        <h2
          className={css({
            margin: '10px 0',
            fontSize: '20px',
          })}
        >
          {recipe.title}
        </h2>
        <RecipeDifficulty
          className={css({
            margin: '0 0 10px 0',
            display: 'block',
          })}
        >{`${t('Difficulty')}: ${t(
          recipe.difficulty || 'N/a'
        )}`}</RecipeDifficulty>
        <Button
          overrides={{
            BaseButton: { style: { width: '100%' } },
          }}
          onClick={() => history.push(`${path}/detail/${recipe.id}`)}
        >
          {t('Read more')}
        </Button>
      </div>
    </Block>
  );
};

export default RecipeCard;
