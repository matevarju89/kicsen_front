import { useContext } from 'react';
import { useStyletron } from 'baseui';
import { Block } from 'baseui/block';
import { useTranslation } from 'react-i18next';
import { ProgressBar } from 'baseui/progress-bar';
import { UploadContext } from '../recipes/recipeAdd';
import { Check } from 'baseui/icon';

const UploadModal = (props: any) => {
  const { t } = useTranslation();
  const [css] = useStyletron();
  const { uploadState, dispatchUpload } = useContext(UploadContext);
  const steps =
    uploadState.smartTagUpload && uploadState.imageUpload
      ? 3
      : uploadState.smartTagUpload || uploadState.imageUpload
      ? 2
      : 1;

  const stepSize = 100 / steps;
  const barValueFromContext = uploadState.isSmartTagloading
    ? 0
    : uploadState.isImageLoading && uploadState.smartTagUpload
    ? 50
    : uploadState.isImageLoading && !uploadState.smartTagUpload
    ? 0
    : uploadState.isRecipeLoading
    ? 100
    : 0;

  return (
    <div
      className={css({
        display: 'flex',
        position: 'fixed',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        top: '0',
        left: '0',
      })}
      onClick={(e) => {
        if (uploadState.isError || uploadState.isSuccess) {
          dispatchUpload({ type: 'hideUpload' });
        }
      }}
    >
      <Block
        backgroundColor='#fff'
        padding='20px 30px'
        display='flex'
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
        width='300px'
        position='relative'
      >
        {uploadState.isSuccess && (
          <>
            <h3
              className={css({
                marginTop: '5px',
                textAlign: 'center',
              })}
            >
              {t('Congrats, the recipe has been uploaded')}
            </h3>
            <Block display='flex' alignItems='center'>
              <Check size={100} />
            </Block>
          </>
        )}
        {uploadState.smartTagUpload && uploadState.isSmartTagLoading && (
          <>
            <h3
              className={css({
                marginTop: '5px',
              })}
            >
              {t('Uploading smart tags')}
            </h3>
          </>
        )}
        {uploadState.imageUpload && uploadState.isImageLoading && (
          <>
            <h3
              className={css({
                marginTop: '5px',
              })}
            >
              {t('Uploading images')}
            </h3>
          </>
        )}
        {uploadState.isRecipeLoading && (
          <>
            <h3
              className={css({
                marginTop: '5px',
              })}
            >
              {t('Uploading recipe')}
            </h3>
          </>
        )}
        {uploadState.isError && (
          <h3
            className={css({
              marginTop: '0',
              color: 'red',
            })}
          >
            {t('Error encountered, contact the administrator')}
          </h3>
        )}
        {!uploadState.isSuccess && !uploadState.isError && (
          <>
            <img
              className={css({
                marginBottom: '20px',
                display: 'inline-block',
              })}
              alt='spinner'
              src='/upload.gif'
              width='100px'
              height='100px'
            />

            <ProgressBar
              value={barValueFromContext}
              steps={steps}
              overrides={{
                BarProgress: {
                  style: ({ $theme }) => ({
                    backgroundColor: $theme.colors.black,
                  }),
                },
              }}
            />
          </>
        )}
      </Block>
    </div>
  );
};
export default UploadModal;
