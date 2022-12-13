import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'query-string';
import { Checkbox, LABEL_PLACEMENT } from 'baseui/checkbox';
import { Block } from 'baseui/block';
import { Input } from 'baseui/input';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { useTranslation } from 'react-i18next';
import { BlockProps } from 'baseui/block';
import { FilterContext as Filtercontext_All } from './recipeAll';
import { FilterContext as Filtercontext_Category } from './recipeCategory';

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
  const isSetting =
    isHardCheckedAsDefault ||
    isMediumCheckedAsDefault ||
    isEasyCheckedAsDefault;
  const [easyChecked, setEasyChecked] = React.useState(
    isEasyCheckedAsDefault || !isSetting
  );
  const [mediumChecked, setMediumChecked] = React.useState(
    isMediumCheckedAsDefault || !isSetting
  );
  const [difficultChecked, setDifficultChecked] = React.useState(
    isHardCheckedAsDefault || !isSetting
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
    const newHistoryFragment = choiceArray.length
      ? choiceArray.join('+')
      : 'easy+medium+hard';
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
          if (inputRef2?.current?.checked || inputRef3?.current?.checked) {
            setEasyChecked(e.currentTarget.checked);
            setNewFilterPortion();
          }
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
          if (inputRef1?.current?.checked || inputRef3?.current?.checked) {
            setMediumChecked(e.currentTarget.checked);
            setNewFilterPortion();
          }
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
          if (inputRef1?.current?.checked || inputRef2?.current?.checked) {
            setDifficultChecked(e.currentTarget.checked);
            setNewFilterPortion();
          }
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
  const isSetting =
    isAppetizerCheckedAsDefault ||
    isSoupCheckedAsDefault ||
    isMainCheckedAsDefault ||
    isDessertCheckedAsDefault;
  const [appetizerChecked, setAppetizerChecked] = React.useState(
    !isSetting || isAppetizerCheckedAsDefault
  );
  const [soupChecked, setSoupChecked] = React.useState(
    !isSetting || isSoupCheckedAsDefault
  );
  const [mainChecked, setMainChecked] = React.useState(
    !isSetting || isMainCheckedAsDefault
  );
  const [dessertChecked, setDessertChecked] = React.useState(
    !isSetting || isDessertCheckedAsDefault
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
    const newHistoryFragment = choiceArray.length
      ? choiceArray.join('+')
      : 'appetizer+soup+main+dessert';
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
          if (
            inputRef2?.current?.checked ||
            inputRef3?.current?.checked ||
            inputRef4?.current?.checked
          ) {
            setAppetizerChecked(e.currentTarget.checked);
            setNewFilterPortion();
          }
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
          if (
            inputRef1?.current?.checked ||
            inputRef3?.current?.checked ||
            inputRef4?.current?.checked
          ) {
            setSoupChecked(e.currentTarget.checked);
            setNewFilterPortion();
          }
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
          if (
            inputRef1?.current?.checked ||
            inputRef2?.current?.checked ||
            inputRef4?.current?.checked
          ) {
            setMainChecked(e.currentTarget.checked);
            setNewFilterPortion();
          }
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
          if (
            inputRef1?.current?.checked ||
            inputRef2?.current?.checked ||
            inputRef3?.current?.checked
          ) {
            setDessertChecked(e.currentTarget.checked);
            setNewFilterPortion();
          }
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
  const isSetting = isSaltyCheckedAsDefault || isSweetCheckedAsDefault;
  const [saltyChecked, setSaltyChecked] = React.useState(
    !isSetting || isSaltyCheckedAsDefault
  );
  const [sweetChecked, setSweetChecked] = React.useState(
    !isSetting || isSweetCheckedAsDefault
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
    const newHistoryFragment = choiceArray.length
      ? choiceArray.join('+')
      : 'salty+sweet';
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
          if (inputRef2?.current?.checked) {
            setSaltyChecked(e.currentTarget.checked);
            setNewFilterPortion();
          }
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
          if (inputRef1?.current?.checked) {
            setSweetChecked(e.currentTarget.checked);
            setNewFilterPortion();
          }
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
  const isSetting = isVeganCheckedAsDefault || isNonVeganCheckedAsDefault;
  const [veganChecked, setVeganChecked] = React.useState(
    !isSetting || isVeganCheckedAsDefault
  );
  const [nonVeganChecked, setNonVeganChecked] = React.useState(
    !isSetting || isNonVeganCheckedAsDefault
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
    const newHistoryFragment = choiceArray.length
      ? choiceArray.join('+')
      : 'vegan+nonvegan';
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
          if (inputRef2?.current?.checked) {
            setVeganChecked(e.currentTarget.checked);
            setNewFilterPortion();
          }
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
          if (inputRef1?.current?.checked) {
            setNonVeganChecked(e.currentTarget.checked);
            setNewFilterPortion();
          }
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
      <h4>{t('Keyword')}</h4>
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

const RecipeFilters = ({ isCategoryGiven }: { isCategoryGiven: boolean }) => {
  return (
    <>
      <FlexGrid
        flexGridColumnCount={[1, 2, 4, 6]}
        flexGridColumnGap='scale800'
        flexGridRowGap='scale800'
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
    </>
  );
};

export default RecipeFilters;
