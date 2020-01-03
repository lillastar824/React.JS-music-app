import React from 'react';
import { ImageBackground, StyleSheet, Image, Text, View } from 'react-native';

import Orientation from 'react-native-orientation';
import FastImage from 'react-native-fast-image'

import {
  widthSizer,
  isTablet,
  fontSizer,
  getStatusBarHeight
} from "../utils/MethodUtils"

import Constant from "../constant/Constant"
import RoundCornerButton from "../component/RoundCornerButton"
import BottomBorderButton from "../component/BottomBorderButton"

export default class LoginSighupScreen extends React.Component {

  componentDidMount() {
    Orientation.lockToPortrait();
  }

  render() {
    return (
      <ImageBackground source={require("../assets/images/ic_app_bac.png")} style={styles.container}>

        <View style={[styles.buttonView, { marginTop: getStatusBarHeight(), borderTopWidth: 0 }]}>

          <BottomBorderButton
            text={"LOGIN"}
            width={isTablet() ? 1 : 0.8}
            fontSize={fontSizer(isTablet() ? 25 : 33)}
            onPressButton={() => {
              this.props.navigation.navigate("Login")
            }}
          />

        </View>


        <View style={{ flex: 0.68, justifyContent: 'center', alignItems: 'center', justifyContent: 'space-around' }}>

          <Image
            resizeMode={"contain"}
            style={{
              width: Constant.SCREEN_WIDTH,
              height: Constant.SCREEN_WIDTH * 0.25,
            }}
            source={require('../assets/images/ic_header_app_logo_new.png')} />

          <Image
            resizeMode={"contain"}
            style={{
              width: Constant.SCREEN_WIDTH,
              height: Constant.SCREEN_WIDTH * 0.37,
            }}
            source={require('../assets/images/ic_combat_login_signup.png')} />

          <Image
            resizeMode={"contain"}
            style={{
              height: Constant.SCREEN_WIDTH * 0.1,
            }}
            source={require('../assets/images/ic_combat_text.png')} />

        </View>

        <View style={styles.buttonView}>

          <BottomBorderButton
            text={"CREATE AN ACCOUNT"}
            width={isTablet() ? 1 : 0.8}
            fontSize={fontSizer(isTablet() ? 25 : 33)}
            onPressButton={() => {
              this.props.navigation.navigate("Signup")
            }}
          />

        </View>

      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonView: {
    flex: 0.16,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Constant.COLOR_GRAY,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  }
});
