import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  Platform,
  NativeModules
} from 'react-native';

import { connect } from "react-redux"
import Orientation from 'react-native-orientation';
import { NavigationActions, StackActions } from 'react-navigation'
import PhoneInput from "react-native-phone-input";
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/Entypo'
import IconEvil from 'react-native-vector-icons/EvilIcons'
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'
import IconIonic from 'react-native-vector-icons/Ionicons'
const { RNTwitterSignIn } = NativeModules

import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from "react-native-fbsdk";
import { GoogleSignin, statusCodes } from 'react-native-google-signin';

import {
  widthSizer,
  fontSizer,
  isTablet,
  manageApiResponseCode,
  Storage,
  checkUserEnterEmailOrMobile,
  emailValidation,
  GoogleAnalyticsTrackScreen,
  getStatusBarHeight,
  passwordValidation
} from "../utils/MethodUtils"

import {
  setUserLoginDetails
} from "../action/ActionUserAuth"

import Constant from "../constant/Constant"
import BottomBorderTextInput from "../component/BottomBorderTextInput"
import TextGradient from "../component/TextGradient"
import BottomBorderButton from "../component/BottomBorderButton"
import InstagramLogin from "../component/InstagramLogin"

class LoginScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      email: "",
      password: "",
      passwordVisible: false,
      showMobile: false,
    }
  }

  componentDidMount() {
    GoogleAnalyticsTrackScreen.LoginScreen()
    Orientation.lockToPortrait();
    GoogleSignin.configure();
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidHide = () => {
    this.setState({ showMobile: this.state.email == "" ? false : !checkUserEnterEmailOrMobile(this.state.email) })
  }

  _SocialSignUp = (socialId, socialName, socialEmail, socialProfilePic, socialType) => {

    Constant.showLoader.showLoader()

    var formData = new FormData()
    formData.append("email", socialEmail)
    formData.append("social_id", socialId)
    formData.append("type", "3")

    fetch(Constant.API_LOGIN, {
      method: 'POST',
      headers: {
        'Authorization': Constant.HEADER,
      },
      body: formData
    }).then(r => r.json())
      .then((data) => {

        Constant.showLoader.hideLoader()

        if (data.status_code === 200) {
          Constant.showToast.show(data.message, Constant.ToastDuration);
          this._saveDataAndNavigate(data)
        } else {
          manageApiResponseCode(data, this.props.navigation)
        }

      }).catch(exception => {
        console.log("exception ---> " + JSON.stringify(exception));
        Constant.showLoader.hideLoader()
      });
  }

  _saveDataAndNavigate = (data) => {
    GoogleAnalyticsTrackScreen.LoginSuccess()
    Storage.setItem("user_data", data.data[0])
    this.props.setUserLoginDetails(data.data[0])


    if ((data.data[0].user.email !== null && data.data[0].user.is_email_verify == 0) ||
      (data.data[0].user.contact_no != null && data.data[0].user.is_mobile_verify == 0)) {

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

  _onLoginApi = () => {

    if (!this.state.showMobile && !emailValidation(this.state.email)) {
      return
    }
    if (this.state.showMobile && !this.phone.isValidNumber()) {
      Constant.showToast.show("Enter valid contact number.", Constant.ToastDuration);
      return
    }

    if (!passwordValidation(this.state.password)) {
      return
    }

    var formData = new FormData()
    formData.append("password", this.state.password)
    formData.append("type", checkUserEnterEmailOrMobile(this.state.email) ? "1" : "2")

    if (this.state.showMobile) {
      formData.append("contact_no", this.phone.getValue())
    } else {
      formData.append("email", this.state.email)
    }

    Constant.showLoader.showLoader()

    fetch(Constant.API_LOGIN, {
      method: 'POST',
      headers: {
        'Authorization': Constant.HEADER,
      },
      body: formData
    }).then(r => r.json())
      .then((data) => {

        Constant.showLoader.hideLoader()

        if (data.status_code === 200) {
          Constant.showToast.show(data.message, Constant.ToastDuration);
          this._saveDataAndNavigate(data)
        } else {
          manageApiResponseCode(data, this.props.navigation)
        }

      }).catch(exception => {
        console.log("exception ---> " + JSON.stringify(exception));
        Constant.showLoader.hideLoader()
      });
  }

  _facebookLogin = () => {
    LoginManager.logInWithReadPermissions(['email']).then(
      (result) => {
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          AccessToken.getCurrentAccessToken().then(
            (data) => {
              this._getFacebookUserData(data)
            }
          )
        }
      },
      (error) => {
        LoginManager.logOut();
        console.log("Login fail with error: " + error);
      }
    );
  }

  _getFacebookUserData = async (data) => {

    if (data == null) {
      return
    }

    LoginManager.logOut();

    fetch('https://graph.facebook.com/v3.1/me?fields=name,picture,email,accounts{link,category,name,picture}&access_token=' + data.accessToken)
      .then((response) => response.json())
      .then((json) => {
        this._SocialSignUp(json.id, json.name, json.email, json.picture.data.url, "facebook")
      })
      .catch(() => {

        const alertData = {
          title: Constant.ALERT_TITLE,
          message: "LOGIN IS NOT COMPLETED. ERROR WHILE LOGIN",
          Buttons: [
            {
              text: "OK",
              color: Constant.COLOR_MAIN
            }
          ],
          getReturnData: {},
          onButtonPress: () => { }
        }

        Constant.showCustomAlert.showAlert(alertData)

      })
  }

  _gmailLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const socialDetails = userInfo.user
      this._SocialSignUp(socialDetails.id, socialDetails.name, socialDetails.email, socialDetails.photo, "google")
    } catch (error) {
      console.log("error --> " + JSON.stringify(error))


      const alertData = {
        title: Constant.ALERT_TITLE,
        message: "LOGIN IS NOT COMPLETED. ERROR WHILE LOGIN",
        Buttons: [
          {
            text: "OK",
            color: Constant.COLOR_MAIN
          }
        ],
        getReturnData: {},
        onButtonPress: () => { }
      }

      Constant.showCustomAlert.showAlert(alertData)

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  _instagramLogin = (token) => {

    var formData = new FormData()
    formData.append("client_id", Constant.INSTAGRAM_CLIENT_ID)
    formData.append("client_secret", Constant.INSTAGRAM_CLIENT_SECRET)
    formData.append("grant_type", "authorization_code")
    formData.append("redirect_uri", Constant.INSTAGRAM_REDIRECT_URL)
    formData.append("code", token)

    Constant.showLoader.showLoader()

    fetch("https://api.instagram.com/oauth/access_token", {
      method: 'POST',
      body: formData
    }).then(r => r.json())
      .then((data) => {
        Constant.showLoader.hideLoader()
        console.log("JSON.stringify(data) ---> " + JSON.stringify(data));
        this._SocialSignUp(data.user.id, data.user.full_name, "", data.user.profile_picture, "instagram")
      }).catch(exception => {
        console.log("exception ---> " + JSON.stringify(exception));
        Constant.showLoader.hideLoader()
      });
  }

  _twitterLogin = () => {
    RNTwitterSignIn.init(Constant.TWITTER_CONSUMER_KEY, Constant.TWITTER_CONSUMER_SECRET)
    RNTwitterSignIn.logIn()
      .then(loginData => {
        const { authToken, authTokenSecret, email, userName, userID } = loginData
        if (authToken && authTokenSecret) {
          this._SocialSignUp(userID, "", email, "", "")
        }
      })
      .catch(error => {
        console.log(error)
      })
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

          <View style={{
            marginTop: Constant.SCREEN_HEIGHT * 0.05,
            width: '100%',
          }}>
            {this.state.showMobile ?

              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: isTablet() ? 4 : 0,
                width: widthSizer(Constant.SCREEN_WIDTH * 0.8),
              }}>

                <View style={styles.bottomBorderView} >
                  <Image
                    resizeMode={"contain"}
                    style={{ width: widthSizer(Constant.SCREEN_WIDTH * 0.8), height: '100%' }}
                    source={require('../assets/images/button_bottom_gold_border.png')} />
                </View>

                <PhoneInput
                  style={{
                    width: widthSizer(Constant.SCREEN_WIDTH * 0.8) - fontSizer(8),
                    marginLeft: fontSizer(4),
                    borderRadius: fontSizer(4),
                    backgroundColor: "rgba(23,23,23,.6)",
                    padding: fontSizer(11),
                    marginBottom: fontSizer(4)
                  }}
                  value={this.state.email}
                  textStyle={{
                    color: Constant.COLOR_GOLD,
                    fontSize: fontSizer(19),
                    height: fontSizer(Platform.OS === "ios" ? 21 : 25),
                    letterSpacing: 1.5,
                    fontFamily: Constant.FONT_CORKI_REGULAR
                  }}
                  onChangePhoneNumber={(email) => {
                    this.setState({ email }, () => {
                      if (email == "") {
                        this.setState({ showMobile: this.state.email == "" ? false : !checkUserEnterEmailOrMobile(this.state.email) })
                      }
                    })
                  }}
                  flagStyle={{
                    width: fontSizer(27),
                    height: fontSizer(18),
                  }}
                  ref={ref => this.phone = ref}
                />

              </View>
              :
              <BottomBorderTextInput
                value={this.state.email}
                placeholderValue={"Email or phone number"}
                width={0.8}
                onValueChange={(email) => {
                  this.setState({ email })
                }}
              />

            }

          </View>

          <View style={{ width: '100%' }}>
            <BottomBorderTextInput
              value={this.state.password}
              placeholderValue={"Password"}
              width={0.8}
              securityText={!this.state.passwordVisible}
              style={{ marginTop: Constant.SCREEN_HEIGHT * 0.04 }}
              onValueChange={(password) => {
                this.setState({ password })
              }}
            />

            <TouchableOpacity
              onPress={() => this.setState({ passwordVisible: !this.state.passwordVisible })}
              style={styles.passwordVisibleIconView} >
              <Icon name={this.state.passwordVisible ? "eye" : "eye-with-line"} size={fontSizer(18)} color={Constant.COLOR_GOLD} />
            </TouchableOpacity>

          </View>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("ForgotPassword")}
            style={styles.forgotPasswordView}>
            <TextGradient text={"FORGOT PASSWORD ?"} fontSize={22} />
          </TouchableOpacity>

          <BottomBorderButton
            text={"LOGIN"}
            width={0.8}
            fontSize={25}
            onPressButton={() => {
              this._onLoginApi()
            }}
          />

          <TextGradient
            style={{ marginVertical: Constant.SCREEN_HEIGHT * 0.02 }}
            text={"- OR LOGIN WITH -"}
            fontSize={20} />

          <View style={{ flexDirection: 'row' }}>

            <TouchableOpacity
              onPress={() => this._facebookLogin()}
              style={{
                paddingVertical: fontSizer(8),
                paddingHorizontal: fontSizer(6),
                borderRadius: 50,
                marginHorizontal: fontSizer(5),
                backgroundColor: "#1C1C1C"
              }}>
              <IconEvil name={"sc-facebook"} size={fontSizer(28)} color={Constant.COLOR_GOLD} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this._gmailLogin()}
              style={{
                padding: fontSizer(10),
                marginHorizontal: fontSizer(5),
                borderRadius: 100,
                backgroundColor: "#1C1C1C"
              }}>
              <IconFontAwesome name={"google"} size={fontSizer(20)} color={Constant.COLOR_GOLD} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this._twitterLogin()}
              style={{
                paddingVertical: fontSizer(8),
                paddingHorizontal: fontSizer(6),
                borderRadius: 50,
                marginHorizontal: fontSizer(5),
                backgroundColor: "#1C1C1C"
              }}>
              <IconEvil name={"sc-twitter"} size={fontSizer(28)} color={Constant.COLOR_GOLD} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.instagramLogin.show()}
              style={{
                padding: fontSizer(10),
                marginHorizontal: fontSizer(5),
                borderRadius: 100,
                backgroundColor: "#1C1C1C"
              }} >
              <IconFontAwesome name={"instagram"} size={fontSizer(20)} color={Constant.COLOR_GOLD} />
            </TouchableOpacity>

          </View>

        </View>

        <InstagramLogin
          ref={instagramLogin => this.instagramLogin = instagramLogin}
          onLoginSuccess={(token) => this._instagramLogin(token)}
          onLoginFailure={(data) => console.log(data)}
        />

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
  setUserLoginDetails
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

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
    textAlign: "center"
  },
  descText: {
    marginTop: '10%',
    fontSize: fontSizer(16),
    color: Constant.COLOR_WHITE,
    textAlign: "center"
  },
  orLoginWithText: {
    fontSize: fontSizer(16),
    color: Constant.COLOR_WHITE,
    textAlign: "center",
    fontFamily: Constant.FONT_SFP_REGULAR
  },
  buttonImageView: {
    width: fontSizer(16),
    height: fontSizer(16),
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
  forgotPasswordView: {
    alignSelf: 'flex-end',
    paddingVertical: Constant.SCREEN_HEIGHT * 0.03,
    marginHorizontal: Constant.SCREEN_WIDTH * 0.01,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonImageViewTextInput: {
    width: fontSizer(16),
    height: fontSizer(16),
    marginHorizontal: fontSizer(15)
  },
  bottomBorderView: {
    position: 'absolute',
    bottom: fontSizer(-5),
    right: 0,
    left: 0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    height: fontSizer(25),
  },
});
