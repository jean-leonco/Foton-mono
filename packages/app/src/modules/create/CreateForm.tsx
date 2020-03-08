import React from 'react';
import { FormikProvider, FormikProps } from 'formik';
import styled from 'styled-components/native';

import FormikInput from '../common/FormikInput';
import Space from '../common/Space';
import Slider from '../common/Slider';
import Button from '../common/Button';

const Form = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
})`
  align-self: stretch;
  margin-top: 25px;
  padding: 10px;
`;

interface Props {
  loading: boolean;
  fields: {
    name: string;
    label?: string;
    config: any;
  }[];
  formik: FormikProps<any>;
}

const CreateForm: React.FC<Props> = ({ loading, fields, formik }) => {
  const { handleSubmit, isValid } = formik;

  return (
    <FormikProvider value={formik}>
      <Form>
        {fields.map(field => (
          <React.Fragment key={field.name}>
            <FormikInput name={field.name} label={field.label || field.name} {...field.config} />
            <Space height={20} />
          </React.Fragment>
        ))}

        <Slider label="Price" name="price" />
        <Space height={20} />

        <Space height={20} />
        <Button loading={loading} empty={!isValid} onPress={handleSubmit}>
          Create Product
        </Button>
      </Form>
    </FormikProvider>
  );
};

export default CreateForm;
