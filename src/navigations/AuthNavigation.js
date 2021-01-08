import styles from './styles';
import LoginScreen from '../screens/LoginScreen';
import {default as RegisterScreen} from "../screens/LoginScreen/RegisterScreen";
// import {default as ProviderRegisterScreen} from "_providers/RegisterScreen";
import {default as SplashScreen} from "../screens/LoginScreen/SplashScreen";
import {default as ForgotPasswordScreen} from "../screens/LoginScreen/ForgotPassword";
import {createSwitchNavigator} from "react-navigation";

export const AuthNavigationStack = createSwitchNavigator(
    {
        SplashScreen: {
          screen: SplashScreen,
          navigationOptions: {
              header: null
          }
        },
        Login: {
            screen: LoginScreen,
            navigationOptions: {
                header: null
            }
        },
        Register: {
            screen: RegisterScreen,
            navigationOptions: {
                header: null
            }
        },
        ForgotPassword: {
            screen: ForgotPasswordScreen,
            navigationOptions: {
                header: null
            }
        }
    },
    {
        initialRouteName: 'SplashScreen'
    });