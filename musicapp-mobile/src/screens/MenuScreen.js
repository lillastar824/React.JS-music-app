import React from 'react';
import {
  View, StyleSheet, ImageBackground, Text, TouchableOpacity, Linking, Platform,
  ScrollView
} from 'react-native';

import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image'
import Orientation from 'react-native-orientation';
import Icon from 'react-native-vector-icons/EvilIcons'
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'

import {
  widthSizer,
  fontSizer,
  logoutFromApp,
  GoogleAnalyticsTrackScreen
} from "../utils/MethodUtils"

import {
  setUserLoginDetails
} from "../action/ActionUserAuth"

import Constant from "../constant/Constant"
import TabBarHeader from "../component/TabBarHeader"

var navigationRef, thisRef;

class MenuScreen extends React.Component {

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

  getUserProfileImageUrl = () => {
    if (Object.keys(this.props.userData).length > 0 && this.props.userData.user.profile_picture !== "") {
      return { uri: Constant.USER_PROFILE_PIC_URL + this.props.userData.user.profile_picture }
    }
  }

  _onPressFollowSocialPlatform = (type) => {
    var URL_FOR_APP, URL_FOR_BROWSER;
    switch (type) {
      case 0:
        if (Platform.OS === 'ios') {
          URL_FOR_APP = `fb://profile/${Constant.FACEBOOK_PROFILE_ID}`
        } else {
          URL_FOR_APP = `fb://page/${Constant.FACEBOOK_PROFILE_ID}`
        }
        URL_FOR_BROWSER = `https://fb.com/${Constant.FACEBOOK_PAGE_ID}`
        break;

      case 1:
        URL_FOR_APP = `twitter://user?screen_name=${Constant.TWITTER_PAGE_ID}`
        URL_FOR_BROWSER = `https://twitter.com/${Constant.TWITTER_PAGE_ID}`
        break;

      case 2:
        if (Platform.OS === 'ios') {
          URL_FOR_APP = `instagram://user?username=${Constant.INSTAGRAM_PAGE_ID}`
        } else {
          URL_FOR_APP = `instagram://${Constant.INSTAGRAM_PAGE_ID}`
        }
        URL_FOR_BROWSER = `https://www.instagram.com/${Constant.INSTAGRAM_PAGE_ID}`
        break;

      case 3:
        // URL_FOR_APP = `soundcloud://you`
        URL_FOR_APP = `asdasdasdasd`
        URL_FOR_BROWSER = `https://soundcloud.com/${Constant.SOUNDCLOUD_PAGE_ID}`
        break;

      default:
        return
    }

    Linking.canOpenURL(URL_FOR_APP)
      .then((supported) => {
        if (!supported) {
          Linking.openURL(URL_FOR_BROWSER)
        } else {
          Linking.openURL(URL_FOR_APP)
        }
      })
      .catch(err => console.error('An error occurred', err))

  }

  render() {
    return (
      <ImageBackground source={require("../assets/images/ic_app_bac.png")} style={styles.container}>

        <TabBarHeader
          headerTitle={"More"}
          isBackVisible={false}
          onPressBack={() => {

          }} />

        <View style={{ flex: 1 }} >

          <FastImage source={require("../assets/images/ic_bac_image.png")} style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0
          }} />

          <View style={styles.musicListRootView}>

            {Object.keys(this.props.userData).length > 0 && this.props.userData.user.profile_picture !== "" ?
              <FastImage
                style={styles.musicListIcon}
                source={this.getUserProfileImageUrl()}
                resizeMode={FastImage.resizeMode.cover}
              />
              :
              <Icon name={"user"} size={fontSizer(51)}
                style={{
                  width: fontSizer(52),
                  height: fontSizer(40),
                  marginHorizontal: fontSizer(10)
                }}
                color={Constant.COLOR_GOLD} />
            }

