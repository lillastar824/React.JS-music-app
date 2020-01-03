import React, { Component } from 'react';
import { StyleSheet, View, WebView } from 'react-native';

import Dialog, { SlideAnimation, ScaleAnimation } from 'react-native-popup-dialog';

import Constant from '../constant/Constant';
import CookieManager from 'react-native-cookies';
import qs from 'qs'

import {
  fontSizer,
  widthSizer,
  isTablet,
} from '../utils/MethodUtils';

const patchPostMessageJsCode = `(${String(function () {
  var originalPostMessage = window.postMessage
  var patchedPostMessage = function (message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer)
  }
  patchedPostMessage.toString = function () {
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
  }
  window.postMessage = patchedPostMessage
})})();`

export default class InstagramLogin extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showAlertView: false,
    }
  }

  show = () => {
    CookieManager.clearAll()
      .then((res) => {
        console.log('CookieManager.clearAll =>', res);
      });
    this.setState({ showAlertView: true })
  }

  _onNavigationStateChange = ({ url }) => {
    if (url && url.startsWith(Constant.INSTAGRAM_REDIRECT_URL)) {
      const match = url.match(/(#|\?)(.*)/)
      const results = qs.parse(match[2])
      this.setState({ showAlertView: false })
      if (results.access_token) {
        // Keeping this to keep it backwards compatible, but also returning raw results to account for future changes.
        this.props.onLoginSuccess(results.access_token, results)
      } else if (results.code) {
        this.props.onLoginSuccess(results.code, results);
      } else {
        this.props.onLoginFailure(results)
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <Dialog
          visible={this.state.showAlertView}
          dialogStyle={{ backgroundColor: 'transparent' }}
          onTouchOutside={() => this.setState({ showAlertView: false })}
          dialogAnimation={new ScaleAnimation({ initialValue: 0, useNativeDriver: true })} >

          <View style={{
            width: Constant.SCREEN_WIDTH * (isTablet() ? 0.6 : 0.8),
            height: Constant.SCREEN_HEIGHT * (isTablet() ? 0.6 : 0.8),
            alignItems: 'center',
            justifyContent: 'center',
          }}>

            <WebView
              style={{
                width: Constant.SCREEN_WIDTH * (isTablet() ? 0.6 : 0.8),
                height: Constant.SCREEN_HEIGHT * (isTablet() ? 0.6 : 0.8),
                backgroundColor: Constant.COLOR_BACK_BLACK
              }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              scalesPageToFit={true}
              startInLoadingState={true}
              injectedJavaScript={patchPostMessageJsCode}
              onNavigationStateChange={(webViewState) => this._onNavigationStateChange(webViewState)}
              source={{ uri: `https://api.instagram.com/oauth/authorize/?client_id=${Constant.INSTAGRAM_CLIENT_ID}&redirect_uri=${Constant.INSTAGRAM_REDIRECT_URL}&response_type=code` }}
            />

          </View>

        </Dialog>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    justifyContent: 'center'
  },
  popupChildView: {
    width: Constant.SCREEN_WIDTH / 1.1,
    backgroundColor: Constant.COLOR_BACK_BLACK,
    alignItems: 'center',
    paddingHorizontal: fontSizer(15),
    paddingVertical: fontSizer(20),
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Constant.COLOR_GOLD,
    justifyContent: 'center'
  },
  popupTitleText: {
    fontFamily: Constant.FONT_CORKI_REGULAR,
    letterSpacing: 1.5,
    fontSize: fontSizer(25),
    color: Constant.COLOR_MAIN
  },
  popupMessageText: {
    fontFamily: Constant.FONT_BACK_GOTHIC_MEDIUM,
    fontSize: fontSizer(15),
    textAlign: 'center',
    marginHorizontal: widthSizer(Constant.SCREEN_WIDTH * (isTablet() ? 0.2 : 0.05)),
    marginTop: fontSizer(15),
    color: Constant.COLOR_WHITE
  },
});
