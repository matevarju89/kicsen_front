import { useState, useEffect, useReducer, createContext } from 'react';
import axios from 'axios';
import { Formik, FormikProps, Form } from 'formik';
import * as yup from 'yup';
import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { FileUploader } from 'baseui/file-uploader';
import { StyledLink } from 'baseui/link';
import FormInput from '../common/FormInput';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useTranslation } from 'react-i18next';
import SelectInput from '../common/SelectInput';
import IngredientInputGroup from '../common/IngredientInputGroup';
import { userSelector } from '../user/userSlice';
import {
  clearSmartTagListState,
  loadAllSmartTags,
  smartTagSelector,
  uploadSmartTags,
} from '../smartTag/smartTagSlice';
import { addRecipe } from '../recipes/recipeSlice';
import ImageUploadService from '../images/uploadAPI';
import UploadModal from '../common/UploadModal';
import QuillEditor from '../common/QuillEditor';
import { SmartTagData } from '../smartTag/types';
import NoEdit from './NoEdit';
import { useHistory } from 'react-router-dom';
import NumberInput from '../common/NumberInput';

export type RecipePayloadData = {
  category1: 'appetizer' | 'soup' | 'main' | 'dessert';
  category2: 'salty' | 'sweet';
  category3: 'vegan' | 'nonvegan';
  category4?: Array<
    'chicken' | 'seafood' | 'beef' | 'veal' | 'lamb' | 'vegetable' | 'fruit'
  >;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: string;
  title: string;
  family: { id: string };
  forHowMany: number | null;
  smartTags?:
    | Array<string>
    | { connect: Array<{ id: string }> }
    | { set: Array<{ id: string }> };
  images?:
    | Array<string>
    | { connect: Array<{ id: string }> }
    | { set: Array<{ id: string }> };
};

const initialValues: RecipePayloadData = {
  category1: '' as RecipePayloadData['category1'],
  category2: '' as RecipePayloadData['category2'],
  category3: '' as RecipePayloadData['category3'],
  category4: [],
  description: '',
  difficulty: '' as RecipePayloadData['difficulty'],
  //images: [],
  ingredients: '',
  title: '',
  family: { id: '' },
  smartTags: [],
  images: [],
  forHowMany: null,
};
export interface IUploadState {
  isUploadModalShown: boolean;
  smartTagUpload: boolean;
  imageUpload: boolean;
  isSmartTagLoading: boolean;
  isImageLoading: boolean;
  isRecipeLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}
export const initialUploadState: IUploadState = {
  isUploadModalShown: false,
  smartTagUpload: false,
  imageUpload: false,
  isSmartTagLoading: false,
  isImageLoading: false,
  isRecipeLoading: false,
  isError: false,
  isSuccess: false,
};

interface IUploadContext {
  uploadState: any;
  dispatchUpload: any;
}
export const UploadContextDefaults: IUploadContext = {
  uploadState: undefined,
  dispatchUpload: undefined,
};
export const UploadContext = createContext(UploadContextDefaults);

