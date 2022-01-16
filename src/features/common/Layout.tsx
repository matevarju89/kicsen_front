import React from 'react';
import { Grid, Cell } from 'baseui/layout-grid';
import { useStyletron } from 'styletron-react';

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  const [css] = useStyletron();
  return (
    <>
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
          <div className={css({ padding: '50px 0' })}>{props.children}</div>
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
        <p
          className='copyright'
          style={{ color: '#fff' }}
        >{`Made By Mate © ${new Date().getFullYear()}`}</p>
      </footer>
    </>
  );
};

export default Layout;
