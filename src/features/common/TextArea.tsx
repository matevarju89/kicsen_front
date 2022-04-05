import { useField } from 'formik';
import { useStyletron } from 'baseui';
import { Textarea } from 'baseui/textarea';

interface ITextAreaFieldProps {
  id: string;
  name: string;
  placeholder: string;
  clearOnEscape: boolean;
}

const TextArea = (props: ITextAreaFieldProps) => {
  const [css] = useStyletron();
  const [field, meta] = useField(props);
  return (
    <div
      className={css({
        marginTop: '20px',
      })}
    >
      <Textarea
        {...field}
        {...props}
        overrides={{
          Input: {
            style: {
              maxHeight: '300px',
              minHeight: '100px',
              minWidth: '300px',
              width: '100vw',
              resize: 'both',
            },
          },
          InputContainer: {
            style: {
              maxWidth: '100%',
              width: 'min-content',
            },
          },
        }}
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
    </div>
  );
};

export default TextArea;