export const uploadReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'showUpload':
      return { ...state, isUploadModalShown: true };
    case 'hideUpload':
      return {
        ...state,
        isUploadModalShown: false,
        smartTagUpload: false,
        imageUpload: false,
        isSmartTagLoading: false,
        isImageLoading: false,
        isRecipeLoading: false,
        isError: false,
        isSuccess: false,
      };
    case 'addSmartTagUpload':
      return { ...state, smartTagUpload: true };
    case 'removeSmartTagUpload':
      return { ...state, smartTagUpload: false };
    case 'addImageUpload':
      return { ...state, imageUpload: true };
    case 'removeImageUpload':
      return { ...state, imageUpload: false };
    case 'initiateSmartTagUpload':
      return {
        ...state,
        isSmartTagLoading: true,
      };
    case 'initiateImageUpload':
      return { ...state, isImageLoading: true, isSmartTagLoading: false };
    case 'initiateRecipeUpload':
      return {
        ...state,
        isRecipeLoading: true,
        isImageLoading: false,
        isSmartTagLoading: false,
      };
    case 'set_success':
      return {
        ...state,
        isRecipeLoading: false,
        isImageLoading: false,
        isSmartTagLoading: false,
        isSuccess: true,
      };
    case 'set_error':
      return {
        ...state,
        isRecipeLoading: false,
        isImageLoading: false,
        isSmartTagLoading: false,
        isError: true,
      };
    case 'set_multiple':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export const addSmartTags = async (
  values: any,
  uploadState: any,
  dispatch: any,
  dispatchUpload: any,
  smartTagList: Array<SmartTagData>,
  lang: any,
  addedImage: any,
  familyId: string
) => {
  let smartTagUploadIDs: Array<{ id: string }> = [];
  const smartTagOptions = smartTagList.map((smartTag) => {
    return {
      label: smartTag.name,
      smartTags: smartTag.name,
    };
  });
  if (Array.isArray(values.smartTags) && values?.smartTags?.length) {
    dispatchUpload({
      type: 'set_multiple',
      payload: { smartTagUpload: true, isSmartTagLoading: true },
    });
  }

  if (addedImage) {
    dispatchUpload({
      type: 'addImageUpload',
    });
  }
  dispatchUpload({ type: 'showUpload' });
  if (Array.isArray(values.smartTags) && values?.smartTags?.length) {
    const originalTagNameArray: string[] = smartTagOptions.map(
      (smartTag: any) => {
        return smartTag.label;
      }
    );
    const smartTagsToUpload = values.smartTags.filter((tag: any) => {
      return originalTagNameArray.indexOf(tag) < 0;
    });
    const smartTagObjectsToUpload = smartTagsToUpload.map((tag: any) => {
      return {
        name: tag.charAt(0).toUpperCase() + tag.slice(1),
        lang: lang,
        familyId: familyId,
      };
    });
    if (smartTagsToUpload.length) {
      dispatchUpload({
        type: 'set_multiple',
        payload: { smartTagUpload: true, isSmartTagLoading: true },
      });
      const smartTagUploadResponse = await dispatch(
        uploadSmartTags(smartTagObjectsToUpload)
      );
      if (smartTagUploadResponse.type.includes('rejected')) {
        dispatchUpload({
          type: 'set_error',
        });
        return false;
      }
      const getFreshSmartTagResponse = await dispatch(
        loadAllSmartTags(familyId)
      );
      if (Array.isArray(getFreshSmartTagResponse.payload)) {
        const smartTagList_fresh = getFreshSmartTagResponse.payload;
        smartTagUploadIDs = smartTagList_fresh
          .filter((tag: any) => {
            return (values.smartTags as Array<any>).includes(tag.name);
          })
          .map((tag: any) => {
            return { id: tag.id };
          });
      }
    } else {
      smartTagUploadIDs = smartTagList
        .filter((tag: any) => {
          return (values.smartTags as Array<any>).includes(tag.name);
        })
        .map((tag: any) => {
          return { id: tag.id };
        });
    }
  }
  return smartTagUploadIDs;
};

export const addImage = async (
  values: any,
  addedImage: any,
  dispatchUpload: any
) => {
  if (addedImage) {
    const formData = new FormData();
    formData.append('file', addedImage);
    const user = JSON.parse(localStorage.getItem('user') || '');
    try {
      const cloudinaryResponse = await axios.post(
        'http://localhost:3000/api/images/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + user.token,
          },
        }
      );
      const url = cloudinaryResponse.data.url;
      const createResponse = await ImageUploadService.create({ url: url });
      return [{ id: createResponse.data.id }];
    } catch (err) {
      dispatchUpload({ type: 'set_error' });
      return false;
    }
  } else {
    return [];
  }
};

