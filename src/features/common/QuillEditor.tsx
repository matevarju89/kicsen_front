import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { useField } from 'formik';
import { Textarea } from 'baseui/textarea';
import { useTranslation } from 'react-i18next';
import { useStyletron } from 'baseui';
import 'react-quill/dist/quill.snow.css';

interface IQuillEditorProps {
  id: string;
  name: string;
}

function QuillEditor(props: IQuillEditorProps) {
  const [t] = useTranslation();
  const [css] = useStyletron();
  const [field, meta, helpers] = useField(props);
  const [value, setValue] = useState(field.value);
  return (
    <>
      <ReactQuill
        theme='snow'
        value={value}
        onChange={(content) => {
          if (content === '<p><br></p>') {
            setValue('');
            helpers.setValue('');
            return;
          }
          setValue(content);
          helpers.setValue(content);
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
    </>
  );
}

export default QuillEditor;
