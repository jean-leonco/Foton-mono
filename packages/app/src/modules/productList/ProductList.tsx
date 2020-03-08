import React, { useEffect, useState } from 'react';
import { Animated, ActivityIndicator, View } from 'react-native';
import { graphql, usePagination, useQuery } from 'relay-hooks';
import styled from 'styled-components/native';

import Text from '../common/Text';
import SearchInput from '../common/SearchInput';
import Space from '../common/Space';

import Empty from './Empty';
import Product from './Product';

import { ProductListQuery } from './__generated__/ProductListQuery.graphql';
import { ProductList_query$key } from './__generated__/ProductList_query.graphql';

const Container = styled.SafeAreaView`
  flex: 1;
  padding: 20px;
  background: #fff;
`;

const opacity = new Animated.Value(500);
const offset = new Animated.ValueXY({ x: 250, y: 0 });

interface Props {
  query: any;
}

const ProductList: React.FC<Props> = props => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [query, { isLoading, hasMore, loadMore, refetchConnection }] = usePagination<ProductList_query$key>(
    graphql`
      fragment ProductList_query on Query
        @argumentDefinitions(
          first: { type: "Int!", defaultValue: 10 }
          cursor: { type: String }
          search: { type: String }
        ) {
        products(first: $first, after: $cursor, search: $search) @connection(key: "ProductList_products") {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              ...Product_product
            }
          }
        }
      }
    `,
    props.query,
  );

  const refetchQuery = graphql`
    query ProductListPaginationQuery($first: Int!, $cursor: String, $search: String) {
      ...ProductList_query @arguments(first: $first, cursor: $cursor, search: $search)
    }
  `;

  const _loadMore = () => {
    if (isLoading() || !hasMore()) {
      return;
    }

    loadMore(
      {
        getVariables(props, { first, cursor, search }) {
          return {
            first,
            cursor,
            search,
          };
        },
        query: refetchQuery,
      },
      10,
      () => {},
      {},
    );
  };

  const refresh = () => {
    if (isRefreshing) {
      return;
    }
    setIsRefreshing(true);

    refetchConnection(
      {
        getVariables(props, { first, cursor, search }) {
          return {
            first,
            cursor,
            search,
          };
        },
        query: refetchQuery,
      },
      10,
      () => {},
      { first: 10 },
    );
    setIsRefreshing(false);
  };

  const handleSearch = (value: string) => {
    if (isRefreshing) {
      return;
    }
    setIsRefreshing(true);

    refetchConnection(
      {
        getVariables(props, { first, cursor, search }) {
          return {
            first,
            cursor,
            search,
          };
        },
        query: refetchQuery,
      },
      10,
      () => {},
      { first: 10, search: value },
    );
    setIsRefreshing(false);
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(offset.x, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),

      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const { edges } = query.products;

  return (
    <Container>
      <Text size={25} weight="bold">
        Dashboard
      </Text>
      <SearchInput handleSearch={handleSearch} />
      <Space height={10} />

      <Animated.FlatList
        style={[{ transform: [...offset.getTranslateTransform()] }, { opacity }]}
        data={edges}
        keyExtractor={(item: any) => item.node.id}
        onEndReached={_loadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={isLoading() && !isRefreshing && <ActivityIndicator color="#999" size={20} />}
        onRefresh={refresh}
        refreshing={isRefreshing}
        renderItem={({ item }) => <Product product={item.node} />}
        ListEmptyComponent={<Empty />}
      />
    </Container>
  );
};

const ProductListWrapper: React.FC = () => {
  const { props } = useQuery<ProductListQuery>(
    graphql`
      query ProductListQuery {
        ...ProductList_query
      }
    `,
    { first: 10 },
    {},
  );

  if (props) {
    return <ProductList query={props} />;
  }
  return <View />;
};

export default ProductListWrapper;
