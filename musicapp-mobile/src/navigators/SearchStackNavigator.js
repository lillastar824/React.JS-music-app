import { createAppContainer, createBottomTabNavigator, createStackNavigator } from 'react-navigation';

import SearchScreen from "../screens/SearchScreen"
import NowPlayingScreen from "../screens/NowPlayingScreen"
import NowPlayingVideoScreen from "../screens/NowPlayingVideoScreen"

const SearchStackNavigator = createStackNavigator({

    SearchScreen: { screen: SearchScreen },
    NowPlaying: { screen: NowPlayingScreen },
    NowPlayingVideo: { screen: NowPlayingVideoScreen },

}, {
        headerMode: 'none'
    }
)

export default createAppContainer(SearchStackNavigator);