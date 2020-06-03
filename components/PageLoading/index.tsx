import React from 'react';
import { Spin } from 'antd';
import { Root } from './style';
const PageLoading: React.FC = () => {
  return (
    <Root>
      <Spin />
    </Root>
  )
}

export default PageLoading;