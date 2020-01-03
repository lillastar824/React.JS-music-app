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
  NativeModules,
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

import { LoginManager, AccessToken } from "react-native-fbsdk";
import { GoogleSignin, statusCodes } from 'react-native-google-signin';

import {
  widthSizer,
  fontSizer,
  isTablet,
  manageApiResponseCode,
  Storage,
  checkUserEnterEmailOrMobile,
  emailValidation,
  passwordValidation,
  GoogleAnalyticsTrackScreen,
  getStatusBarHeight
} from "../utils/MethodUtils"

import {
  setUserLoginDetails
} from "../action/ActionUserAuth"

import Constant from "../constant/Constant"
import BottomBorderTextInput from "../component/BottomBorderTextInput"
import TextGradient from "../component/TextGradient"
import BottomBorderButton from "../component/BottomBorderButton"
import InstagramLogin from "../component/InstagramLogin"

class SignupScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      email: "",
      password: "",
      confPassword: "",
      name: "",
      passwordVisible: false,
      conPasswordVisible: false,
      showMobile: false,
    }
  }

  componentDidMount() {
    GoogleAnalyticsTrackScreen.SignupScreen()
    Orientation.lockToPortrait();
    GoogleSignin.configure();
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  _keyboardDidHide = () => {
    this.setState({ showMobile: this.state.email == "" ? false : !checkUserEnterEmailOrMobile(this.state.email) })
  }


  _SocialSignUp = (socialId, socialName, socialEmail, socialProfilePic, socialType) => {

    Constant.showLoader.showLoader()

    var formData = new FormData()
    formData.append("social_id", socialId)
    formData.append("name", socialName)
    formData.append("email", socialEmail)
    formData.append("profile_pic", socialProfilePic)
    formData.append("social_type", socialType)

    fetch(Constant.API_SOCIAL_SIGNUP, {
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
    GoogleAnalyticsTrackScreen.SignupSuccess()
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

  _newUSerSignupApi = () => {

    if (this.state.name.length == 0) {
      Constant.showToast.show("Enter name.", Constant.ToastDuration);
      return
    }

    if (!this.state.showMobile && !emailValidation(this.state.email)) {
      return
    }

    if (!passwordValidation(this.state.password)) {
      return
    }

    if (this.state.password !== this.state.confPassword) {
      Constant.showToast.show("Confirm password not match.", Constant.ToastDuration);
      return
    }

    if (this.state.showMobile && !this.phone.isValidNumber()) {
      Constant.showToast.show("Enter valid contact number.", Constant.ToastDuration);
      return
    }

    var formData = new FormData()
    formData.append("password", this.state.password)
    formData.append("type", checkUserEnterEmailOrMobile(this.state.email) ? "1" : "2")
    formData.append("name", this.state.name)

    if (this.state.showMobile) {
      formData.append("contact_no", this.phone.getValue())
    } else {
      formData.append("email", this.state.email)
    }

    Constant.showLoader.showLoader()

    fetch(Constant.API_SIGNUP, {
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
          message: "SIGNUP IS NOT COMPLETED. ERROR WHILE SIGNUP",
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
        message: "SIGNUP IS NOT COMPLETED. ERROR WHILE SIGNUP",
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
          this._signUpWithTwitter(authToken, authTokenSecret, email, userName, userID)
        }
      })
      .catch(error => {
        RNTwitterSignIn.logOut()
        console.log(error)
      })
  }

  _signUpWithTwitter = (authToken, authTokenSecret, email, userName, userID) => {
    RNTwitterSignIn.logOut()
    Constant.showLoader.showLoader()

    var formData = new FormData()
    formData.append("social_id", userID)
    formData.append("email", email)
    formData.append("access_token_secrete", authTokenSecret)
    formData.append("access_token", authToken)
    formData.append("twitter_username", userName)
    formData.append("social_type", "twitter")

    fetch(Constant.API_SOCIAL_SIGNUP, {
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

          <BottomBorderTextInput
            value={this.state.name}
            placeholderValue={"Enter name"}
            width={0.8}
            style={{ marginTop: Constant.SCREEN_HEIGHT * 0.01 }}
            onValueChange={(name) => {
              this.setState({ name })
            }}
          />

          <View style={{
            marginTop: Constant.SCREEN_HEIGHT * 0.02,
            width: '100%',
          }}>
            {this.state.showMobile ?

              <View style={{
                flexDirection: 'row',
                marginLeft: isTablet() ? 4 : 0,
                alignItems: 'center',
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
              style={{ marginTop: Constant.SCREEN_HEIGHT * 0.02 }}
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

          <View style={{ width: '100%' }}>
            <BottomBorderTextInput
              value={this.state.confPassword}
              placeholderValue={"Confirm Password"}
              width={0.8}
              securityText={!this.state.conPasswordVisible}
              style={{ marginTop: Constant.SCREEN_HEIGHT * 0.02 }}
              onValueChange={(confPassword) => {
                this.setState({ confPassword })
              }}
            />

            <TouchableOpacity
              onPress={() => this.setState({ conPasswordVisible: !this.state.conPasswordVisible })}
              style={styles.passwordVisibleIconView} >
              <Icon name={this.state.conPasswordVisible ? "eye" : "eye-with-line"} size={fontSizer(18)} color={Constant.COLOR_GOLD} />
            </TouchableOpacity>

          </View>

          <BottomBorderButton
            text={"SIGN UP"}
            width={0.8}
            fontSize={25}
            style={{ marginTop: Constant.SCREEN_HEIGHT * 0.03 }}
            onPressButton={() => this._newUSerSignupApi()}
          />

          <TextGradient
            style={{ marginVertical: Constant.SCREEN_HEIGHT * 0.02 }}
            text={"- OR SIGNUP WITH -"}
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
              }} >
              <IconEvil name={"sc-facebook"} size={fontSizer(28)} color={Constant.COLOR_GOLD} />
            </TouchableOpacity>


            <TouchableOpacity
              onPress={() => this._gmailLogin()}
              style={{
                padding: fontSizer(10),
                marginHorizontal: fontSizer(5),
                borderRadius: 100,
                backgroundColor: "#1C1C1C"
              }} >
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

          <Text style={styles.privacyText}>
            {`By clicking Sign Up, you agree to our  \n`}
            <Text onPress={() => this.props.navigation.navigate("CustomWebview", { title: "Privacy Policy", type: 2 })} style={{ textDecorationLine: 'underline' }}>Privacy Policy</Text>
            <Text>{` and `}</Text>
            <Text onPress={() => this.props.navigation.navigate("CustomWebview", { title: "Terms and Condition", type: 1 })} style={{ textDecorationLine: 'underline' }}>Terms and Condition</Text>
          </Text>

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

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen);

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
    margin: Constant.SCREEN_WIDTH * 0.05,
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
  privacyText: {
    fontSize: fontSizer(16),
    color: Constant.COLOR_GOLD,
    textAlign: "center",
    letterSpacing: 1.2,
    marginTop: Constant.SCREEN_HEIGHT * 0.02,
    lineHeight: fontSizer(22),
    fontFamily: Constant.FONT_CORKI_REGULAR,
  },
  buttonImageViewTextInput: {
    width: fontSizer(16),
    height: fontSizer(16),
    marginHorizontal: fontSizer(16)
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
