import React, { cloneElement } from 'react';
import styled from 'styled-components';

type Props = {
  className?: string;
  renderer: React.ReactElement;
}

const Container: React.FC<Props> = ({ children, renderer, className }) => {
  return cloneElement(renderer, {
    className,
    children,
  })
}

const StyledComponent = styled(Container)`
  width: 100%;
  padding: 0 20px;
  margin: 0 auto;
`;

export default StyledComponent;
