import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'query-string';
import { Checkbox, LABEL_PLACEMENT } from 'baseui/checkbox';
import { Block } from 'baseui/block';
import { Input } from 'baseui/input';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { useTranslation } from 'react-i18next';
import { BlockProps } from 'baseui/block';
import { Button, KIND, SIZE as BUTTONSIZE } from 'baseui/button';
import { ButtonGroup, MODE, SIZE, SHAPE } from 'baseui/button-group';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { smartTagSelector } from '../smartTag/smartTagSlice';
import { FilterContext as Filtercontext_All } from './recipeAll';
import { FilterContext as Filtercontext_Category } from './recipeCategory';
import {
  loadAllSmartTags,
  clearSmartTagListState,
} from '../smartTag/smartTagSlice';
import { t } from 'i18next';
import { useStyletron } from 'baseui';
import { ChevronUp, ChevronDown } from 'baseui/icon';
import { recipeSelector } from './recipeSlice';
import { CurrentFamilyContext } from '../common/Layout';

const flexItemProps: BlockProps = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
};
const DifficultySection = ({
  isCategoryGiven,
}: {
  isCategoryGiven: boolean;
}) => {
  const location = useLocation();
  const currentQuery = qs.parse(location.search);
  const currentDifficultyFragment = currentQuery.difficulty;
  const isEasyCheckedAsDefault =
    currentDifficultyFragment &&
    currentDifficultyFragment?.indexOf('easy') > -1;
  const isMediumCheckedAsDefault =
    currentDifficultyFragment &&
    currentDifficultyFragment?.indexOf('medium') > -1;
  const isHardCheckedAsDefault =
    currentDifficultyFragment &&
    currentDifficultyFragment?.indexOf('hard') > -1;
  const [easyChecked, setEasyChecked] = React.useState(isEasyCheckedAsDefault);
  const [mediumChecked, setMediumChecked] = React.useState(
    isMediumCheckedAsDefault
  );
  const [difficultChecked, setDifficultChecked] = React.useState(
    isHardCheckedAsDefault
  );
  const { t } = useTranslation();
  const history = useHistory();
  const inputRef1 = React.useRef<HTMLInputElement>(null);
  const inputRef2 = React.useRef<HTMLInputElement>(null);
  const inputRef3 = React.useRef<HTMLInputElement>(null);
  const currentContext = isCategoryGiven
    ? Filtercontext_Category
    : Filtercontext_All;
  const { filtersObj, setFiltersObj } = React.useContext(currentContext);
  const setNewFilterPortion = () => {
    const inputArray = [inputRef1, inputRef2, inputRef3];
    const choiceArray = inputArray
      .filter((ref) => {
        return ref?.current?.checked;
      })
      .map((ref) => {
        return ref?.current?.name;
      });
    const newFilterPortion = choiceArray.length
      ? { in: choiceArray }
      : { in: ['easy', 'medium', 'hard'] };
    const newHistoryFragment = choiceArray.length ? choiceArray.join('+') : '';
    const queryParams = qs.parse(location.search);
    const newQueries = { ...queryParams, difficulty: newHistoryFragment };
    history.push({ search: qs.stringify(newQueries) });
    setFiltersObj({ ...filtersObj, difficulty: newFilterPortion });
  };

  return (
    <Block>
      <h4>{t('Difficulty')}</h4>
      <Checkbox
        checked={easyChecked}
        inputRef={inputRef1}
        name='easy'
        onChange={(e) => {
          //if (inputRef2?.current?.checked || inputRef3?.current?.checked) {
          setEasyChecked(e.currentTarget.checked);
          setNewFilterPortion();
          //}
        }}
        labelPlacement={LABEL_PLACEMENT.right}
      >
        {t('easy')}
      </Checkbox>
      <Checkbox
        checked={mediumChecked}
        inputRef={inputRef2}
        name='medium'
        onChange={(e) => {
          //if (inputRef1?.current?.checked || inputRef3?.current?.checked) {
          setMediumChecked(e.currentTarget.checked);
          setNewFilterPortion();
          //}
        }}
        labelPlacement={LABEL_PLACEMENT.right}
      >
        {t('medium')}
      </Checkbox>
      <Checkbox
        checked={difficultChecked}
        inputRef={inputRef3}
        name='hard'
        onChange={(e) => {
          //if (inputRef1?.current?.checked || inputRef2?.current?.checked) {
          setDifficultChecked(e.currentTarget.checked);
          setNewFilterPortion();
          //}
        }}
        labelPlacement={LABEL_PLACEMENT.right}
      >
        {t('hard')}
      </Checkbox>
    </Block>
  );
};

