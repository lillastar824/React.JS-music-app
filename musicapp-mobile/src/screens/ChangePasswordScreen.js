import React from 'react';
import { ImageBackground, StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native';

import { connect } from "react-redux"
import Orientation from 'react-native-orientation';
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/Entypo'
import IconIonic from 'react-native-vector-icons/Ionicons'

import {
  widthSizer,
  fontSizer,
  isTablet,
  manageApiResponseCode,
  passwordValidation,
  GoogleAnalyticsTrackScreen,
  getStatusBarHeight
} from "../utils/MethodUtils"

import Constant from "../constant/Constant"
import BottomBorderTextInput from "../component/BottomBorderTextInput"
import TextGradient from "../component/TextGradient"
import BottomBorderButton from "../component/BottomBorderButton"

class ChangePasswordScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      currentPassword: "",
      newPassword: "",
      ConfirmPassword: "",
      newPasswordVisible: false,
      confPasswordVisible: false,
    }
  }

  componentDidMount() {
    Orientation.lockToPortrait();
  }

  _changePasswordApi = () => {

    if (!passwordValidation(this.state.newPassword)) {
      return
    }

    if (this.state.newPassword !== this.state.ConfirmPassword) {
      Constant.showToast.show("Password not match.", Constant.ToastDuration);
      return
    }

    Constant.showLoader.showLoader();

    var formData = new FormData();
    formData.append('token', this.props.userData.token);
    formData.append('oldpassword', this.state.currentPassword);
    formData.append('newpassword', this.state.newPassword);

    fetch(Constant.API_CHANGE_PASSWORD, {
      method: 'POST',
      headers: {
        "Authorization": Constant.HEADER,
      },
      body: formData
    }).then(r => r.json())
      .then(data => {
        Constant.showLoader.hideLoader()

        if (data.status_code === 200) {
          GoogleAnalyticsTrackScreen.ChangePasswordScreen()
          Constant.showToast.show(data.message, Constant.ToastDuration);
          this.props.navigation.pop()
        } else {
          manageApiResponseCode(data, this.props.navigation)
        }

      }).catch((err) => {
        console.log(err);
        Constant.showLoader.hideLoader()
      });
  }


  render() {
    return (
      <ImageBackground source={require("../assets/images/ic_app_bac.png")} style={styles.container}>

        <FastImage source={require("../assets/images/ic_bac_image.png")} style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0
        }} />

        <TouchableOpacity
          style={{
            left: 0,
            top: getStatusBarHeight(),
            paddingHorizontal: fontSizer(20),
            paddingVertical: fontSizer(10),
            position: 'absolute'
          }}
          onPress={() => {
            this.props.navigation.pop()
          }} >
          <IconIonic name="ios-arrow-back" size={fontSizer(23)} color={Constant.COLOR_GOLD} />
        </TouchableOpacity>

        <View style={{
          flex: 1,
          width: isTablet() ? '65%' : '80%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>

          <Image
            resizeMode={"contain"}
            style={styles.centerIcon}
            source={require('../assets/images/ic_header_app_logo_new.png')} />

          <TextGradient
            style={{ marginVertical: Constant.SCREEN_HEIGHT * 0.01 }}
            text={"Reset Your Password"}
            fontSize={25} />

          <BottomBorderTextInput
            value={this.state.currentPassword}
            placeholderValue={"Current Password"}
            width={0.8}
            style={{ marginTop: Constant.SCREEN_HEIGHT * 0.04 }}
            onValueChange={(currentPassword) => {
              this.setState({ currentPassword })
            }}
          />

          <View style={{ width: '100%' }}>
            <BottomBorderTextInput
              value={this.state.newPassword}
              placeholderValue={"New Password"}
              width={0.8}
              securityText={!this.state.newPasswordVisible}
              style={{ marginTop: Constant.SCREEN_HEIGHT * 0.03 }}
              onValueChange={(newPassword) => {
                this.setState({ newPassword })
              }}
            />

            <TouchableOpacity
              onPress={() => this.setState({ newPasswordVisible: !this.state.newPasswordVisible })}
              style={styles.passwordVisibleIconView} >
              <Icon name={this.state.newPasswordVisible ? "eye" : "eye-with-line"} size={fontSizer(18)} color={Constant.COLOR_GOLD} />
            </TouchableOpacity>

          </View>

          <View style={{ width: '100%' }}>
            <BottomBorderTextInput
              value={this.state.ConfirmPassword}
              placeholderValue={"Confirm Password"}
              width={0.8}
              securityText={!this.state.confPasswordVisible}
              style={{ marginTop: Constant.SCREEN_HEIGHT * 0.03 }}
              onValueChange={(ConfirmPassword) => {
                this.setState({ ConfirmPassword })
              }}
            />

            <TouchableOpacity
              onPress={() => this.setState({ confPasswordVisible: !this.state.confPasswordVisible })}
              style={styles.passwordVisibleIconView} >
              <Icon name={this.state.confPasswordVisible ? "eye" : "eye-with-line"} size={fontSizer(18)} color={Constant.COLOR_GOLD} />
            </TouchableOpacity>

          </View>

          <BottomBorderButton
            text={"RESET PASSWORD"}
            style={{ marginVertical: Constant.SCREEN_HEIGHT * 0.05 }}
            width={0.8}
            fontSize={25}
            onPressButton={() => {
              this._changePasswordApi()
            }}
          />
        </View>

      </ImageBackground >
    );
  }
}

const mapStateToProps = (store) => {
  return {
    userData: store.UserAuth.userData
  }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerIcon: {
    width: Constant.SCREEN_WIDTH,
    height: fontSizer(70),
    marginBottom: '10%'
  },
  findTextView: {
    fontSize: fontSizer(22),
    color: Constant.COLOR_WHITE,
    textAlign: "center",
    fontFamily: Constant.FONT_SFP_REGULAR
  },
  descText: {
    marginTop: '7%',
    fontSize: fontSizer(16),
    color: Constant.COLOR_WHITE,
    textAlign: "center",
    fontFamily: Constant.FONT_SFP_REGULAR
  },
  passwordVisibleIconView: {
    width: Constant.SCREEN_HEIGHT * 0.075,
    height: Constant.SCREEN_HEIGHT * 0.075,
    position: 'absolute',
    right: 5,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
