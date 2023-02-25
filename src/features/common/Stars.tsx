import { useField } from 'formik';
import { useStyletron } from 'baseui';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';

export const FullStar = (props: { value: number; onClick: () => void }) => {
  const [css] = useStyletron();
  return (
    <span
      onClick={props.onClick}
      data-value={props.value}
      className={css({ fontSize: '30px', cursor: 'pointer' })}
    >
      &#9733;
    </span>
  );
};
export const HalfStar = (props: { value: number; onClick: () => void }) => {
  const [css] = useStyletron();
  return (
    <span
      onClick={props.onClick}
      data-value={props.value}
      className={css({ fontSize: '30px', cursor: 'pointer' })}
    >
      &#9734;
    </span>
  );
};

const Stars = (props: {
  starValue: number;
  setStarValue: (val: number) => void;
  name: string;
  validationMethod: (val: boolean) => void;
  errorHandler: Dispatch<SetStateAction<boolean>>;
}) => {
  const [, , helpers] = useField(props);
  return (
    <div>
      {Array.from(Array(5).keys()).map((current) => {
        if (props.starValue && current < props.starValue) {
          return (
            <FullStar
              value={current + 1}
              key={current}
              onClick={() => {
                props.errorHandler(false);
                props.setStarValue(current + 1);
                helpers.setValue(current + 1);
                props.validationMethod(false);
              }}
            />
          );
        } else {
          return (
            <HalfStar
              value={current + 1}
              key={current}
              onClick={() => {
                props.errorHandler(false);
                props.setStarValue(current + 1);
                helpers.setValue(current + 1);
                props.validationMethod(false);
              }}
            />
          );
        }
      })}
    </div>
  );
};

export default Stars;
