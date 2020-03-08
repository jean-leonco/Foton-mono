import React, { useCallback } from 'react';
import styled from 'styled-components/native';
import { useNavigation, StackActions, NavigationAction } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import Button from '../common/Button';
import Space from '../common/Space';
import Row from '../common/Column';
import Text from '../common/Text';

const Container = styled.View`
  background: #fff;
  flex: 1;
  padding: 20px;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

const Profile: React.FC = () => {
  const navigation = useNavigation();

  const handleLogout = useCallback(async () => {
    await AsyncStorage.removeItem('token');
    navigation.reset({
      routes: [{ name: 'Me' }],
    });
  }, [navigation]);

  return (
    <Container>
      <Text size={25} weight="bold">
        Profile
      </Text>
      <Space height={10} />

      <Row flex={1}>
        <StyledButton onPress={handleLogout}>log out</StyledButton>
      </Row>
    </Container>
  );
};

export default Profile;
