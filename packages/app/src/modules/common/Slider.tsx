import React from 'react';
import ReactSlider from '@react-native-community/slider'; //eslint-disable-line
import styled from 'styled-components/native';
import { useFormikContext } from 'formik';

const Container = styled.View`
  flex-direction: column;
`;

const Header = styled.View`
  margin-bottom: 5px;

  flex-direction: row;
  justify-content: space-between;
`;

const Label = styled.Text`
  font-size: 18px;
  color: #333;
`;

const Value = styled.Text`
  font-size: 18px;
  color: #999;
`;

const Error = styled.Text`
  color: #ef3d52;
  font-size: 12px;
`;

interface Props {
  label: string;
  name: string;
}

const Slider: React.FC<Props> = ({ label, name }) => {
  const { values, setFieldValue, errors } = useFormikContext<any>();

  return (
    <Container>
      <Header>
        <Label>{label}</Label>
        <Value>$ {values[name]}</Value>
      </Header>

      <ReactSlider
        step={0.5}
        onValueChange={value => setFieldValue(name, value)}
        maximumValue={100}
        minimumValue={0}
        thumbTintColor="#999"
        minimumTrackTintColor="#4b3bff"
        style={{
          height: 45,
        }}
      />
      <Error>{errors[name]}</Error>
    </Container>
  );
};

export default Slider;