            <View>
              <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.userNameText}>{Object.keys(this.props.userData).length > 0 ? this.props.userData.user.real_name : 0}</Text>

              {Object.keys(this.props.userData).length > 0 && this.props.userData.user.email != null && this.props.userData.user.email !== "" &&
                <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.userEmailText}>{this.props.userData.user.email}</Text>
              }

              {Object.keys(this.props.userData).length > 0 && this.props.userData.user.contact_no != null && this.props.userData.user.contact_no !== "" &&
                <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.userEmailText}>{this.props.userData.user.contact_no}</Text>
              }

            </View>

          </View>

          <View style={styles.musicListDividerView} />

          <ScrollView>

            <View>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("EditProfile")}
                style={[styles.musicListRootView, { marginLeft: fontSizer(15) }]}>
                <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.musicNameText}>{`Edit Profile`}</Text>
              </TouchableOpacity>

              <View style={styles.musicListDividerView} />
            </View>

            {Object.keys(this.props.userData).length > 0 && this.props.userData.user.type <= 2 &&
              <View>
                <TouchableOpacity
                  onPress={() => this.props.screenProps.rootNavigation.navigate("ChangePassword")}
                  style={[styles.musicListRootView, { marginLeft: fontSizer(15) }]}>
                  <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.musicNameText}>{`Change Password`}</Text>
                </TouchableOpacity>
                <View style={styles.musicListDividerView} />
              </View>
            }

            <TouchableOpacity
              onPress={() => this.props.screenProps.rootNavigation.navigate("CustomWebview", { title: "About App", type: 6 })}
              style={[styles.musicListRootView, { marginLeft: fontSizer(15) }]}>
              <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.musicNameText}>{`About App`}</Text>
            </TouchableOpacity>

            <View style={styles.musicListDividerView} />

            <TouchableOpacity
              onPress={() => this.props.screenProps.rootNavigation.navigate("CustomWebview", { title: "Help", type: 5 })}
              style={[styles.musicListRootView, { marginLeft: fontSizer(15) }]}>
              <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.musicNameText}>{`Help`}</Text>
            </TouchableOpacity>

            <View style={styles.musicListDividerView} />

            <TouchableOpacity
              onPress={() => this.props.screenProps.rootNavigation.navigate("CustomWebview", { title: "Terms and Condition", type: 1 })}
              style={[styles.musicListRootView, { marginLeft: fontSizer(15) }]}>
              <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.musicNameText}>{`Term and Condition`}</Text>
            </TouchableOpacity>

            <View style={styles.musicListDividerView} />

            <TouchableOpacity
              onPress={() => this.props.screenProps.rootNavigation.navigate("CustomWebview", { title: "Privacy Policy", type: 2 })}
              style={[styles.musicListRootView, { marginLeft: fontSizer(15) }]}>
              <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.musicNameText}>{`Privacy Policy`}</Text>
            </TouchableOpacity>

            <View style={styles.musicListDividerView} />

            <View style={[styles.musicListRootView, { paddingVertical: fontSizer(10), marginLeft: fontSizer(15), justifyContent: "space-between" }]}>
              <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.musicNameText}>{`Follow ComBat`}</Text>

              <View style={{ marginRight: fontSizer(15), flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => this._onPressFollowSocialPlatform(0)}
                  style={styles.followButtonTouchView}>
                  <Icon name={"sc-facebook"} size={fontSizer(25)} color={Constant.COLOR_GOLD} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this._onPressFollowSocialPlatform(1)}
                  style={[styles.followButtonTouchView, { marginHorizontal: fontSizer(5) }]}>
                  <Icon name={"sc-twitter"} size={fontSizer(25)} color={Constant.COLOR_GOLD} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this._onPressFollowSocialPlatform(2)}
                  style={styles.followInstagramTouchView}>
                  <IconFontAwesome name={"instagram"} size={fontSizer(19)} color={Constant.COLOR_GOLD} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this._onPressFollowSocialPlatform(3)}
                  style={[styles.followButtonTouchView, { marginHorizontal: fontSizer(5) }]}>
                  <Icon name={"sc-soundcloud"} size={fontSizer(25)} color={Constant.COLOR_GOLD} />
                </TouchableOpacity>

              </View>
            </View>

            <View style={styles.musicListDividerView} />

            <TouchableOpacity
              onPress={() => this.props.screenProps.rootNavigation.navigate("CustomWebview", { title: "Thank You", type: 3 })}
              style={[styles.musicListRootView, { marginLeft: fontSizer(15) }]}>
              <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.musicNameText}>{`Thank You`}</Text>
            </TouchableOpacity>

            <View style={styles.musicListDividerView} />

            <TouchableOpacity
              onPress={() => this.props.screenProps.rootNavigation.navigate("CustomWebview", { title: "Album Info", type: 4 })}
              style={[styles.musicListRootView, { marginLeft: fontSizer(15) }]}>
              <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.musicNameText}>{`Album Info`}</Text>
            </TouchableOpacity>

            <View style={styles.musicListDividerView} />

            <TouchableOpacity
              onPress={() => {
                GoogleAnalyticsTrackScreen.Logout()
                logoutFromApp(true, this.props.screenProps.rootNavigation)
              }}
              style={[styles.musicListRootView, { marginLeft: fontSizer(15) }]}>
              <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.musicNameText}>{`Logout`}</Text>
            </TouchableOpacity>

            <View style={[styles.musicListDividerView, { marginBottom: fontSizer(100) }]} />

          </ScrollView>

        </View>

      </ImageBackground>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    userData: store.UserAuth.userData,
    currentPlayingMusicDetails: store.MusicState.currentPlayingMusicDetails
  }
}