const Category1Section = ({
  isCategoryGiven,
}: {
  isCategoryGiven: boolean;
}) => {
  const location = useLocation();
  const history = useHistory();
  const currentQuery = qs.parse(location.search);
  const currentCategory1Fragment = currentQuery.category1;
  const { t } = useTranslation();
  const isAppetizerCheckedAsDefault =
    currentCategory1Fragment &&
    currentCategory1Fragment?.indexOf('appetizer') > -1;
  const isSoupCheckedAsDefault =
    currentCategory1Fragment && currentCategory1Fragment?.indexOf('soup') > -1;
  const isMainCheckedAsDefault =
    currentCategory1Fragment && currentCategory1Fragment?.indexOf('main') > -1;
  const isDessertCheckedAsDefault =
    currentCategory1Fragment &&
    currentCategory1Fragment?.indexOf('dessert') > -1;
  const [appetizerChecked, setAppetizerChecked] = React.useState(
    isAppetizerCheckedAsDefault
  );
  const [soupChecked, setSoupChecked] = React.useState(isSoupCheckedAsDefault);
  const [mainChecked, setMainChecked] = React.useState(isMainCheckedAsDefault);
  const [dessertChecked, setDessertChecked] = React.useState(
    isDessertCheckedAsDefault
  );
  const inputRef1 = React.useRef<HTMLInputElement>(null);
  const inputRef2 = React.useRef<HTMLInputElement>(null);
  const inputRef3 = React.useRef<HTMLInputElement>(null);
  const inputRef4 = React.useRef<HTMLInputElement>(null);
  const currentContext = isCategoryGiven
    ? Filtercontext_Category
    : Filtercontext_All;
  const { filtersObj, setFiltersObj } = React.useContext(currentContext);
  const setNewFilterPortion = () => {
    const inputArray = [inputRef1, inputRef2, inputRef3, inputRef4];
    const choiceArray = inputArray
      .filter((ref) => {
        return ref?.current?.checked;
      })
      .map((ref) => {
        return ref?.current?.name;
      });
    const newFilterPortion = choiceArray.length
      ? { in: choiceArray }
      : { in: ['appetizer', 'soup', 'main', 'dessert'] };
    const newHistoryFragment = choiceArray.length ? choiceArray.join('+') : '';
    const queryParams = qs.parse(location.search);
    const newQueries = { ...queryParams, category1: newHistoryFragment };
    history.push({ search: qs.stringify(newQueries) });
    setFiltersObj({ ...filtersObj, category1: newFilterPortion });
  };
  return (
    <Block>
      <h4>{t('Categories')}</h4>
      <Checkbox
        checked={appetizerChecked}
        inputRef={inputRef1}
        name='appetizer'
        onChange={(e) => {
          setAppetizerChecked(e.currentTarget.checked);
          setNewFilterPortion();
        }}
        labelPlacement={LABEL_PLACEMENT.right}
      >
        {t('Appetizer')}
      </Checkbox>
      <Checkbox
        checked={soupChecked}
        inputRef={inputRef2}
        name='soup'
        onChange={(e) => {
          setSoupChecked(e.currentTarget.checked);
          setNewFilterPortion();
        }}
        labelPlacement={LABEL_PLACEMENT.right}
      >
        {t('Soup')}
      </Checkbox>
      <Checkbox
        checked={mainChecked}
        inputRef={inputRef3}
        name='main'
        onChange={(e) => {
          setMainChecked(e.currentTarget.checked);
          setNewFilterPortion();
        }}
        labelPlacement={LABEL_PLACEMENT.right}
      >
        {t('Main')}
      </Checkbox>
      <Checkbox
        checked={dessertChecked}
        inputRef={inputRef4}
        name='dessert'
        onChange={(e) => {
          setDessertChecked(e.currentTarget.checked);
          setNewFilterPortion();
        }}
        labelPlacement={LABEL_PLACEMENT.right}
      >
        {t('Dessert')}
      </Checkbox>
    </Block>
  );
};

