import { useState } from 'react';
import { useStyletron } from 'baseui';
import { useField } from 'formik';
import { Input } from 'baseui/input';

interface INumberFormFieldProps {
  id: string;
  name: string;
  placeholder: string;
  clearOnEscape: boolean;
  overrides?: any;
  initialValue?: number;
}

const NumberInput = (props: INumberFormFieldProps) => {
  const [css] = useStyletron();
  const [, meta, helpers] = useField(props);
  const [value, setValue] = useState(
    props.initialValue ? props.initialValue : undefined
  );
  return (
    <>
      <Input
        type='number'
        value={value}
        initialValue={props.initialValue ? props.initialValue : undefined}
        onChange={(e) => {
          helpers.setValue(
            parseInt(e.currentTarget.value)
              ? parseInt(e.currentTarget.value)
              : 0
          );
          setValue(
            parseInt(e.currentTarget.value)
              ? parseInt(e.currentTarget.value)
              : undefined
          );
        }}
        {...props}
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

export default NumberInput;
