import { createAppContainer, createMaterialTopTabNavigator } from 'react-navigation';

import {
    widthSizer,
    fontSizer,
    isTablet
} from "../utils/MethodUtils"

import MusicScreen from "../screens/HomeTab/MusicScreen"
import VideoScreen from "../screens/HomeTab/VideoScreen"

import Constant from '../constant/Constant';

const HomeTabNavigator = createMaterialTopTabNavigator({

    Music: { screen: MusicScreen },
    Videos: { screen: VideoScreen },

},
    {
        initialRouteName: 'Music',
        headerMode: 'none',
        swipeEnabled: false,
        lazy: true,
        tabBarOptions: {
            activeTintColor: Constant.COLOR_MAIN,
            inactiveTintColor: Constant.COLOR_WHITE,
            upperCaseLabel: false,
            style: {
                backgroundColor: Constant.COLOR_BACK_BLACK,
                height: fontSizer(50),
            },
            indicatorStyle: {
                backgroundColor: Constant.COLOR_MAIN
            },
            labelStyle: {
                fontSize: fontSizer(18),
                letterSpacing: 1.2,
                fontFamily: Constant.FONT_CORKI_REGULAR
            }
        },
    }
);

export default createAppContainer(HomeTabNavigator);