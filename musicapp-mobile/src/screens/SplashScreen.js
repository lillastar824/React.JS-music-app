import React from 'react';
import { ImageBackground, StyleSheet, Image } from 'react-native';

import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';
import { NavigationActions, StackActions } from 'react-navigation'

import {
  widthSizer,
  fontSizer,
  Storage,
  GoogleAnalyticsTrackScreen
} from "../utils/MethodUtils"

import Constant from "../constant/Constant"

import {
  setUserLoginDetails
} from "../action/ActionUserAuth"

class SplashScreen extends React.Component {

  async componentDidMount() {

    GoogleAnalyticsTrackScreen.SplashScreen()

    const userData = await Storage.getItem("user_data")
    this.props.setUserLoginDetails(userData)

    Orientation.lockToPortrait();

    setTimeout(() => {
      if (Object.keys(this.props.userData).length > 0) {
        this._navigateUser()
      } else {
        this.props.navigation.dispatch(StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'LoginSighup' })],
        }))
      }
    }, 3000);

  }

  _navigateUser = () => {

    if ((this.props.userData.user.email !== null && this.props.userData.user.is_email_verify == 0) ||
      (this.props.userData.user.contact_no !== null && this.props.userData.user.is_mobile_verify == 0)) {

      this.props.navigation.dispatch(StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Verification', params: { fromEditProfile: false } })],
      }))

    } else {
      this.props.navigation.dispatch(StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
      }))
    }

  }

  render() {
    return (
      <ImageBackground source={require("../assets/images/ic_splash_back.png")} style={styles.container}>

        <Image
          resizeMode={"contain"}
          source={require("../assets/images/ic_splash_icon.png")}
          style={styles.centerIcon} />

      </ImageBackground>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    userData: store.UserAuth.userData
  }
}

const mapDispatchToProps = {
  setUserLoginDetails
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerIcon: {
    width: Constant.SCREEN_WIDTH,
    height: 270,
    marginRight: widthSizer(Constant.SCREEN_WIDTH * 0.08),
    marginTop: widthSizer(Constant.SCREEN_WIDTH * 0.15),
  }
});
