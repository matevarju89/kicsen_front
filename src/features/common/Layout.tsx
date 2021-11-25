import React from 'react';
import { Grid, Cell } from 'baseui/layout-grid';

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  return (
    <Grid>
      <Cell span={12}>{props.children}</Cell>
    </Grid>
  );
};

export default Layout;
