import React from 'react';
import { useMutation, graphql } from 'relay-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import { showMessage } from 'react-native-flash-message';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';

import AuthForm from './AuthForm';
import { SignInMutationResponse, SignInMutation } from './__generated__/SignInMutation.graphql';

const SignIn: React.FC = () => {
  const navigation = useNavigation();

  const [mutate, { loading }] = useMutation<SignInMutation>(
    graphql`
      mutation SignInMutation($input: UserLoginWithEmailInput!) {
        UserLoginWithEmail(input: $input) {
          token
          error
        }
      }
    `,
    {
      onCompleted: async ({ UserLoginWithEmail }: SignInMutationResponse) => {
        if (UserLoginWithEmail!.error && !UserLoginWithEmail!.token) {
          showMessage({
            message: 'Registration failed',
            description: UserLoginWithEmail!.error,
            type: 'danger',
            icon: 'info',
          });
        } else {
          await AsyncStorage.setItem('token', UserLoginWithEmail!.token!);
          navigation.reset({
            routes: [{ name: 'Me' }],
          });
        }
      },
      onError: () => {
        showMessage({
          message: 'Registration failed',
          description: 'Network request failed',
          type: 'danger',
          icon: 'info',
        });
      },
    },
  );

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email('E-mail needs to be a valid e-mail')
        .required('E-mail is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: input => {
      mutate({
        variables: {
          input: input,
        },
      });
    },
  });

  const fields = [
    {
      name: 'email',
      label: 'E-mail',
      config: {
        keyboardType: 'email-address',
        autoCorrect: false,
        autoCapitalize: 'none',
        placeholder: 'Your e-mail',
        returnKeyType: 'next',
      },
    },
    {
      name: 'password',
      label: 'Password',
      config: {
        secureTextEntry: true,
        placeholder: 'Your password',
        returnKeyType: 'send',
      },
    },
  ];

  return (
    <AuthForm
      loading={loading}
      fields={fields}
      formik={formik}
      submitText="Login"
      returnLink={{ label: 'Need an account? Sign up', to: 'SignUp' }}
    />
  );
};

export default SignIn;
