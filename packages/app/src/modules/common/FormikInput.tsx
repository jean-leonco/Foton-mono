import React from 'react';
import { TextInput } from 'react-native';
import styled from 'styled-components/native';
import { useFormikContext } from 'formik';

const Container = styled.View`
  flex-direction: column;
`;

const Label = styled.Text`
  font-size: 18px;
  color: #333;

  margin-bottom: 5px;
`;

const TInput = styled.TextInput.attrs({
  placeholderTextColor: '#999',
})`
  height: 45px;
  color: rgba(0, 0, 0, 0.7);
  font-size: 16px;

  border: 1px solid #ddd;
  border-radius: 4px;

  padding: 0 10px;
`;

const Error = styled.Text`
  color: #ef3d52;
  font-size: 12px;
`;

interface Props extends TextInput {
  label: string;
  name: string;
}

const FormikInput: React.FC<Props> = ({ name, label, ...props }) => {
  const { values, handleChange, handleBlur, errors } = useFormikContext<any>();

  return (
    <Container>
      <Label>{label}</Label>
      <TInput onChangeText={handleChange(name)} onBlur={handleBlur(name)} value={values[name]} {...props} />
      <Error>{errors[name]}</Error>
    </Container>
  );
};

export default FormikInput;
