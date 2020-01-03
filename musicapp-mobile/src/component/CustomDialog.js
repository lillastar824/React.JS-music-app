import React, { Component } from 'react';
import { StyleSheet, View, ImageBackground, Text } from 'react-native';

import Dialog, { SlideAnimation, ScaleAnimation } from 'react-native-popup-dialog';

import Constant from '../constant/Constant';
import RoundCornerButton from './RoundCornerButton'
import BottomBorderButton from './BottomBorderButton'

import {
  fontSizer,
  widthSizer,
  isTablet,
} from '../utils/MethodUtils';

export default class CustomDialog extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showAlertView: false,
      alertData: "",
    }
  }


  showAlert = (alertData) => {
    this.setState({ showAlertView: true, alertData: alertData })
  }

  render() {
    return (
      <View style={styles.container}>

        {Object.keys(this.state.alertData).length > 0 &&
          <Dialog
            visible={this.state.showAlertView}
            dialogStyle={{ backgroundColor: 'transparent' }}
            onTouchOutside={() => this.setState({ showAlertView: false })}
            dialogAnimation={new ScaleAnimation({ initialValue: 0, useNativeDriver: true })} >

            <View style={{
              width: Constant.SCREEN_WIDTH * (isTablet() ? 0.6 : 0.8),
              alignItems: 'center',
              justifyContent: 'center',
            }}>

              <ImageBackground source={require("../assets/images/ic_app_bac.png")} style={styles.popupChildView}>

                <Text style={styles.popupTitleText} >{this.state.alertData.title}</Text>
                <Text style={styles.popupMessageText} >{this.state.alertData.message}</Text>

                <View style={{
                  width: '100%',
                  marginTop: Constant.SCREEN_HEIGHT * 0.05
                }}>

                  <BottomBorderButton
                    text={this.state.alertData.Buttons[0].text}
                    width={isTablet() ? 0.6 : 0.6}
                    fontSize={18}
                    onPressButton={() => {
                      this.state.alertData.getReturnData.buttonIndex = 0
                      this.setState({ showAlertView: false }, () => {
                        setTimeout(() => {
                          this.state.alertData.onButtonPress(this.state.alertData.getReturnData)
                        }, 300);
                      })
                    }}
                  />

                  {this.state.alertData.Buttons.length == 2 &&
                    <BottomBorderButton
                      text={this.state.alertData.Buttons[1].text}
                      width={isTablet() ? 0.6 : 0.6}
                      fontSize={18}
                      style={{ marginTop: 20 }}
                      onPressButton={() => {
                        this.state.alertData.getReturnData.buttonIndex = 1
                        this.setState({ showAlertView: false }, () => {
                          setTimeout(() => {
                            this.state.alertData.onButtonPress(this.state.alertData.getReturnData)
                          }, 300);
                        })
                      }}
                    />
                  }

                </View>

              </ImageBackground>

            </View>

          </Dialog>
        }

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
