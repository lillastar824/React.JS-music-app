import React from 'react';
import { View, StyleSheet, Image, StatusBar } from 'react-native';

import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';

import {
  widthSizer,
  fontSizer,
  getStatusBarHeight
} from "../utils/MethodUtils"

import {
  setUserLoginDetails
} from "../action/ActionUserAuth"

import Constant from "../constant/Constant"
import TabBarHeader from "../component/TabBarHeader"

import HomeTabNavigator from "../navigators/HomeTabNavigator"
var navigationRef, thisRef;

class HomeScreen extends React.Component {

  componentDidMount() {
    Orientation.lockToPortrait();
    navigationRef = this.props.navigation
    thisRef = this
  }

  static manageChildStack = () => {
    navigationRef.popToTop();
  }

  static navigateToPlayScreen = () => {
    navigationRef.navigate("NowPlaying", { currentPlayingMusicDetails: thisRef.props.currentPlayingMusicDetails, fromSearch: false });
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={{
          height: Constant.SCREEN_HEIGHT * 0.075 + getStatusBarHeight(),
          paddingTop: getStatusBarHeight(),
          alignItems: 'center',
          justifyContent: "center",
          backgroundColor: Constant.COLOR_BACK_BLACK
        }} >

          <Image
            resizeMode={"contain"}
            style={{
              width: "100%",
              height: Constant.SCREEN_HEIGHT * 0.055
            }}
            source={require('../assets/images/ic_header_app_logo_new.png')} />

        </View>

        <View style={{ flex: 1 }} >
          <HomeTabNavigator screenProps={{ rootNavigation: this.props.navigation, mainNavigation: this.props.screenProps.rootNavigation }} />
        </View>

      </View>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    currentPlayingMusicDetails: store.MusicState.currentPlayingMusicDetails,
  }
}

const mapDispatchToProps = {
  setUserLoginDetails
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constant.COLOR_WHITE
  },
  centerIcon: {
    width: Constant.SCREEN_WIDTH,
    height: fontSizer(70)
  }
});
