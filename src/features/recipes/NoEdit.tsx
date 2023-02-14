import { useContext } from 'react';
import { useAppSelector } from '../../app/hooks';
import { CurrentFamilyContext } from '../common/Layout';
import { userSelector } from '../user/userSlice';
import { useTranslation } from 'react-i18next';
import { StyledLink } from 'baseui/link';
import { useHistory } from 'react-router-dom';
import { useStyletron } from 'baseui';

const NoEdit = (props: { children: React.ReactNode }) => {
  const { currentFamily } = useContext(CurrentFamilyContext);
  const { ownFamily } = useAppSelector(userSelector);
  const { t } = useTranslation();
  const [css] = useStyletron();
  const history = useHistory();
  const isOwnFamily =
    currentFamily && ownFamily && currentFamily.id === ownFamily.id;
  return (
    <>
      {isOwnFamily && props.children}
      {!isOwnFamily && (
        <>
          <h3>
            {t('Sorry, you can add or edit recipes only in your own family')}
          </h3>
          <span
            className={css({
              cursor: 'pointer',
            })}
          >
            <StyledLink
              onClick={() => {
                history.push('/user');
              }}
            >
              {t('Change family settings')}
            </StyledLink>
          </span>
        </>
      )}
    </>
  );
};

export default NoEdit;
