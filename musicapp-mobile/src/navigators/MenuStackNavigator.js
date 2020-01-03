import { createAppContainer, createBottomTabNavigator, createStackNavigator } from 'react-navigation';

import EditProfileScreen from "../screens/EditProfileScreen"
import MenuScreen from "../screens/MenuScreen"
import NowPlayingScreen from "../screens/NowPlayingScreen"
import NowPlayingVideoScreen from "../screens/NowPlayingVideoScreen"

const MenuStackNavigator = createStackNavigator({

    Menu: { screen: MenuScreen },
    EditProfile: { screen: EditProfileScreen },
    NowPlaying: { screen: NowPlayingScreen },
    NowPlayingVideo: { screen: NowPlayingVideoScreen },

}, {
        headerMode: 'none'
    }
)

export default createAppContainer(MenuStackNavigator);