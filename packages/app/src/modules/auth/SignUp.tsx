import React from 'react';
import { useMutation, graphql } from 'relay-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import { showMessage } from 'react-native-flash-message';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';

import AuthForm from './AuthForm';
import { SignUpMutationResponse, SignUpMutation } from './__generated__/SignUpMutation.graphql';

const SignUp: React.FC = () => {
  const navigation = useNavigation();

  const [mutate, { loading }] = useMutation<SignUpMutation>(
    graphql`
      mutation SignUpMutation($input: UserRegisterWithEmailInput!) {
        UserRegisterWithEmail(input: $input) {
          token
          error
        }
      }
    `,
    {
      onCompleted: async ({ UserRegisterWithEmail }: SignUpMutationResponse) => {
        if (UserRegisterWithEmail!.error && !UserRegisterWithEmail!.token) {
          showMessage({
            message: 'Registration failed',
            description: UserRegisterWithEmail!.error,
            type: 'danger',
            icon: 'info',
          });
        } else {
          await AsyncStorage.setItem('token', UserRegisterWithEmail!.token!);
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
      name: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Name is required'),
      email: Yup.string()
        .email('E-mail needs to be a valid e-mail')
        .required('E-mail is required'),
      password: Yup.string()
        .required('Password is required')
        .min(4, 'Password must be more than 4')
        .max(16, "Password can't be more than 16"),
    }),
    onSubmit: input => {
      mutate({
        variables: {
          input,
        },
      });
    },
  });

  const fields = [
    {
      name: 'name',
      label: 'Name',
      config: {
        autoCorrect: false,
        autoCapitalize: 'none',
        placeholder: 'Full name',
        returnKeyType: 'next',
      },
    },
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
      submitText="Sign up"
      returnLink={{ label: 'Back to login', to: 'SignIn' }}
    />
  );
};

export default SignUp;
