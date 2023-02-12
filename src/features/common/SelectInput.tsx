import { useEffect, useState } from 'react';
import { useField } from 'formik';
import { useStyletron } from 'baseui';
import { Select, Value } from 'baseui/select';

const SelectInput = (props: any) => {
  const [css] = useStyletron();
  const [inputValue, setInputValue] = useState<Value>([]);
  const [, meta, helpers] = useField(props);
  const { initialValue, multi, options, name } = props;
  useEffect(() => {
    if (initialValue) {
      if (!multi) {
        const initialSelection = options.filter((option: any) => {
          return option[name] === initialValue;
        });
        initialSelection[0] && setInputValue(initialSelection);
      } else {
        const initialSelection = initialValue.map((val: any) => {
          return options.filter((option: any) => {
            return option[name] === val;
          })[0];
        });
        initialSelection[0] && setInputValue(initialSelection);
      }
    }
  }, []);
  useEffect(() => {
    if (initialValue) {
      if (multi) {
        const initialSelection = initialValue.map((val: any) => {
          return options.filter((option: any) => {
            return option[name] === val;
          })[0];
        });
        initialSelection[0] && setInputValue(initialSelection);
      }
    }
  }, [options]);
  return (
    <>
      <Select
        overrides={{ Root: { style: { marginTop: '20px' } } }}
        options={props.options}
        creatable={props.creatable ? true : false}
        placeholder={props.placeholder}
        valueKey={props.valueKey}
        maxDropdownHeight={props.maxDropdownHeight}
        multi={props.multi}
        onChange={(params) => {
          setInputValue(params.value);
          if (!props.multi) {
            if (params.value[0]) {
              helpers.setValue(params.value[0][props.name]);
            } else {
              helpers.setValue('');
            }
          } else {
            if (params.value[0]) {
              helpers.setValue(params.value.map((obj) => obj[props.name]));
            } else {
              helpers.setValue([]);
            }
          }
        }}
        value={inputValue}
      />
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

export default SelectInput;