const Category2Section = ({
  isCategoryGiven,
}: {
  isCategoryGiven: boolean;
}) => {
  const location = useLocation();
  const history = useHistory();
  const currentQuery = qs.parse(location.search);
  const currentCategory2Fragment = currentQuery.category2;
  const isSaltyCheckedAsDefault =
    currentCategory2Fragment && currentCategory2Fragment?.indexOf('salty') > -1;
  const isSweetCheckedAsDefault =
    currentCategory2Fragment && currentCategory2Fragment?.indexOf('sweet') > -1;
  const [saltyChecked, setSaltyChecked] = React.useState(
    isSaltyCheckedAsDefault
  );
  const [sweetChecked, setSweetChecked] = React.useState(
    isSweetCheckedAsDefault
  );
  const { t } = useTranslation();
  const inputRef1 = React.useRef<HTMLInputElement>(null);
  const inputRef2 = React.useRef<HTMLInputElement>(null);
  const currentContext = isCategoryGiven
    ? Filtercontext_Category
    : Filtercontext_All;
  const { filtersObj, setFiltersObj } = React.useContext(currentContext);
  const setNewFilterPortion = () => {
    const inputArray = [inputRef1, inputRef2];
    const choiceArray = inputArray
      .filter((ref) => {
        return ref?.current?.checked;
      })
      .map((ref) => {
        return ref?.current?.name;
      });
    const newFilterPortion = choiceArray.length
      ? { in: choiceArray }
      : { in: ['salty', 'sweet'] };
    const newHistoryFragment = choiceArray.length ? choiceArray.join('+') : '';
    const queryParams = qs.parse(location.search);
    const newQueries = { ...queryParams, category2: newHistoryFragment };
    history.push({ search: qs.stringify(newQueries) });
    setFiltersObj({ ...filtersObj, category2: newFilterPortion });
  };

  return (
    <Block>
      <h4>{t('Choose salty or sweet')}</h4>
      <Checkbox
        checked={saltyChecked}
        name='salty'
        inputRef={inputRef1}
        onChange={(e) => {
          setSaltyChecked(e.currentTarget.checked);
          setNewFilterPortion();
        }}
        labelPlacement={LABEL_PLACEMENT.right}
      >
        {t('Salty')}
      </Checkbox>
      <Checkbox
        checked={sweetChecked}
        name='sweet'
        inputRef={inputRef2}
        onChange={(e) => {
          setSweetChecked(e.currentTarget.checked);
          setNewFilterPortion();
        }}
        labelPlacement={LABEL_PLACEMENT.right}
      >
        {t('Sweet')}
      </Checkbox>
    </Block>
  );
};

