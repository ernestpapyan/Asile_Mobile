import styles from './styles';
import Home from '../screens/HomeScreen';
import ScheduleScreen from '../screens/ScheduleScreen'
import CheckinScreen from '../screens/CheckinScreen'
import CheckoutScreen from '../screens/CheckoutScreen'
import ClientDBScreen from '../screens/ClientDBScreen'
import CreateClientScreen from '../screens/CreateClientScreen'
import ResourceScreen from '../screens/ResourceScreen'
import { NavigationContainer } from '@react-navigation/native';

import { createSwitchNavigator } from "react-navigation";
export const MainStack = createSwitchNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        header: null,
      },
    },
    Schedule: {
      screen: ScheduleScreen,
      navigationOptions: {
        header: null,
      },
    },
    Checkin: {
      screen: CheckinScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    Checkout: {
      screen: CheckoutScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    ClientDB: {
      screen: ClientDBScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    CreateClientScreen: {
      screen: CreateClientScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    ResourceScreen: {
      screen: ResourceScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
  },
  {
    initialRouteName: 'Home',
  },
);