const RecipeAdd = () => {
  const dispatch = useAppDispatch();
  const [t] = useTranslation();
  const [css] = useStyletron();
  const [imgErrorMessage, setImgErrorMessage] = useState('');
  const [imageAdded, setImageAdded] = useState<boolean>(false);
  const { smartTagList } = useAppSelector(smartTagSelector);
  const { families, lang, ownFamily } = useAppSelector(userSelector);
  const history = useHistory();
  const [uploadState, dispatchUpload] = useReducer(
    uploadReducer,
    initialUploadState
  );
  const [addedImage, setAddedImage] = useState<any>(null);
  const contextValue = { uploadState, dispatchUpload };
  useEffect(() => {
    if (ownFamily) {
      dispatch(loadAllSmartTags(ownFamily.id));
      return () => {
        dispatch(clearSmartTagListState());
      };
    }
  }, [ownFamily]);

  const smartTagOptions = smartTagList.map((smartTag) => {
    return {
      label: smartTag.name,
      smartTags: smartTag.name,
    };
  });
  return (
    <NoEdit>
      <UploadContext.Provider value={contextValue}>
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
            difficulty: yup
              .mixed()
              .oneOf(['easy', 'medium', 'hard'])
              .required(t('Choosing difficulty is required')),
            description: yup
              .string()
              .max(500, t('Description should be max 500 characters'))
              .required(t('Description is required')),
            forHowMany: yup.number(),
            ingredients: yup.string().required(t('Ingredients are required')),
          })}
          onSubmit={async (values, actions) => {
            if (ownFamily) {
              values.family = { id: ownFamily.id };
              let image: any = [];
              const smartTagUploadIDs = await addSmartTags(
                values,
                uploadState,
                dispatch,
                dispatchUpload,
                smartTagList,
                lang,
                addedImage,
                ownFamily.id
              );
              if (!Array.isArray(smartTagUploadIDs)) return false;
              setTimeout(async function () {
                if (!uploadState.isError) {
                  if (addedImage) {
                    dispatchUpload({
                      type: 'initiateImageUpload',
                    });
                    image = await addImage(values, addedImage, dispatchUpload);
                    if (!Array.isArray(image)) return false;
                  }
                  setTimeout(async function () {
                    if (!uploadState.isError) {
                      dispatchUpload({
                        type: 'initiateRecipeUpload',
                      });
                      try {
                        const result = await dispatch(
                          addRecipe({
                            ...values,
                            smartTags: { connect: smartTagUploadIDs || [] },
                            images: { connect: image },
                          })
                        );
                        if (!result.type.includes('rejected')) {
                          setTimeout(() => {
                            dispatchUpload({ type: 'set_success' });
                          }, 1000);
                          setTimeout(() => {
                            history.push(`/recipes/all`);
                          }, 2000);
                        } else {
                          setTimeout(() => {
                            dispatchUpload({ type: 'set_error' });
                          }, 1000);
                        }
                      } catch (e) {
                        setTimeout(() => {
                          dispatchUpload({ type: 'set_error' });
                        }, 1000);
                      }
                    }
                  }, 1000);
                }
              }, 1000);
            } else {
              alert('Error: Family is not detectable');
            }
          }}
        >
          {(props: FormikProps<RecipePayloadData>) => (
            <Form>
              <p
                className={css({
                  fontWeight: 'bold',
                })}
              >
                {t('Add the basic information about the recipe!')}
              </p>
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
              {/*<SelectInput
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
            />*/}
              <SelectInput
                name='smartTags'
                creatable
                maxDropdownHeight='200px'
                options={smartTagOptions}
                placeholder={t('Select smart tags (optional)')}
                valueKey='smartTags'
                multi={true}
              />
              <SelectInput
                name='difficulty'
                options={[
                  { label: t('easy'), difficulty: 'easy' },
                  { label: t('medium'), difficulty: 'medium' },
                  { label: t('hard'), difficulty: 'hard' },
                ]}
                placeholder={t('Choose difficulty')}
                valueKey='difficulty'
                multi={false}
              />
              <NumberInput
                id='forHowMany'
                name='forHowMany'
                placeholder={t('For how many servings? (optional)')}
                clearOnEscape
                overrides={{ Root: { style: { marginTop: '20px' } } }}
              />
              <p
                className={css({
                  fontWeight: 'bold',
                  marginTop: '30px',
                })}
              >
                {t('What are the ingredients?')}
              </p>
              <IngredientInputGroup name='ingredients' />
              <p
                className={css({
                  fontWeight: 'bold',
                  marginTop: '30px',
                })}
              >
                {t('How is it made?')}
              </p>
              <QuillEditor id='description' name='description' />
              <p
                className={css({
                  fontWeight: 'bold',
                  marginTop: '30px',
                })}
              >
                {t('Upload a photo (optional, max 1 MB)')}
              </p>
              <FileUploader
                errorMessage={imgErrorMessage}
                maxSize={1000000}
                accept='.png, .jpg, .jpeg'
                onDropRejected={() => {
                  setImgErrorMessage(
                    t('Incorrect File Type(jpeg,jpg,png) or Size(max 1MB)')
                  );
                }}
                onRetry={() => {
                  setImgErrorMessage('');
                }}
                onDropAccepted={async (acceptedFiles, rejectedFiles) => {
                  setAddedImage(acceptedFiles[0]);
                  setImageAdded(true);
                }}
                progressMessage={
                  imageAdded ? (
                    <StyledLink href=''>{t('Image added')}</StyledLink>
                  ) : (
                    ''
                  )
                }
                onCancel={() => {
                  setAddedImage(null);
                  setImageAdded(false);
                }}
                overrides={{
                  Root: {
                    style: {
                      marginTop: '20px',
                    },
                  },
                  Spinner: {
                    style: {
                      display: 'none',
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
        {uploadState.isUploadModalShown && <UploadModal />}
      </UploadContext.Provider>
    </NoEdit>
  );
};

export default RecipeAdd;
