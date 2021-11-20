import React, { Fragment, useEffect } from 'react';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { useField, Formik, FormikProps, Form } from 'formik';
import { useStyletron } from 'baseui';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Button } from 'baseui/button';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { loginUser, authSelector, clearState } from './authSlice';
import { AuthPayloadData } from './types';
import { Redirect } from 'react-router';

const initialValues: AuthPayloadData = {
  username: '',
  password: '',
};

interface IFormFieldProps {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  clearOnEscape: boolean;
}

const FormInput = (props: IFormFieldProps) => {
  const [css] = useStyletron();
  const [field, meta] = useField(props);
  return (
    <>
      <Input {...field} {...props} />
      {meta.touched && meta.error ? (
        <div
          className={css({
            color: 'red',
          })}
        >
          {meta.error}
        </div>
      ) : null}
    </>
  );
};

const Login = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const [css] = useStyletron();
  const { isSuccess, isError, errorMessage, isAuthenticated } =
    useAppSelector(authSelector);
  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);
  useEffect(() => {
    if (isError) {
      toast.error(t(errorMessage));
      dispatch(clearState());
    }
    if (isSuccess) {
      dispatch(clearState());
      history.push('/recipes');
    }
  }, [isError, isSuccess]);
  if (isAuthenticated) {
    return <Redirect to='/recipes' />;
  }
  return (
    <div
      className={css({
        maxWidth: '400px',
        margin: 'auto',
      })}
    >
      <h2>{t('Sign in to see recipes')}</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={yup.object({
          username: yup.string().required(t('Username is required')),
          password: yup
            .string()
            .min(8, t('Password should be of minimum 8 characters length'))
            .required(t('Password is required')),
        })}
        onSubmit={(values) => {
          dispatch(loginUser(values));
        }}
      >
        {(props: FormikProps<AuthPayloadData>) => (
          <Form>
            <FormControl label={() => t('Username')}>
              <FormInput
                id='username'
                name='username'
                type='text'
                placeholder={t('Username')}
                clearOnEscape
              />
            </FormControl>
            <FormControl label={() => t('Password')}>
              <FormInput
                id='password'
                name='password'
                type='password'
                placeholder={t('Password')}
                clearOnEscape
              />
            </FormControl>
            <Button type='submit'>{t('Log In')}</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default Login;
