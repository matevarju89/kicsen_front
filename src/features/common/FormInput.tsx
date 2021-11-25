import { useField } from 'formik';
import { useStyletron } from 'baseui';
import { Input } from 'baseui/input';

interface IFormFieldProps {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  clearOnEscape: boolean;
}

const FormInput = (props: IFormFieldProps) => {
  const [css] = useStyletron();
  const [field, meta] = useField(props);
  return (
    <>
      <Input {...field} {...props} />
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

export default FormInput;
