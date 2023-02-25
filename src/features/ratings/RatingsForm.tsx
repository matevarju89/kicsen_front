import { Formik, FormikProps, Form, useField } from 'formik';
import * as yup from 'yup';
import TextArea from '../common/TextArea';
import { RatingDao } from './types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useStyletron } from 'baseui';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Button, KIND, SHAPE, SIZE } from 'baseui/button';
import Stars from '../common/Stars';
import { userSelector } from '../user/userSlice';
import ratingsApi from './ratingsApi';

const initialValues: RatingDao = {
  comment: '',
  postedBy: { id: '' },
  recipe: { id: '' },
  stars: 0,
};

const RatingsForm = () => {
  const { id: recipeid } = useParams<{ id: string }>();
  const [t] = useTranslation();
  const [css, theme] = useStyletron();
  const { id: userid } = useAppSelector(userSelector);
  //const [sliderValue, setSliderValue] = useState([0]);
  const [starValue, setStarValue] = useState(0);
  const [validationError, setValidationError] = useState(false);
  const [sendError, setSendError] = useState(false);
  const history = useHistory();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yup.object({
        comment: yup.string().max(256, t('The comment is too long')),
        stars: yup.number().required('The star rating is required'),
      })}
      onSubmit={async (values, actions) => {
        if (!values.stars) {
          setValidationError(true);
          return false;
        } else {
          values.recipe = { id: recipeid };
          values.postedBy = { id: userid };
          const result = await ratingsApi.create(values);
          if (result.status === 201) {
            history.go(0);
          } else {
            setSendError(true);
          }
        }
      }}
    >
      {(props: FormikProps<RatingDao>) => (
        <Form>
          <div
            className={css({
              width: '100%',
              [theme.mediaQuery.medium]: { width: '350px' },
            })}
          >
            <TextArea
              id='comment'
              name='comment'
              placeholder={t('Write your comment here')}
              onClick={() => {
                setSendError(false);
              }}
            ></TextArea>
            <div
              className={css({
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '10px',
              })}
            >
              <Stars
                starValue={starValue}
                setStarValue={setStarValue}
                name='stars'
                validationMethod={setValidationError}
                errorHandler={setSendError}
              />
              <Button kind={KIND.secondary} shape={SHAPE.pill} size={SIZE.mini}>
                {t('Add rating')}
              </Button>
            </div>
            {validationError && (
              <p className={css({ color: 'red', marginTop: '5px' })}>
                {t('The star rating is required')}
              </p>
            )}
            {sendError && (
              <p className={css({ color: 'red', marginTop: '5px' })}>
                {t('Sending failed')}
              </p>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RatingsForm;
