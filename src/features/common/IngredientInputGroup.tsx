import React, { useState, useRef } from 'react';
import { useField } from 'formik';
import { useStyletron } from 'baseui';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Button, KIND } from 'baseui/button';
import { Tag, VARIANT, SIZE } from 'baseui/tag';
import { useTranslation } from 'react-i18next';

const IngredientInputGroup = (props: any) => {
  const [css] = useStyletron();
  const [t] = useTranslation();
  const [listValue, setListValue] = useState('');
  const [ingredientList, setIngredientList] = useState('');
  const [ingredientValue, setIngredientValue] = useState('');
  const [quantityValue, setQuantityValue] = useState('');
  const [field, meta, helpers] = useField(props);
  const ingredientInputRef = useRef<HTMLInputElement>(null);

  const updateIngredientList = () => {
    if (ingredientValue && quantityValue) {
      setIngredientList(
        ingredientList + ingredientValue + ': ' + quantityValue + ','
      );
      setQuantityValue('');
      setIngredientValue('');
      helpers.setValue(ingredientList);
      if (ingredientInputRef && ingredientInputRef.current) {
        ingredientInputRef.current.focus();
      }
    }
  };

  return (
    <>
      <FormControl
        label={t('Add ingredient names and quantities')}
        overrides={{
          Label: { style: { marginTop: '20px', marginBottom: '20px' } },
        }}
      >
        <div className={css({ display: 'flex' })}>
          <div className={css({ width: '200px', paddingRight: '10px' })}>
            <Input
              placeholder={t('Ingredient')}
              onChange={(event) => {
                setIngredientValue(event.currentTarget.value);
              }}
              inputRef={ingredientInputRef}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && ingredientValue && quantityValue) {
                  e.preventDefault();
                  updateIngredientList();
                } else if (e.key === ',') {
                  e.preventDefault();
                  return false;
                }
              }}
              value={ingredientValue}
            />
          </div>
          <div className={css({ width: '150px', paddingRight: '10px' })}>
            <Input
              placeholder={t('Quantity')}
              onChange={(event) => {
                setQuantityValue(event.currentTarget.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && ingredientValue && quantityValue) {
                  e.preventDefault();
                  updateIngredientList();
                } else if (e.key === ',') {
                  e.preventDefault();
                  return false;
                }
              }}
              value={quantityValue}
            />
          </div>
          <Button
            $as={'a'}
            onClick={(event) => {
              updateIngredientList();
            }}
            kind={KIND.primary}
          >
            {t('Add')}
          </Button>
        </div>
      </FormControl>
      {meta.touched && meta.error ? (
        <div
          className={css({
            color: 'red',
          })}
        >
          {meta.error}
        </div>
      ) : null}
      {ingredientList && (
        <div className={css({ marginTop: '20px' })}>
          {ingredientList.split(',').map((ingredient) => {
            if (ingredient) {
              return (
                <div
                  key={ingredient}
                  className={css({
                    paddingRight: '0px',
                    display: 'inline-block',
                  })}
                >
                  <Tag
                    variant={VARIANT.solid}
                    size={SIZE.medium}
                    title={ingredient}
                    onActionClick={(e) => {
                      const nextIngredientList = ingredientList
                        .split(',')
                        .filter((el) => {
                          return el !== ingredient;
                        })
                        .join(',');
                      setIngredientList(nextIngredientList);
                    }}
                  >
                    {ingredient}
                  </Tag>
                </div>
              );
            } else {
              return false;
            }
          })}
        </div>
      )}
    </>
  );
};

export default IngredientInputGroup;
