import React from 'react'
import { Image, StyleSheet } from "react-native"
import { createAppContainer, createBottomTabNavigator, TabBarBottom, createStackNavigator } from 'react-navigation';

import Icon from 'react-native-vector-icons/Entypo'
import IconEvil from 'react-native-vector-icons/EvilIcons'

import {
    widthSizer,
    fontSizer,
    isTablet
} from "../utils/MethodUtils"

import HomeMainStackScreen from "../screens/HomeMainStackScreen"
import SearchMainStackScreen from "../screens/SearchMainStackScreen"
import MenuMainStackScreen from "../screens/MenuMainStackScreen"

import MusicBottomBar from "../component/MusicBottomBar"
import Constant from '../constant/Constant';

const DashboardNavigator = createBottomTabNavigator({

    Home: {
        screen: HomeMainStackScreen,
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused }) => (
                <Icon name="home" size={fontSizer(isTablet() ? 18 : 21)} color={focused ? Constant.COLOR_GOLD : 'rgba(255,255,255,.5)'} />
            ),
            tabBarVisible: navigation.state.params ? navigation.state.params.fullscreen : true,
        }),
    },
    Search: {
        screen: SearchMainStackScreen,
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused }) => (
                <IconEvil name="search" size={fontSizer(isTablet() ? 20 : 27)} color={focused ? Constant.COLOR_GOLD : 'rgba(255,255,255,.5)'} />
            ),
            tabBarVisible: navigation.state.params ? navigation.state.params.fullscreen : true,
        }),
    },
    More: {
        screen: MenuMainStackScreen,
        navigationOptions: {
            tabBarIcon: ({ focused }) => (
                <Icon name="menu" size={fontSizer(isTablet() ? 20 : 23)} color={focused ? Constant.COLOR_GOLD : 'rgba(255,255,255,.5)'} />
            )
        },
    },

},
    {
        initialRouteName: 'Home',
        headerMode: 'none',
        tabBarOptions: {
            showLabel: false,
            style: {
                backgroundColor: Constant.COLOR_BACK_BLACK,
                borderTopColor: Constant.COLOR_GOLD,
                borderTopWidth: 1,
                height: isTablet() ? 80 : 45,
            }
        },
        tabBarComponent: props => <MusicBottomBar {...props} />,
    }
);

const styles = StyleSheet.create({
    tabIconView: {
        width: isTablet() ? 35 : 21,
        height: isTablet() ? 35 : 21
    }
})

export default createAppContainer(DashboardNavigator);