import React, { useMemo } from 'react';
import { useLazyLoadQuery, graphql } from 'relay-hooks';
import { useRoute, RouteProp, ParamListBase } from '@react-navigation/native';
import { parseISO, format } from 'date-fns';
import styled from 'styled-components/native';

import Space from '../common/Space';
import Row from '../common/Row';
import Text from '../common/Text';

import { DetailsQuery } from './__generated__/DetailsQuery.graphql';

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background: #fff;
`;

interface Router extends RouteProp<ParamListBase, string> {
  params: {
    id: string;
  };
}

const Details: React.FC = () => {
  const route = useRoute<Router>();

  const { props } = useLazyLoadQuery<DetailsQuery>(
    graphql`
      query DetailsQuery($id: ID!) {
        product(id: $id) {
          name
          description
          price
          createdAt
        }
      }
    `,
    { id: route.params.id },
    {},
  );

  const { product } = props;

  const shapeDate = useMemo(() => format(parseISO(product!.createdAt!), "MMMM dd', ' yyyy"), [product]);

  return (
    <Container>
      <Text size={25} weight="bold">
        {product!.name}
      </Text>
      <Space height={10} />

      <Row align="flex-start">
        <Text color="#666" size={18}>
          Description:{' '}
        </Text>
        <Text size={16} weight="bold">
          {product!.description}
        </Text>
      </Row>
      <Space height={10} />

      <Row align="flex-start">
        <Text color="#666" size={18}>
          Price:{' '}
        </Text>
        <Text size={16} weight="bold">
          ${product!.price}
        </Text>
      </Row>
      <Space height={10} />

      <Row align="flex-start">
        <Text color="#666" size={18}>
          Created at:{' '}
        </Text>
        <Text size={16} weight="bold">
          {shapeDate}
        </Text>
      </Row>
    </Container>
  );
};

export default Details;
