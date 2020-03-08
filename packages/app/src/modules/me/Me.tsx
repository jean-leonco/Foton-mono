import React, { useEffect } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';

import { setToken } from '../../relay/Environment';

const Me: React.FC = () => {
  const navigation = useNavigation();

  useEffect(() => {
    async function getToken() {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        setToken(token as string);
        navigation.navigate('App');
      } else {
        navigation.navigate('SignIn');
      }
    }

    getToken();
  }, [navigation]);

  return <View />;
};

export default Me;
