import { useEffect, useState } from 'react';
import { useStyletron } from 'baseui';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  recipeSelector,
  loadRecipe,
  clearRecipeDetailState,
} from './recipeSlice';
import { useParams } from 'react-router-dom';
import { Skeleton } from 'baseui/skeleton';

export const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { recipeDetail, recipeDetailError, recipeDetailLoading } =
    useAppSelector(recipeSelector);
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
            style={imageLoaded ? { marginBottom: '30px' } : { display: 'none' }}
            src='/food_placeholder.png'
          />
          <h2>{recipeDetail.title}</h2>
        </>
      )}
    </div>
  );
};
