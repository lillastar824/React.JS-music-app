import { createStackNavigator, createAppContainer } from 'react-navigation';

import SplashScreen from "../screens/SplashScreen"
import LetsStartScreen from "../screens/LetsStartScreen"
import LoginSighupScreen from "../screens/LoginSighupScreen"
import LoginScreen from "../screens/LoginScreen"
import SignupScreen from "../screens/SignupScreen"
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen"
import VerificationScreen from "../screens/VerificationScreen"
import CustomWebviewScreen from "../screens/CustomWebviewScreen"
import ChangePasswordScreen from "../screens/ChangePasswordScreen"

import DashboardNavigator from "./DashboardNavigator"

const MainNavigator = createStackNavigator({

    Splash: { screen: SplashScreen },
    LetsStart: { screen: LetsStartScreen },
    LoginSighup: { screen: LoginSighupScreen },
    Login: { screen: LoginScreen },
    Signup: { screen: SignupScreen },
    ForgotPassword: { screen: ForgotPasswordScreen },
    Dashboard: { screen: DashboardNavigator },
    Verification: { screen: VerificationScreen },
    CustomWebview: { screen: CustomWebviewScreen },
    ChangePassword: { screen: ChangePasswordScreen },

},
    {
        initialRouteName: 'Splash',
        headerMode: 'none',
    }
);

export default createAppContainer(MainNavigator);