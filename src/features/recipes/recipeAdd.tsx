import { useState, useRef } from 'react';
import {
  Formik,
  FormikProps,
  Form,
  useFormik,
  useField,
  FieldHookConfig,
} from 'formik';
import * as yup from 'yup';
import { useStyletron } from 'baseui';
import { FormControl } from 'baseui/form-control';
import { Button } from 'baseui/button';
import { Select, Value } from 'baseui/select';
import { FileUploader } from 'baseui/file-uploader';
import FormInput from '../common/FormInput';
import { RecipeData, RecipeImage } from './types';
import { useAppDispatch } from '../../app/hooks';
import { useTranslation } from 'react-i18next';
import SelectInput from '../common/SelectInput';
import TextArea from '../common/TextArea';
import IngredientInputGroup from '../common/IngredientInputGroup';

type RecipePayloadData = {
  category1: 'appetizer' | 'soup' | 'main' | 'dessert';
  category2: 'salty' | 'sweet';
  category3: 'vegan' | 'nonvegan';
  category4?: Array<
    'chicken' | 'seafood' | 'beef' | 'veal' | 'lamb' | 'vegetable' | 'fruit'
  >;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  images?: Array<RecipeImage>;
  ingredients: string;
  title: string;
};

const initialValues: RecipePayloadData = {
  category1: '' as RecipePayloadData['category1'],
  category2: '' as RecipePayloadData['category2'],
  category3: '' as RecipePayloadData['category3'],
  category4: [],
  description: '',
  difficulty: '' as RecipePayloadData['difficulty'],
  images: [],
  ingredients: '',
  title: '',
};

const RecipeAdd = () => {
  const dispatch = useAppDispatch();
  const [t] = useTranslation();
  const [cat1Value, setCat1Value] = useState<Value>([]);
  const [imgErrorMessage, setImgErrorMessage] = useState('');
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yup.object({
        title: yup.string().required(t('The name of the dish is required')),
        category1: yup
          .mixed()
          .oneOf(['appetizer', 'soup', 'main', 'dessert'])
          .required(t('Course type is required')),
        category2: yup
          .mixed()
          .oneOf(['salty', 'sweet'])
          .required(t('Choosing category is required')),
        category3: yup
          .mixed()
          .oneOf(['vegan', 'nonvegan'])
          .required(t('Choosing category is required')),
        category4: yup
          .array()
          .of(
            yup
              .mixed()
              .oneOf([
                'chicken',
                'seafood',
                'beef',
                'veal',
                'lamb',
                'vegetable',
                'fruit',
              ])
          ),
        description: yup
          .string()
          .max(500, t('Description should be max 500 characters'))
          .required(t('Description is required')),
        ingredients: yup.string().required(t('Ingredients are required')),
      })}
      onSubmit={(values, actions) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
        }, 1000);
      }}
    >
      {(props: FormikProps<RecipePayloadData>) => (
        <Form>
          <FormInput
            id='title'
            name='title'
            type='text'
            placeholder={t('Add the name of the dish')}
            clearOnEscape
          />
          <SelectInput
            name='category1'
            options={[
              { label: t('Appetizer'), category1: 'appetizer' },
              { label: t('Soup'), category1: 'soup' },
              { label: t('Main'), category1: 'main' },
              { label: t('Dessert'), category1: 'dessert' },
            ]}
            placeholder={t('Choose course type')}
            valueKey='category1'
            multi={false}
          />
          <SelectInput
            name='category2'
            options={[
              { label: t('Salty'), category2: 'salty' },
              { label: t('Sweet'), category2: 'sweet' },
            ]}
            placeholder={t('Choose salty or sweet')}
            valueKey='category2'
            multi={false}
          />
          <SelectInput
            name='category3'
            options={[
              { label: t('Vegan'), category3: 'vegan' },
              { label: t('Non-Vegan'), category3: 'nonvegan' },
            ]}
            placeholder={t('Choose vegan or non-vegan')}
            valueKey='category3'
            multi={false}
          />
          <SelectInput
            name='category4'
            options={[
              { label: t('Chicken'), category4: 'chicken' },
              { label: t('Seafood'), category4: 'seafood' },
              { label: t('Beef'), category4: 'beef' },
              { label: t('Veal'), category4: 'veal' },
              { label: t('Lamb'), category4: 'lamb' },
              { label: t('Vegetable'), category4: 'vegetable' },
              { label: t('Fruit'), category4: 'fruit' },
            ]}
            placeholder={t('Choose type tags')}
            valueKey='category4'
            multi={true}
          />
          <TextArea
            placeholder={t('Add preparation instructions')}
            id='description'
            name='description'
            clearOnEscape={false}
          />
          <IngredientInputGroup name='ingredients' />
          <FileUploader
            errorMessage={imgErrorMessage}
            overrides={{
              Root: {
                style: {
                  marginTop: '20px',
                },
              },
            }}
          />
          <Button
            type='submit'
            overrides={{
              BaseButton: {
                style: {
                  marginTop: '30px',
                },
              },
            }}
          >
            {t('Upload Recipe')}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default RecipeAdd;
