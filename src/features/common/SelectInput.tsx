import { useState } from 'react';
import { useField } from 'formik';
import { useStyletron } from 'baseui';
import { Select, Value } from 'baseui/select';
import { useTranslation } from 'react-i18next';

const SelectInput = (props: any) => {
  const [css] = useStyletron();
  const [t] = useTranslation();
  const [inputValue, setInputValue] = useState<Value>([]);
  const [field, meta, helpers] = useField(props);
  return (
    <>
      <Select
        overrides={{ Root: { style: { marginTop: '20px' } } }}
        options={props.options}
        placeholder={props.placeholder}
        valueKey={props.valueKey}
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
