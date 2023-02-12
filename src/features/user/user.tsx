import { useTranslation } from 'react-i18next';
import { userSelector } from './userSlice';

import { useStyletron } from 'baseui';
import Cookies from 'universal-cookie';
import { Button, KIND, SIZE, SHAPE } from 'baseui/button';
import { useAppSelector } from '../../app/hooks';
import { Avatar } from 'baseui/avatar';
import { useHistory } from 'react-router-dom';
import { useContext } from 'react';
import { CurrentFamilyContext } from '../common/Layout';
import { FamilyData } from './types';

const User = () => {
  const { t } = useTranslation();
  const [css] = useStyletron();
  const userData = useAppSelector(userSelector);
  const cookies = new Cookies();
  const history = useHistory();
  const { currentFamily, setCurrentFamily } = useContext(CurrentFamilyContext);
  const setLanguage = () => {
    const targetLanguage = userData.lang === 'Hu' ? 'En' : 'Hu';
    //cookies.set('language', targetLanguage);
    window.localStorage.setItem('language', targetLanguage);
    history.go(0);
  };
  const setFamily = (family: FamilyData) => {
    window.localStorage.setItem('cur_fam', family.id);
    //cookies.set('cur_fam', family.id);
    setCurrentFamily(family);
    history.go(0);
  };

  return (
    <>
      <h1>{`${t('Welcome')}, ${userData.username}`}</h1>
      {['64px'].map((size) => (
        <Avatar name={userData.username} size={size} key={size} />
      ))}
      <p className={css({ display: 'flex' })}>
        <span
          className={css({ display: 'inline-block', marginRight: '10px' })}
        >{`${t('Current language')}: ${t('English')}`}</span>
        <Button
          onClick={() => setLanguage()}
          kind={KIND.secondary}
          size={SIZE.mini}
          shape={SHAPE.pill}
        >
          {t('Switch to Hungarian')}
        </Button>
      </p>
      {currentFamily && Array.isArray(userData.families) ? (
        <>
          <p className={css({ display: 'flex' })}>
            <span
              className={css({ display: 'inline-block', marginRight: '10px' })}
            >{`${t('Currently viewed family')}: ${`${
              currentFamily.description
            } ${t('Family')}`}`}</span>
          </p>
          <p>
            <span className={css({ marginRight: '10px' })}>
              {t('Change Family')}:
            </span>
            {userData.families.length > 1 ? (
              userData.families
                ?.filter((fam) => fam.id !== currentFamily?.id)
                .map((fam) => (
                  <Button
                    onClick={() => setFamily(fam)}
                    kind={KIND.secondary}
                    size={SIZE.mini}
                    shape={SHAPE.pill}
                    key={fam.id}
                    overrides={{
                      BaseButton: {
                        style: { marginRight: '5px', marginBottom: '5px' },
                      },
                    }}
                  >
                    {`${fam.description} ${t('Family')}`}
                  </Button>
                ))
            ) : (
              <span>{t("You haven't been added to other families yet")}</span>
            )}
          </p>
        </>
      ) : (
        <p>{t('You are not part of a family')}</p>
      )}
    </>
  );
};

export default User;
