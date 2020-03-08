import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View<Props>`
  flex-direction: column;
  align-items: ${props => props.justify || 'center'};
  justify-content: ${props => props.align || 'center'};
  flex: ${props => props.flex || '0 1 auto'};
`;

interface Props {
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  align?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
  flex?: string | number;
}

const Row: React.FC<Props> = ({ children, ...props }) => {
  return <Container {...props}>{children}</Container>;
};

export default Row;
