import { useField } from 'formik';
import { useStyletron } from 'baseui';
import { Textarea } from 'baseui/textarea';

interface ITextAreaFieldProps {
  id: string;
  name: string;
  placeholder: string;
  clearOnEscape: boolean;
  overrides?: any;
  onClick?: any;
}

const TextArea = (props: ITextAreaFieldProps) => {
  const [css] = useStyletron();
  const [field, meta] = useField(props);
  return (
    <div
      className={css({
        marginTop: '0px',
      })}
    >
      <Textarea {...field} {...props} />
      {meta.touched && meta.error ? (
        <div
          className={css({
            color: 'red',
          })}
        >
          {meta.error}
        </div>
      ) : null}
    </div>
  );
};

export default TextArea;
