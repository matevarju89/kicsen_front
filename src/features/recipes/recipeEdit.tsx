import { useState, useEffect, useReducer } from 'react';
import { Formik, FormikProps, Form } from 'formik';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import { useStyletron } from 'baseui';
import { useHistory, useParams } from 'react-router-dom';
import { Button } from 'baseui/button';
import { StyledLink } from 'baseui/link';
import { FileUploader } from 'baseui/file-uploader';
import FormInput from '../common/FormInput';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useTranslation } from 'react-i18next';
import SelectInput from '../common/SelectInput';
import IngredientInputGroup from '../common/IngredientInputGroup';
import { userSelector } from '../user/userSlice';
import NumberInput from '../common/NumberInput';
import {
  clearRecipeDetailState,
  loadRecipe,
  recipeSelector,
  updateRecipe,
} from '../recipes/recipeSlice';
import { RecipePayloadData } from './recipeAdd';
import {
  clearSmartTagListState,
  loadAllSmartTags,
  smartTagSelector,
} from '../smartTag/smartTagSlice';
import {
  UploadContext,
  uploadReducer,
  addSmartTags,
  addImage,
  initialUploadState,
} from './recipeAdd';
import UploadModal from '../common/UploadModal';
import QuillEditor from '../common/QuillEditor';
import NoEdit from './NoEdit';

