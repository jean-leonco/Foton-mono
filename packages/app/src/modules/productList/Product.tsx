import React, { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import { useFragment, graphql } from 'relay-hooks';
import styled from 'styled-components/native';
import { formatDistance, parseISO } from 'date-fns';

import Text from '../common/Text';
import Space from '../common/Space';

import { Product_product$key } from './__generated__/Product_product.graphql';

const Container = styled(RectButton)`
  margin-bottom: 20px;
  padding: 10px;
`;

interface Props {
  product: Product_product$key;
}

const Product: React.FC<Props> = props => {
  const navigation = useNavigation();

  const product = useFragment<Product_product$key>(
    graphql`
      fragment Product_product on Product {
        id
        name
        createdAt
      }
    `,
    props.product,
  );

  const formatDate = useMemo(() => formatDistance(parseISO(product.createdAt!), new Date()), []);

  return (
    <Container
      onPress={() =>
        navigation.navigate('Details', {
          screen: 'Details',
          params: { id: product.id },
        })
      }
    >
      <Text size={18} weight="bold">
        {product.name}
      </Text>
      <Space height={10} />

      <Text color="#999">{formatDate}</Text>
    </Container>
  );
};

export default Product;
