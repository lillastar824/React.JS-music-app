import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Constant from '../constant/Constant';

import FastImage from 'react-native-fast-image'

import {
  fontSizer
} from "../utils/MethodUtils"

export default class NoDataFoundView extends Component {

  render() {
    return (
      <View style={[{
        width: this.props.view ? '100%' : "0%",
        height: this.props.view ? '100%' : "0%",
        backgroundColor: Constant.COLOR_TRANSPARENT,
        alignItems: 'center',
        justifyContent: 'center'
      }, this.props.style]} >

        {this.props.view &&
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            style={{
              width: fontSizer(80),
              height: fontSizer(80),
              marginBottom: fontSizer(15)
            }}
            source={this.props.icon}
          />
        }

        {this.props.view &&
          <Text style={{
            color: Constant.COLOR_WHITE,
            fontFamily: Constant.FONT_BACK_GOTHIC_MEDIUM,
            fontSize: fontSizer(18),
            width: Constant.SCREEN_WIDTH * 0.8,
            textAlign: 'center'
          }}>{this.props.textLabel}</Text>
        }

      </View>

    );
  }
}
