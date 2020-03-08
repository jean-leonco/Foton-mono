import React from 'react';
import { FormikProvider, FormikProps } from 'formik';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';

import Space from '../common/Space';
import FormikInput from '../common/FormikInput';
import Button from '../common/Button';

import logo from '../../assets/logo.png';

const Container = styled.View`
  background: #fff;
  padding: 20px;
  flex: 1px;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.Image`
  width: 100px;
  height: 100px;
`;

const Form = styled.KeyboardAvoidingView`
  align-self: stretch;
  margin-top: 50px;
`;

const RetunText = styled.Text`
  color: #333;
  font-size: 16px;
  align-self: center;
`;

interface Props {
  loading: boolean;
  fields: {
    name: string;
    label?: string;
    config: any;
  }[];
  formik: FormikProps<any>;
  submitText: string;
  returnLink: { label: string; to: string };
}

const AuthForm: React.FC<Props> = ({ loading, fields, formik, submitText, returnLink }) => {
  const navigation = useNavigation();

  const { handleSubmit, isValid } = formik;

  return (
    <Container>
      <Logo source={logo} />

      <FormikProvider value={formik}>
        <Form>
          {fields.map(field => (
            <React.Fragment key={field.name}>
              <FormikInput name={field.name} label={field.label || field.name} {...field.config} />
              <Space height={10} />
            </React.Fragment>
          ))}
          <Space height={10} />

          <Button loading={loading} empty={!isValid} onPress={() => handleSubmit()}>
            {submitText}
          </Button>

          <Space height={40} />

          <TouchableOpacity onPress={() => navigation.navigate(returnLink.to)}>
            <RetunText>{returnLink.label}</RetunText>
          </TouchableOpacity>
        </Form>
      </FormikProvider>
    </Container>
  );
};

export default AuthForm;
