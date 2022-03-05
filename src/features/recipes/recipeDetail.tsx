import React, { useEffect, useState } from 'react';
import { useStyletron } from 'baseui';
import { useTranslation } from 'react-i18next';
import { Block } from 'baseui/block';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  recipeSelector,
  loadRecipe,
  clearRecipeDetailState,
} from './recipeSlice';
import { useParams } from 'react-router-dom';
import { Skeleton } from 'baseui/skeleton';

const CategoryTag = ({ children }: { children: React.ReactNode }) => {
  const [css] = useStyletron();
  return (
    <span
      className={css({
        padding: '5px 15px',
        border: '1px solid #000',
        borderRadius: '20px',
        marginRight: '15px',
      })}
    >
      {children}
    </span>
  );
};

export const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { recipeDetail, recipeDetailError, recipeDetailLoading } =
    useAppSelector(recipeSelector);
  const [t] = useTranslation();
  const [css] = useStyletron();
  const [imageLoaded, setImageLoaded] = useState(false);
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
          <Skeleton width='500px' height='500px' animation />
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
          {!imageLoaded && <Skeleton width='500px' height='500px' animation />}
          <img
            width={'500px'}
            alt='food'
            onLoad={() => {
              setImageLoaded(true);
            }}
            style={imageLoaded ? { marginBottom: '10px' } : { display: 'none' }}
            src='/food_placeholder.png'
          />
          <Block display='flex' marginBottom='40px'>
            <CategoryTag>
              {recipeDetail.category1 && t(recipeDetail.category1)}
            </CategoryTag>
            <CategoryTag>
              {recipeDetail.category2 && t(recipeDetail.category2)}
            </CategoryTag>
            <CategoryTag>
              {recipeDetail.category3 && t(recipeDetail.category3)}
            </CategoryTag>
            {recipeDetail.category4 &&
              recipeDetail.category4.map((category) => {
                return <CategoryTag>{category}</CategoryTag>;
              })}
          </Block>
          <h2
            className={css({
              marginBottom: '10px',
            })}
          >
            {recipeDetail.title}
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
          <p>{recipeDetail.description}</p>
        </>
      )}
    </div>
  );
};
