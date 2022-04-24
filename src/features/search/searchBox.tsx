import React from 'react';
import { useStyletron } from 'baseui';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { useTranslation } from 'react-i18next';

const SearchBox = (props: any) => {
  const [css] = useStyletron();
  const [value, setValue] = React.useState('');
  const [t] = useTranslation();
  return (
    <div
      className={css({
        background: '#00000008',
        borderRadius: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        color: '#000',
        marginBottom: '30px',
        padding: '20px',
      })}
    >
      <h2>{t("Discover the depht of your family's cookbook!")}</h2>
      <FormControl
        overrides={{
          ControlContainer: {
            style: {
              maxWidth: '500px',
              margin: 'auto',
            },
          },
        }}
      >
        <Input
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          placeholder={t('Search for a recipe name or ingredient')}
          clearOnEscape
          overrides={{
            Input: {
              style: {
                backgroundColor: '#fff',
              },
            },
          }}
        ></Input>
      </FormControl>
    </div>
  );
};

export default SearchBox;