const Category3Section = ({
  isCategoryGiven,
}: {
  isCategoryGiven: boolean;
}) => {
  const location = useLocation();
  const history = useHistory();
  const currentQuery = qs.parse(location.search);
  const currentCategory3Fragment = currentQuery.category3;
  const isVeganCheckedAsDefault =
    currentCategory3Fragment &&
    currentCategory3Fragment?.indexOf('nonvegan') === -1;
  const isNonVeganCheckedAsDefault =
    currentCategory3Fragment &&
    currentCategory3Fragment?.indexOf('nonvegan') > -1;
  const [veganChecked, setVeganChecked] = React.useState(
    isVeganCheckedAsDefault
  );
  const [nonVeganChecked, setNonVeganChecked] = React.useState(
    isNonVeganCheckedAsDefault
  );
  const { t } = useTranslation();
  const inputRef1 = React.useRef<HTMLInputElement>(null);
  const inputRef2 = React.useRef<HTMLInputElement>(null);
  const currentContext = isCategoryGiven
    ? Filtercontext_Category
    : Filtercontext_All;
  const { filtersObj, setFiltersObj } = React.useContext(currentContext);
  const setNewFilterPortion = () => {
    const inputArray = [inputRef1, inputRef2];
    const choiceArray = inputArray
      .filter((ref) => {
        return ref?.current?.checked;
      })
      .map((ref) => {
        return ref?.current?.name;
      });
    const newFilterPortion = choiceArray.length
      ? { in: choiceArray }
      : { in: ['vegan', 'nonvegan'] };
    const newHistoryFragment = choiceArray.length ? choiceArray.join('+') : '';
    const queryParams = qs.parse(location.search);
    const newQueries = { ...queryParams, category3: newHistoryFragment };
    history.push({ search: qs.stringify(newQueries) });
    setFiltersObj({ ...filtersObj, category3: newFilterPortion });
  };

  return (
    <Block>
      <h4>{t('Choose vegan or non-vegan')}</h4>
      <Checkbox
        checked={veganChecked}
        name='vegan'
        inputRef={inputRef1}
        onChange={(e) => {
          setVeganChecked(e.currentTarget.checked);
          setNewFilterPortion();
        }}
        labelPlacement={LABEL_PLACEMENT.right}
      >
        {t('Vegan')}
      </Checkbox>
      <Checkbox
        checked={nonVeganChecked}
        inputRef={inputRef2}
        name='nonvegan'
        onChange={(e) => {
          setNonVeganChecked(e.currentTarget.checked);
          setNewFilterPortion();
        }}
        labelPlacement={LABEL_PLACEMENT.right}
      >
        {t('Non-Vegan')}
      </Checkbox>
    </Block>
  );
};

const KeywordSection = ({ isCategoryGiven }: { isCategoryGiven: boolean }) => {
  const location = useLocation();
  const history = useHistory();
  const [css, theme] = useStyletron();
  const currentQuery = qs.parse(location.search);
  const currentKeywordFragment = currentQuery.keyword;
  const defaultState =
    typeof currentKeywordFragment === 'string' ? currentKeywordFragment : '';
  const [keyword, setKeyword] = React.useState<string>(defaultState);
  const { t } = useTranslation();
  const inputRef1 = React.useRef<HTMLInputElement>(null);
  const currentContext = isCategoryGiven
    ? Filtercontext_Category
    : Filtercontext_All;
  const { filtersObj, setFiltersObj } = React.useContext(currentContext);
  const setNewFilterPortion = () => {
    //console.log(currentKeywordFragment);
    const currentValue = inputRef1?.current?.value;
    const newFilterPortion = currentValue
      ? [
          {
            ingredients: {
              contains: currentValue,
              mode: 'insensitive',
            },
          },
          {
            title: {
              contains: currentValue,
              mode: 'insensitive',
            },
          },
        ]
      : [];
    const queryParams = qs.parse(location.search);
    const newQueries = { ...queryParams, keyword: currentValue };
    history.push({ search: qs.stringify(newQueries) });
    setFiltersObj({ ...filtersObj, OR: newFilterPortion });
  };
  return (
    <Block>
      <h4
        className={css({
          marginTop: '10px',
          [theme.mediaQuery.medium]: {
            marginTop: '1.33em',
          },
        })}
      >
        {t('Keyword')}
      </h4>
      <Input
        value={keyword}
        inputRef={inputRef1}
        onChange={(e) => {
          setKeyword(e.currentTarget.value);
        }}
        onBlur={(e) => {
          setNewFilterPortion();
        }}
        placeholder={t('Add a word')}
        clearOnEscape
      />
    </Block>
  );
};

