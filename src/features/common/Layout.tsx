import React from 'react';
import { Grid, Cell } from 'baseui/layout-grid';
import { useStyletron } from 'styletron-react';

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  const [css] = useStyletron();
  return (
    <Grid>
      <Cell span={12}>
        <div className={css({ padding: '50px 0' })}>{props.children}</div>
      </Cell>
    </Grid>
  );
};

export default Layout;
