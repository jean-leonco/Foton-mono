import React from 'react';
import styled from 'styled-components/native';

const Container = styled.SafeAreaView`
  background: #fff;
  padding: 20px;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  color: #333;
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

const Error = styled.Text`
  color: #999;
  font-size: 14px;
`;

type Props = {
  error: string;
};

const ErrorScreen: React.FC<Props> = ({ error }) => {
  return (
    <Container>
      <Title>Oops, an error occurred. Try again later</Title>
      <Error>Error: {error}</Error>
    </Container>
  );
};

export default ErrorScreen;
