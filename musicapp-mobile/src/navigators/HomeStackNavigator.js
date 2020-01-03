import { createAppContainer, createBottomTabNavigator, createStackNavigator } from 'react-navigation';

import HomeScreen from "../screens/HomeScreen"
import NowPlayingScreen from "../screens/NowPlayingScreen"
import NowPlayingVideoScreen from "../screens/NowPlayingVideoScreen"

const HomeStackNavigator = createStackNavigator({

    HomeScreen: { screen: HomeScreen },
    NowPlaying: { screen: NowPlayingScreen },
    NowPlayingVideo: { screen: NowPlayingVideoScreen },

}, {
        headerMode: 'none'
    }
)

export default createAppContainer(HomeStackNavigator);