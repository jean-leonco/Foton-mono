import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Text from '../common/Text';
import Space from '../common/Space';
import Column from '../common/Column';

const Empty: React.FC = () => {
  return (
    <>
      <Space height={30} />
      <Column>
        <Icon name="not-interested" size={45} color="#999" />
        <Space height={10} />
        <Text color="#999" size={25}>
          There is no product to show
        </Text>
      </Column>
    </>
  );
};

export default Empty;
