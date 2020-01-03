import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

import {
  widthSizer,
  fontSizer
} from "../utils/MethodUtils"

import Constant from '../constant/Constant';
import { TextInput } from 'react-native-gesture-handler';

export default class RoundCornerTextinput extends React.Component {


  render() {
    return (
      <View
        onPress={() => this.props.onPress()}
        style={[styles.container, this.props.style]}>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

          {this.props.hasImage &&
            <Image resizeMode={"contain"} style={styles.buttonImageView} source={this.props.imageUrl} />
          }

          <TextInput
            secureTextEntry={this.props.securityText}
            style={[styles.findTextView, {
              color: this.props.textColor ? this.props.textColor : Constant.COLOR_WHITE,
              textAlign: this.props.centerText ? "center" : "left"
            }]}
            autoCapitalize={"none"}
            value={this.props.value}
            placeholder={this.props.placeholderValue}
            placeholderTextColor={this.props.placeholderColor ? this.props.placeholderColor : "rgba(255,255,255,.8)"}
            onChangeText={rawText => this.props.onValueChange(rawText)}
          />

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: Constant.SCREEN_HEIGHT * 0.075,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: fontSizer(1),
    borderColor: Constant.COLOR_WHITE,
    backgroundColor: 'transparent',
    paddingHorizontal: '10%'
  },
  findTextView: {
    fontSize: fontSizer(17),
    width: '100%',
    marginTop: -1,
    fontFamily: Constant.FONT_SFP_REGULAR
  },
  buttonImageView: {
    width: fontSizer(16),
    height: fontSizer(16),
    marginRight: fontSizer(13)
  }
});