const RecipeEdit = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [t] = useTranslation();
  const [css] = useStyletron();
  const [imgErrorMessage, setImgErrorMessage] = useState('');
  const { families, lang, ownFamily } = useAppSelector(userSelector);
  const { recipeDetail } = useAppSelector(recipeSelector);
  const { smartTagList } = useAppSelector(smartTagSelector);
  const [uploadState, dispatchUpload] = useReducer(
    uploadReducer,
    initialUploadState
  );
  const [addedImage, setAddedImage] = useState<any>(null);
  const contextValue = { uploadState, dispatchUpload };
  const [imageAdded, setImageAdded] = useState<boolean>(
    Array.isArray(recipeDetail?.images) ? !!recipeDetail?.images.length : false
  );

  useEffect(() => {
    if (ownFamily) {
      //const q_lang = lang.charAt(0).toUpperCase() + lang.slice(1);
      //dispatch(loadAllSmartTagsByLang(q_lang));
      dispatch(loadAllSmartTags(ownFamily.id));
      return () => {
        dispatch(clearSmartTagListState());
      };
    }
  }, [ownFamily]);

  useEffect(() => {
    dispatch(loadRecipe(id));
    return () => {
      dispatch(clearRecipeDetailState());
    };
  }, [id]);

  const smartTagOptions = smartTagList.map((smartTag) => {
    return {
      label: smartTag.name,
      smartTags: smartTag.name,
    };
  });

  const initialValues: RecipePayloadData = {
    category1: recipeDetail?.category1
      ? recipeDetail.category1
      : ('' as RecipePayloadData['category1']),
    category2: recipeDetail?.category2
      ? recipeDetail.category2
      : ('' as RecipePayloadData['category2']),
    category3: recipeDetail?.category3
      ? recipeDetail.category3
      : ('' as RecipePayloadData['category3']),
    category4: recipeDetail?.category4 ? recipeDetail.category4 : [],
    description: recipeDetail?.description ? recipeDetail.description : '',
    smartTags: (recipeDetail?.smartTags || []).map((smartTag) => {
      return smartTag.name;
    }),
    difficulty: recipeDetail?.difficulty
      ? recipeDetail.difficulty
      : ('' as RecipePayloadData['difficulty']),
    images: [],
    ingredients: recipeDetail?.ingredients ? recipeDetail.ingredients : '',
    title: recipeDetail?.title ? recipeDetail.title : '',
    family: recipeDetail?.family ? recipeDetail.family : { id: '' },
    forHowMany: recipeDetail?.forHowMany ? recipeDetail.forHowMany : 0,
  };
  return (
    <NoEdit>
      <UploadContext.Provider value={contextValue}>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
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
            difficulty: yup
              .mixed()
              .oneOf(['easy', 'medium', 'hard'])
              .required(t('Choosing difficulty is required')),
            description: yup
              .string()
              .max(10000, t('Description should be max 1000 characters'))
              .required(t('Description is required')),
            //forHowMany: yup.number(),
            ingredients: yup.string().required(t('Ingredients are required')),
          })}
          onSubmit={(values, actions) => {
            setTimeout(async () => {
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
                      image = await addImage(
                        values,
                        addedImage,
                        dispatchUpload
                      );
                      if (!Array.isArray(image)) return false;
                    } else if (
                      Array.isArray(recipeDetail?.images) &&
                      recipeDetail?.images.length
                    ) {
                      image = [{ id: recipeDetail.images[0].id }];
                    }
                    setTimeout(async function () {
                      if (!uploadState.isError) {
                        dispatchUpload({
                          type: 'initiateRecipeUpload',
                        });
                        try {
                          const result = await dispatch(
                            updateRecipe({
                              recipe: {
                                ...values,
                                smartTags: { set: smartTagUploadIDs || [] },
                                images: { set: image },
                              },
                              id,
                            })
                          );
                          if (!result.type.includes('rejected')) {
                            setTimeout(() => {
                              dispatchUpload({ type: 'set_success' });
                            }, 1000);
                            setTimeout(() => {
                              history.push(`/recipes/detail/${id}`);
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
                toast.error(t('Error: Family is not detectable'));
              }
            }, 1000);
          }}
        >
          {(props: FormikProps<RecipePayloadData>) => {
            return (
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
                  initialValue={initialValues.category1}
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
                  initialValue={initialValues.category2}
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
                  initialValue={initialValues.category3}
                  options={[
                    { label: t('Vegan'), category3: 'vegan' },
                    { label: t('Non-Vegan'), category3: 'nonvegan' },
                  ]}
                  placeholder={t('Choose vegan or non-vegan')}
                  valueKey='category3'
                  multi={false}
                />
                <SelectInput
                  name='smartTags'
                  initialValue={initialValues.smartTags}
                  creatable
                  maxDropdownHeight='200px'
                  options={smartTagOptions}
                  placeholder={t('Select smart tags (optional)')}
                  valueKey='smartTags'
                  multi={true}
                />
                <SelectInput
                  name='difficulty'
                  initialValue={initialValues.difficulty}
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
                  initialValue={
                    initialValues.forHowMany
                      ? initialValues.forHowMany
                      : undefined
                  }
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
                <IngredientInputGroup
                  initialValue={initialValues.ingredients}
                  name='ingredients'
                />
                <p
                  className={css({
                    fontWeight: 'bold',
                    marginTop: '30px',
                  })}
                >
                  {t('How is it made?')}
                </p>
                {/*<TextArea
                placeholder={t('Add preparation instructions')}
                id='description'
                name='description'
                clearOnEscape={false}
              />*/}
                <QuillEditor name='description' id='description' />
                <p
                  className={css({
                    fontWeight: 'bold',
                    marginTop: '30px',
                  })}
                >
                  {t('Upload a photo (optional, max 10 MB)')}
                </p>
                <FileUploader
                  /*disabled={imageAdded}*/
                  errorMessage={imgErrorMessage}
                  //maxSize={1000000}
                  accept='.png, .jpg, .jpeg, .webp'
                  onDropRejected={() => {
                    setImgErrorMessage(
                      t('Incorrect File Type(jpeg,jpg,png) or Size(max 10MB)')
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
                  {t('Update Recipe')}
                </Button>
              </Form>
            );
          }}
        </Formik>
        {uploadState.isUploadModalShown && <UploadModal />}
      </UploadContext.Provider>
    </NoEdit>
  );
};

export default RecipeEdit;
