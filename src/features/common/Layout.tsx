import React from 'react';
import { Grid, Cell } from 'baseui/layout-grid';
import { useStyletron } from 'baseui';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadUserBase, userSelector } from '../user/userSlice';
import { authSelector } from '../auth/authSlice';
import Cookies from 'universal-cookie';
import { FamilyData } from '../user/types';
export interface LayoutProps {
  children: React.ReactNode;
}

/*const cookies = new Cookies();
const currentFamilyFromCookie = cookies.get('cur_fam')
  ? cookies.get('cur_fam')
  : null;*/

const currentFamily_from_storage = window.localStorage.getItem('cur_fam')
  ? (window.localStorage.getItem('cur_fam') as string)
  : null;
export interface ICurrentFamilyContext {
  currentFamily: FamilyData | null;
  setCurrentFamily: React.Dispatch<React.SetStateAction<FamilyData | null>>;
}
const currentFamilyObjDefaults: ICurrentFamilyContext = {
  currentFamily: null,
  setCurrentFamily: () => null,
};
export const CurrentFamilyContext = React.createContext(
  currentFamilyObjDefaults
);

const Layout = (props: LayoutProps) => {
  const [css, theme] = useStyletron();
  const dispatch = useAppDispatch();
  const { username } = useAppSelector(authSelector);
  const { families } = useAppSelector(userSelector);
  const [currentFamily, setCurrentFamily] = React.useState<FamilyData | null>(
    null
  );
  React.useEffect(() => {
    dispatch(loadUserBase(username));
  }, [username]);
  React.useEffect(() => {
    if (Array.isArray(families)) {
      const currentFam =
        families.length > 0 && currentFamily_from_storage
          ? families?.filter((fam) => {
              return fam.id === currentFamily_from_storage;
            })[0]
          : families.length > 0
          ? families[0]
          : null;
      setCurrentFamily(currentFam);
    }
  }, [families]);
  return (
    <CurrentFamilyContext.Provider value={{ currentFamily, setCurrentFamily }}>
      <Grid
        overrides={{
          Grid: {
            style: {
              paddingBottom: '60px',
            },
          },
        }}
      >
        <Cell span={12}>
          <div
            className={css({
              padding: '30px 0',
              [theme.mediaQuery.medium]: { padding: '50px 0' },
            })}
          >
            {props.children}
          </div>
        </Cell>
      </Grid>
      <footer
        style={{
          background: '#000',
          height: '60px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'absolute',
          bottom: '0',
          left: '0',
          width: '100%',
        }}
      >
        <ul style={{ paddingLeft: '0' }}>
          <li className='list-inline-item'>
            <a href='/' style={{ color: '#fff', textDecoration: 'none' }}>
              Kicsen App
            </a>
          </li>
        </ul>
        <p className='copyright' style={{ color: '#fff' }}>
          Made with <span>&#10084;</span> by Mate © {new Date().getFullYear()}
        </p>
      </footer>
    </CurrentFamilyContext.Provider>
  );
};

export default Layout;
