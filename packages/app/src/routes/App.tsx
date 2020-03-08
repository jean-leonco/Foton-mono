import React from 'react';
import {
  createBottomTabNavigator,
  BottomTabBarOptions,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ProductList from '../modules/productList/ProductList';
import Create from '../modules/create/Create';
import Profile from '../modules/profile/Profile';

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  const screenOptions: BottomTabNavigationOptions = {
    unmountOnBlur: true,
  };

  const tabBarOptions: BottomTabBarOptions = {
    keyboardHidesTabBar: true,
    activeTintColor: '#4b3bff',
    inactiveTintColor: '#333',
    style: {
      backgroundColor: '#fff',
      borderTopWidth: 0,
    },
  };

  const DashboardOptions: BottomTabNavigationOptions = {
    tabBarIcon: ({ color }) => <Icon name="dashboard" size={20} color={color} />, //eslint-disable-line react/display-name
  };

  const CreateOptions: BottomTabNavigationOptions = {
    tabBarIcon: ({ color }) => <Icon name="library-add" size={20} color={color} />, //eslint-disable-line react/display-name
  };

  const ProfileOptions: BottomTabNavigationOptions = {
    tabBarIcon: ({ color }) => <Icon name="person" size={20} color={color} />, //eslint-disable-line react/display-name
  };

  return (
    <Tab.Navigator screenOptions={screenOptions} tabBarOptions={tabBarOptions}>
      <Tab.Screen name="ProductList" component={ProductList} options={DashboardOptions} />
      <Tab.Screen name="Create" component={Create} options={CreateOptions} />
      <Tab.Screen name="Profile" component={Profile} options={ProfileOptions} />
    </Tab.Navigator>
  );
};

export default App;
