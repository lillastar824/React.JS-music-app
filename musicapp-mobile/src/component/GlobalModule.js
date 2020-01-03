import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';

import { connect } from 'react-redux';
import Toast from 'react-native-easy-toast'
import TrackPlayer from 'react-native-track-player';

import AppLoader from "./AppLoader"
import CustomDialog from "./CustomDialog"
import Constant from '../constant/Constant';

import {
  fontSizer,
  widthSizer,
  isTablet,
  prepareAudioPlayer
} from '../utils/MethodUtils';

import {
  setUserLoginDetails
} from "../action/ActionUserAuth"

class GlobalModule extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showAlertView: false,
      alertData: "",
    }
  }

  componentWillUnmount() {
    TrackPlayer.stop();
    TrackPlayer.destroy()
  }

  async componentDidMount() {
    Constant.showLoader = this.showLoader
    Constant.showToast = this.showToast
    Constant.showCustomAlert = this.showCustomAlert

    await prepareAudioPlayer()
    this._setNotificationProps()
  }

  _setNotificationProps = () => {
    TrackPlayer.updateOptions({
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_PLAY_FROM_ID,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
      ],
      // An array of capabilities that will show up when the notification is in the compact form on Android
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_PLAY_FROM_ID,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
      ],
      stopWithApp: false
    });
  }

  render() {
    console.disableYellowBox = true
    return (
      <View style={styles.container}>

        <StatusBar backgroundColor="transparent" translucent={true} barStyle={"light-content"} />

        {this.props.children}

        <AppLoader ref={showLoader => this.showLoader = showLoader} />

        <CustomDialog ref={showCustomAlert => this.showCustomAlert = showCustomAlert} />

        <Toast
          style={{ backgroundColor: Constant.COLOR_GOLD }}
          textStyle={{ color: Constant.COLOR_BACK_BLACK, fontFamily: Constant.FONT_BACK_GOTHIC_MEDIUM }}
          ref={showToast => this.showToast = showToast}
        />

      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(GlobalModule);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  popupChildView: {
    width: Constant.SCREEN_WIDTH / 1.1,
    backgroundColor: Constant.COLOR_WHITE,
    alignItems: 'center',
    paddingHorizontal: fontSizer(15),
    paddingVertical: fontSizer(20),
    borderRadius: 15,
    justifyContent: 'center'
  },
  popupTitleText: {
    fontFamily: Constant.FONT_SFP_Bold,
    fontSize: fontSizer(20),
    color: Constant.COLOR_MAIN
  },
  popupMessageText: {
    fontFamily: Constant.FONT_SFP_REGULAR,
    fontSize: fontSizer(15),
    textAlign: 'center',
    marginHorizontal: widthSizer(Constant.SCREEN_HEIGHT * 0.05),
    marginTop: fontSizer(20),
    color: Constant.COLOR_TEXT_BLACK
  },
});
