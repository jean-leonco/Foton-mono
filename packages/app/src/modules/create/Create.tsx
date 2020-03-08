import React from 'react';
import { useMutation, graphql } from 'relay-hooks';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import CreateForm from './CreateForm';
import { CreateMutationResponse, CreateMutation } from './__generated__/CreateMutation.graphql';

const Container = styled.View`
  background: #fff;
  flex: 1;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 25px;
  align-self: flex-start;
  font-weight: bold;
  color: #333;
`;

const Create: React.FC = () => {
  const navigation = useNavigation();

  const [mutate, { loading }] = useMutation<CreateMutation>(
    graphql`
      mutation CreateMutation($input: CreateProductInput!) {
        CreateProductMutation(input: $input) {
          product {
            _id
            id
            name
            description
          }
          error
        }
      }
    `,
    {
      onCompleted: ({ CreateProductMutation }: CreateMutationResponse) => {
        if (CreateProductMutation && CreateProductMutation.error && !CreateProductMutation.product) {
          showMessage({
            message: 'Creation failed',
            description: CreateProductMutation.error,
            type: 'danger',
            icon: 'info',
          });
        } else {
          navigation.navigate('Details', {
            screen: 'Details',
            params: { id: CreateProductMutation?.product!.id },
          });
        }
      },
      onError: () => {
        showMessage({
          message: 'Creation failed',
          description: 'Creation failed',
          type: 'danger',
          icon: 'info',
        });
      },
    },
  );

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: 0,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required('Name is required')
        .max(25, "Name can't be more than 25"),
      description: Yup.string()
        .required('Description is required')
        .max(140, "Description can't be more than 140"),
      price: Yup.number().min(1, 'Value must be more than $1'),
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
        placeholder: 'Product name',
        label: 'Name',
        returnKeyType: 'next',
      },
    },
    {
      name: 'description',
      label: 'Description',
      config: {
        multiline: true,
        autoCorrect: false,
        autoCapitalize: 'none',
        placeholder: 'A little about the product',
        returnKeyType: 'next',
      },
    },
  ];

  return (
    <Container>
      <Title>Create a new Product</Title>
      <CreateForm loading={loading} fields={fields} formik={formik} />
    </Container>
  );
};

export default Create;
