import React, { useEffect, useRef, useContext } from 'react';
import { useStyletron } from 'baseui';
import { useHistory } from 'react-router-dom';
import qs from 'query-string';
import { Input } from 'baseui/input';
import { Button, SIZE, SHAPE, KIND } from 'baseui/button';
import { useTranslation } from 'react-i18next';
import { smartTagSelector } from '../smartTag/smartTagSlice';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { CurrentFamilyContext } from '../common/Layout';
import {
  loadAllSmartTags,
  clearSmartTagListState,
} from '../smartTag/smartTagSlice';
import { BlockProps } from 'baseui/block';
import { userSelector } from '../user/userSlice';

const SearchBox = (props: any) => {
  const [css] = useStyletron();
  const [value, setValue] = React.useState('');
  const [smartTagsExpanded, setSmartTagsExpanded] = React.useState(false);
  const [t] = useTranslation();
  const history = useHistory();
  const inputRef = useRef<HTMLInputElement>(null);
  const { smartTagList } = useAppSelector(smartTagSelector);

  const { currentFamily } = useContext(CurrentFamilyContext);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (currentFamily) {
      //dispatch(loadAllSmartTagsByLang(lang));
      dispatch(loadAllSmartTags(currentFamily.id));
      return () => {
        dispatch(clearSmartTagListState());
      };
    }
  }, [currentFamily]);
  const submit = () => {
    const newQueryFragment = qs.stringify({
      keyword:
        typeof inputRef?.current?.value === 'string'
          ? inputRef.current.value.toLowerCase()
          : '',
    });
    history.push(`/recipes/all?${newQueryFragment}`);
  };
  return (
    <div
      className={css({
        background: '#00000008',
        borderRadius: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        color: '#000',
        marginBottom: '30px',
        padding: '20px',
      })}
    >
      <h2 className={css({ textAlign: 'center' })}>
        {t("Discover the depht of the family's cookbook!")}
      </h2>
      <div
        className={css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          width: '100%',
        })}
      >
        <Input
          value={value}
          inputRef={inputRef}
          onChange={(e) => setValue(e.currentTarget.value)}
          placeholder={t('Search for a recipe name or ingredient')}
          clearOnEscape
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              submit();
            }
          }}
          overrides={{
            Root: {
              style: {
                width: '100%',
                maxWidth: '300px',
                marginBottom: '10px',
              },
            },
            Input: {
              style: {
                backgroundColor: '#fff',
              },
            },
          }}
        ></Input>
        <div className={css({ padding: '0 10px' })}>
          <Button
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  marginBottom: '10px',
                }),
              },
            }}
            onClick={() => {
              submit();
            }}
          >
            {t('Search')}
          </Button>
        </div>
      </div>
      {smartTagList.length > 0 ? (
        <>
          <p
            className={css({
              color: 'mono700',
              marginBottom: '15px',
              textAlign: 'center',
              marginTop: '0',
            })}
          >
            {t('Or use a smart tag to find what your are looking for')}
          </p>
          <div
            className={css({
              textAlign: 'center',
            })}
          >
            {smartTagList.slice(0, 10).map((smartTag) => {
              return (
                <Button
                  onClick={() => {
                    const newQueryFragment = qs.stringify({
                      smarttag:
                        typeof smartTag.name === 'string'
                          ? smartTag.name.toLowerCase()
                          : '',
                    });
                    history.push(`/recipes/all?${newQueryFragment}`);
                  }}
                  key={smartTag.name}
                  size={SIZE.compact}
                  shape={SHAPE.pill}
                  overrides={{
                    Root: {
                      style: ({ $theme }) => ({
                        marginRight: '10px',
                        marginBottom: '5px',
                        fontSize: '12px',
                        lineHeight: '14px',
                        [$theme.mediaQuery.medium]: {
                          fontSize: '14px',
                          lineHeight: '16px',
                          marginBottom: '10px',
                        },
                      }),
                    },
                  }}
                >
                  {smartTag.name}
                </Button>
              );
            })}
            {smartTagList.length > 10 && !smartTagsExpanded && (
              <Button
                kind={KIND.tertiary}
                overrides={{
                  BaseButton: {
                    style: ({ $theme }) => ({
                      marginRight: '10px',
                      marginBottom: '5px',
                      backgroundColor: 'transparent',
                      fontSize: '12px',
                      lineHeight: '14px',
                      [$theme.mediaQuery.medium]: {
                        fontSize: '14px',
                        lineHeight: '16px',
                        marginBottom: '10px',
                      },
                    }),
                  },
                }}
                onClick={() => {
                  setSmartTagsExpanded(true);
                }}
              >
                {t('Show all...')}
              </Button>
            )}
            {smartTagList.length > 10 &&
              smartTagsExpanded &&
              smartTagList.slice(10).map((smartTag) => {
                return (
                  <Button
                    onClick={() => {
                      const newQueryFragment = qs.stringify({
                        smarttag:
                          typeof smartTag.name === 'string'
                            ? smartTag.name.toLowerCase()
                            : '',
                      });
                      history.push(`/recipes/all?${newQueryFragment}`);
                    }}
                    key={smartTag.name}
                    size={SIZE.compact}
                    shape={SHAPE.pill}
                    overrides={{
                      Root: {
                        style: ({ $theme }) => ({
                          marginRight: '10px',
                          marginBottom: '5px',
                          fontSize: '12px',
                          lineHeight: '14px',
                          [$theme.mediaQuery.medium]: {
                            fontSize: '14px',
                            lineHeight: '16px',
                            marginBottom: '10px',
                          },
                        }),
                      },
                    }}
                  >
                    {smartTag.name}
                  </Button>
                );
              })}
            {smartTagList.length > 10 && smartTagsExpanded && (
              <Button
                kind={KIND.tertiary}
                overrides={{
                  BaseButton: {
                    style: ({ $theme }) => ({
                      marginRight: '10px',
                      marginBottom: '5px',
                      backgroundColor: 'transparent',
                      fontSize: '12px',
                      lineHeight: '14px',
                      [$theme.mediaQuery.medium]: {
                        fontSize: '14px',
                        lineHeight: '16px',
                        marginBottom: '10px',
                      },
                    }),
                  },
                }}
                onClick={() => {
                  setSmartTagsExpanded(false);
                }}
              >
                {t('...Show less')}
              </Button>
            )}
          </div>
        </>
      ) : (
        ''
      )}
    </div>
  );
};

export default SearchBox;
