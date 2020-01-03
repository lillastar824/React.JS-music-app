import React from 'react';
import { ImageBackground, StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native';

import { connect } from "react-redux"
import Orientation from 'react-native-orientation';
import FastImage from 'react-native-fast-image'
import IconIonic from 'react-native-vector-icons/Ionicons'

import {
  widthSizer,
  fontSizer,
  isTablet,
  manageApiResponseCode,
  emailValidation,
  GoogleAnalyticsTrackScreen,
  getStatusBarHeight
} from "../utils/MethodUtils"

import Constant from "../constant/Constant"
import BottomBorderTextInput from "../component/BottomBorderTextInput"
import TextGradient from "../component/TextGradient"
import BottomBorderButton from "../component/BottomBorderButton"


class ForgotPasswordScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      email: "",
    }
  }

  componentDidMount() {
    Orientation.lockToPortrait();
  }

  _forgotPasswordApi = () => {

    if (!emailValidation(this.state.email)) {
      return
    }

    Constant.showLoader.showLoader();

    var formData = new FormData();
    formData.append('email', this.state.email);

    fetch(Constant.API_FORGOT_PASSWORD, {
      method: 'POST',
      headers: {
        "Authorization": Constant.HEADER,
      },
      body: formData
    }).then(r => r.json())
      .then(data => {
        Constant.showLoader.hideLoader()

        if (data.status_code === 200) {
          GoogleAnalyticsTrackScreen.ForgotPasswordScreen()
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
            style={{ marginTop: Constant.SCREEN_HEIGHT * 0.03 }}
            text={`Forgot your password?`}
            fontSize={27} />

          <TextGradient
            style={{ marginVertical: Constant.SCREEN_HEIGHT * 0.03 }}
            text={`Enter your email below, we\nwill send you reset link.`}
            fontSize={20} />


          <BottomBorderTextInput
            value={this.state.email}
            placeholderValue={"Email"}
            width={0.8}
            onValueChange={(email) => {
              this.setState({ email })
            }}
          />

          <BottomBorderButton
            text={"SEND"}
            width={0.8}
            fontSize={25}
            onPressButton={() => this._forgotPasswordApi()}
            style={{ marginVertical: Constant.SCREEN_HEIGHT * 0.04 }}
          />

        </View>

      </ImageBackground >
    );
  }
}

const mapStateToProps = (store) => {
  return {
    name: store.UserAuth.name
  }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordScreen);

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
    fontSize: fontSizer(27),
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
});
