import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

import {
  widthSizer,
  fontSizer
} from "../utils/MethodUtils"

import Constant from '../constant/Constant';

export default class RoundCornerButton extends React.Component {

  getButtonStyle = () => {

    if (this.props.transparent) {
      return {
        borderWidth: fontSizer(1.5),
        borderColor: Constant.COLOR_WHITE,
        backgroundColor: 'transparent'
      }
    } else {
      return {
        backgroundColor: Constant.COLOR_WHITE
      }
    }
  }

  render() {
    return (
      <TouchableOpacity
        onPress={() => this.props.onPress()}
        style={[styles.container, this.getButtonStyle(), this.props.style]}>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

          {this.props.hasImage &&
            <Image style={styles.buttonImageView} source={this.props.imageUrl} />
          }

          <Text style={[styles.findTextView, {
            color: this.props.transparent ? Constant.COLOR_WHITE : Constant.COLOR_MAIN,
          }]} >{this.props.text}</Text>

        </View>

      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: widthSizer(Constant.SCREEN_WIDTH * 0.7),
    height: Constant.SCREEN_HEIGHT * 0.06,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  findTextView: {
    fontSize: fontSizer(18),
    textAlign: "center",
    fontFamily: Constant.FONT_SFP_REGULAR
  },
  buttonImageView: {
    width: fontSizer(18),
    height: fontSizer(18),
    marginRight: fontSizer(10)
  }
});
