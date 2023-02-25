import { RatingData } from '../recipes/types';
import { useStyletron } from 'baseui';

const RatingItem = (props: { rating: RatingData }) => {
  const [css, theme] = useStyletron();
  return (
    <div
      className={css({
        width: '100%',
        marginBottom: '10px',
        [theme.mediaQuery.medium]: {
          width: '350px',
        },
      })}
    >
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '15px',
        })}
      >
        <span className={css({ color: theme.colors.mono700 })}>
          {props.rating.postedBy?.firstName} {props.rating.postedBy?.lastName}
        </span>
        <span
          className={css({ fontStyle: 'italic', color: theme.colors.mono700 })}
        >
          {new Date(props.rating.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div
        className={css({
          marginBottom: '15px',
          display: 'flex',
          justifyContent: 'space-between',
        })}
      >
        <div
          className={css({
            paddingRight: '10px',
          })}
        >
          {props.rating.comment}
        </div>
        <div>{props.rating.stars} &#9733;</div>
      </div>
    </div>
  );
};

export default RatingItem;
