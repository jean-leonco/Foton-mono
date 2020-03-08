import React from 'react';
import styled from 'styled-components/native';

const Container = styled.Text<Props>`
  color: ${props => props.color || '#333'};
  font-size: ${props => (props.size ? `${props.size}px` : '14px')};
  font-weight: ${props => props.weight || '500'};
`;

interface Props {
  color?: string;
  size?: number;
  weight?: string;
}

const Text: React.FC<Props> = ({ children, ...props }) => {
  return <Container {...props}>{children}</Container>;
};

export default Text;