const SmartTagSection = ({ isCategoryGiven }: { isCategoryGiven: boolean }) => {
  const location = useLocation();
  const history = useHistory();
  const currentQuery = qs.parse(location.search);
  const currentSmartTag: string | null | (string | null)[] =
    currentQuery.smarttag;
  const currentContext = isCategoryGiven
    ? Filtercontext_Category
    : Filtercontext_All;
  const { smartTagList } = useAppSelector(smartTagSelector);
  const { current_smarttag_list } = useAppSelector(recipeSelector);
  /*const { lang } = useAppSelector(userSelector);
  const current_smarttag_list_in_lang = current_smarttag_list.filter(
    (tag) => tag.lang === lang
  );*/
  const { currentFamily } = React.useContext(CurrentFamilyContext);
  /*let currentIndex =
    smartTagList.length && typeof currentSmartTag === 'string'
      ? smartTagList.findIndex((tag) => {
          return tag.name.toLowerCase() === currentSmartTag;
        })
      : -1;
  if (currentIndex >= 7) {
    currentIndex++;
  }*/
  /*const [smartTagsExpanded, setSmartTagsExpanded] = React.useState(
    currentIndex >= 7 ? true : false
  );*/
  const [selected, setSelected] = React.useState<number>(
    !!currentSmartTag ? 0 : -1
  );
  const [smartTagsExpanded, setSmartTagsExpanded] = React.useState(false);
  const { filtersObj, setFiltersObj } = React.useContext(currentContext);
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    if (currentFamily) {
      //dispatch(loadAllSmartTagsByLang(lang));
      dispatch(loadAllSmartTags(currentFamily.id));
      return () => {
        dispatch(clearSmartTagListState());
      };
    }
  }, [currentFamily]);

  const setNewSMartTagFilter = (name: string | null): void => {
    const newFilterPortion =
      typeof name === 'string'
        ? {
            some: {
              name: {
                contains: name,
                mode: 'insensitive',
              },
            },
          }
        : {};
    const queryParams = qs.parse(location.search);
    const newQueries = {
      ...queryParams,
      smarttag: typeof name === 'string' ? name.toLowerCase() : '',
    };
    history.push({ search: qs.stringify(newQueries) });
    setFiltersObj({ ...filtersObj, smartTags: newFilterPortion });
  };
  return (
    <>
      <Block marginTop='10px' marginBottom='15px'>
        <h4>
          <span>{t('Smart Tags')}</span>
          {selected > -1 ? (
            <Button
              onClick={() => {
                setSelected(-1);
                setNewSMartTagFilter(null);
              }}
              kind={KIND.tertiary}
              size={BUTTONSIZE.compact}
              overrides={{
                BaseButton: {
                  style: ({ $theme }) => ({
                    marginLeft: '10px',
                    color: '#757575',
                  }),
                },
                StartEnhancer: {
                  style: ({ $theme }) => ({
                    marginRight: '4px',
                  }),
                },
              }}
              startEnhancer='&#10006;'
            >
              {t('Clear selection')}
            </Button>
          ) : (
            ''
          )}
        </h4>
      </Block>
      <div className='smartTags'>
        {/*
        <ButtonGroup
          mode={MODE.radio}
          size={SIZE.compact}
          shape={SHAPE.pill}
          selected={selected}
          onClick={(_event, index) => {
            if (index === 7 || index === smartTagList.length + 1) return false;
            setSelected(index);
          }}
          overrides={{
            Root: {
              style: {
                flexWrap: 'wrap',
                marginRight: '0',
                marginLeft: '0',
              },
            },
          }}
        >
          {smartTagList.slice(0, 7).map((smartTag) => {
            return (
              <Button
                onClick={(e) => {
                  //setIsSelected(!isSelected);
                  setNewSMartTagFilter(e.currentTarget.innerText);
                }}
                key={smartTag.name}
                kind={KIND.secondary}
                overrides={{
                  BaseButton: {
                    style: ({ $theme }) => ({
                      marginRight: '10px',
                      marginBottom: '10px',
                    }),
                  },
                }}
              >
                {smartTag.name}
              </Button>
            );
          })}
          {smartTagList.length > 7 && !smartTagsExpanded && (
            <Button
              kind={KIND.tertiary}
              overrides={{
                BaseButton: {
                  style: ({ $theme }) => ({
                    marginRight: '10px',
                    marginBottom: '10px',
                    backgroundColor: 'transparent',
                  }),
                },
              }}
              onClick={(e) => {
                setSmartTagsExpanded(true);
              }}
            >
              {t('Show all...')}
            </Button>
          )}
          {smartTagList.length > 7 &&
            smartTagsExpanded &&
            smartTagList.slice(7).map((smartTag) => {
              return (
                <Button
                  onClick={(e) => {
                    //setIsSelected(!isSelected);
                    setNewSMartTagFilter(e.currentTarget.innerText);
                  }}
                  key={smartTag.name}
                  kind={KIND.secondary}
                  overrides={{
                    BaseButton: {
                      style: ({ $theme }) => ({
                        marginRight: '10px',
                        marginBottom: '10px',
                      }),
                    },
                  }}
                >
                  {smartTag.name}
                </Button>
              );
            })}
          {smartTagList.length > 7 && smartTagsExpanded && (
            <Button
              kind={KIND.tertiary}
              overrides={{
                BaseButton: {
                  style: ({ $theme }) => ({
                    marginRight: '10px',
                    marginBottom: '10px',
                    backgroundColor: 'transparent',
                  }),
                },
              }}
              onClick={(e) => {
                setSmartTagsExpanded(false);
              }}
            >
              {t('...Show less')}
            </Button>
          )}
            </ButtonGroup>*/}
        {selected === -1 && (
          <ButtonGroup
            mode={MODE.radio}
            size={SIZE.compact}
            shape={SHAPE.pill}
            selected={selected}
            onClick={(_event, index) => {
              if (index === 7 || index === current_smarttag_list.length + 1)
                return false;
              setSelected(index);
            }}
            overrides={{
              Root: {
                style: {
                  flexWrap: 'wrap',
                  marginRight: '0',
                  marginLeft: '0',
                },
              },
            }}
          >
            {current_smarttag_list.slice(0, 7).map((smartTag) => {
              return (
                <Button
                  onClick={(e) => {
                    //setIsSelected(!isSelected);
                    setNewSMartTagFilter(e.currentTarget.innerText);
                  }}
                  key={smartTag.name}
                  kind={KIND.secondary}
                  overrides={{
                    BaseButton: {
                      style: ({ $theme }) => ({
                        marginRight: '10px',
                        marginBottom: '10px',
                      }),
                    },
                  }}
                >
                  {smartTag.name}
                </Button>
              );
            })}
            {current_smarttag_list.length > 7 && !smartTagsExpanded && (
              <Button
                kind={KIND.tertiary}
                overrides={{
                  BaseButton: {
                    style: ({ $theme }) => ({
                      marginRight: '10px',
                      marginBottom: '10px',
                      backgroundColor: 'transparent',
                    }),
                  },
                }}
                onClick={(e) => {
                  setSmartTagsExpanded(true);
                }}
              >
                {t('Show all...')}
              </Button>
            )}
            {current_smarttag_list.length > 7 &&
              smartTagsExpanded &&
              current_smarttag_list.slice(7).map((smartTag) => {
                return (
                  <Button
                    onClick={(e) => {
                      //setIsSelected(!isSelected);
                      setNewSMartTagFilter(e.currentTarget.innerText);
                    }}
                    key={smartTag.name}
                    kind={KIND.secondary}
                    overrides={{
                      BaseButton: {
                        style: ({ $theme }) => ({
                          marginRight: '10px',
                          marginBottom: '10px',
                        }),
                      },
                    }}
                  >
                    {smartTag.name}
                  </Button>
                );
              })}
            {current_smarttag_list.length > 7 && smartTagsExpanded && (
              <Button
                kind={KIND.tertiary}
                overrides={{
                  BaseButton: {
                    style: ({ $theme }) => ({
                      marginRight: '10px',
                      marginBottom: '10px',
                      backgroundColor: 'transparent',
                    }),
                  },
                }}
                onClick={(e) => {
                  setSmartTagsExpanded(false);
                }}
              >
                {t('...Show less')}
              </Button>
            )}
          </ButtonGroup>
        )}
        {selected !== -1 && (
          <ButtonGroup
            mode={MODE.radio}
            size={SIZE.compact}
            shape={SHAPE.pill}
            selected={0}
            onClick={(_event, index) => {
              if (index === 7 || index === current_smarttag_list.length + 1)
                return false;
              setSelected(index);
            }}
            overrides={{
              Root: {
                style: {
                  flexWrap: 'wrap',
                  marginRight: '0',
                  marginLeft: '0',
                },
              },
            }}
          >
            <Button
              onClick={(e) => {
                //setIsSelected(!isSelected);
                //setNewSMartTagFilter(e.currentTarget.innerText);
              }}
              kind={KIND.secondary}
              overrides={{
                BaseButton: {
                  style: ({ $theme }) => ({
                    marginRight: '10px',
                    marginBottom: '10px',
                  }),
                },
              }}
            >
              {current_smarttag_list.length &&
              currentSmartTag &&
              current_smarttag_list.filter((tag) => {
                return tag.name.toLowerCase() === currentSmartTag;
              }).length
                ? current_smarttag_list.filter((tag) => {
                    return tag.name.toLowerCase() === currentSmartTag;
                  })[0].name
                : typeof currentSmartTag === 'string'
                ? currentSmartTag?.charAt(0).toUpperCase() +
                  currentSmartTag?.slice(1)
                : ''}
            </Button>
          </ButtonGroup>
        )}
      </div>
    </>
  );
};
const RecipeFilters = ({ isCategoryGiven }: { isCategoryGiven: boolean }) => {
  const location = useLocation();
  const currentQuery = qs.parse(location.search);
  const filterAppliedArray = [
    !!currentQuery.category1,
    !!currentQuery.category2,
    !!currentQuery.category3,
    !!currentQuery.smarttag,
    !!currentQuery.difficulty,
    !!currentQuery.keyword,
  ];
  const filterApplied = filterAppliedArray.reduce(
    (accumulator, currentValue) => {
      return accumulator || currentValue;
    }
  );
  const [filtersExpanded, setFiltersExpanded] =
    React.useState<boolean>(filterApplied);
  const { t } = useTranslation();
  const [css] = useStyletron();

  return (
    <>
      <div>
        <Button
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          kind={KIND.secondary}
          endEnhancer={() => {
            return filtersExpanded ? (
              <ChevronUp size={24} />
            ) : (
              <ChevronDown size={24} />
            );
          }}
          overrides={{
            BaseButton: {
              style: {
                fontSize: '18px',
                lineHeight: '20px',
                marginBottom: '0',
              },
            },
            EndEnhancer: {
              style: {
                marginLeft: '5px',
              },
            },
          }}
        >
          {filtersExpanded ? t('Collapse filters') : t('Expand filters')}
        </Button>
        {filterApplied ? (
          <span
            className={css({
              marginLeft: '10px',
            })}
          >
            {`${filterAppliedArray.filter(Boolean).length} ${t(
              'Filter applied'
            )}`}
          </span>
        ) : (
          ''
        )}
      </div>
      <div
        className={css({
          height: filtersExpanded ? 'auto' : '0',
          overflow: 'hidden',
          transition: 'all 1s ease-out',
        })}
      >
        <FlexGrid
          flexGridColumnCount={[1, 2, 4, 6]}
          flexGridColumnGap={['scale400', 'scale400', 'scale600', 'scale800']}
          flexGridRowGap={['scale400', 'scale400', 'scale600', 'scale800']}
        >
          {!isCategoryGiven && (
            <FlexGridItem {...flexItemProps}>
              <Category1Section isCategoryGiven={isCategoryGiven} />
            </FlexGridItem>
          )}
          <FlexGridItem {...flexItemProps}>
            <Category2Section isCategoryGiven={isCategoryGiven} />
          </FlexGridItem>
          <FlexGridItem {...flexItemProps}>
            <Category3Section isCategoryGiven={isCategoryGiven} />
          </FlexGridItem>
          <FlexGridItem {...flexItemProps}>
            <DifficultySection isCategoryGiven={isCategoryGiven} />
          </FlexGridItem>
          <FlexGridItem {...flexItemProps}>
            <KeywordSection isCategoryGiven={isCategoryGiven} />
          </FlexGridItem>
        </FlexGrid>

        <SmartTagSection isCategoryGiven={isCategoryGiven} />
      </div>
    </>
  );
};

export default RecipeFilters;
