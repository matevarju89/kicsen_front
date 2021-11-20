import React from 'react';
import { Block } from 'baseui/block';

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  return (
    <>
      <Block
        width={['280px', '310px', '580px', '1134px']}
        margin='auto'
        padding={'20px 10px'}
      >
        {props.children}
      </Block>
    </>
  );
};

export default Layout;