const mapDispatchToProps = {
  setUserLoginDetails
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.07)"
  },
  centerIcon: {
    width: Constant.SCREEN_WIDTH,
    height: fontSizer(70)
  },
  musicListRootView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: fontSizer(17)
  },
  musicListIcon: {
    width: fontSizer(40),
    height: fontSizer(40),
    borderRadius: fontSizer(20),
    marginHorizontal: fontSizer(15),
    borderWidth: 1,
    borderColor: Constant.COLOR_GOLD
  },
  playPauseIconView: {
    marginRight: fontSizer(10),
    width: fontSizer(30),
    height: fontSizer(30),
    alignItems: 'center',
    justifyContent: 'center'
  },
  playPauseIcon: {
    width: fontSizer(15),
    height: fontSizer(15),
  },
  userNameText: {
    color: Constant.COLOR_MAIN,
    fontSize: fontSizer(16),
    maxWidth: Constant.SCREEN_WIDTH - fontSizer(130),
    fontFamily: Constant.FONT_BACK_GOTHIC_MEDIUM
  },
  userEmailText: {
    color: Constant.COLOR_WHITE,
    fontSize: fontSizer(14),
    maxWidth: Constant.SCREEN_WIDTH - fontSizer(130),
    fontFamily: Constant.FONT_BACK_GOTHIC_MEDIUM,
  },
  musicNameText: {
    color: Constant.COLOR_WHITE,
    fontSize: fontSizer(16),
    maxWidth: Constant.SCREEN_WIDTH - fontSizer(130),
    fontFamily: Constant.FONT_BACK_GOTHIC_MEDIUM
  },
  musicListDividerView: {
    marginHorizontal: fontSizer(15),
    width: Constant.SCREEN_WIDTH - fontSizer(30),
    height: 1,
    backgroundColor: Constant.COLOR_DIVIDER
  },
  followButtonTouchView: {
    paddingVertical: fontSizer(5),
    paddingHorizontal: fontSizer(3),
    borderRadius: 50,
    backgroundColor: "#1C1C1C"
  },
  followInstagramTouchView: {
    paddingVertical: fontSizer(6),
    paddingHorizontal: fontSizer(7.5),
    borderRadius: 50,
    backgroundColor: "#1C1C1C"
  }
});
