import React from 'react';
import { StyleSheet, Image, TextInput, View } from 'react-native';

import { LinearTextGradient } from "react-native-text-gradient";

import {
    widthSizer,
    fontSizer
} from "../utils/MethodUtils"

import Constant from "../constant/Constant"

export default class BottomBorderTextInput extends React.Component {

    render() {
        return (
            <View style={[{
                alignItems: "center",
                alignSelf: 'center',
                width: widthSizer(Constant.SCREEN_WIDTH * this.props.width)
            }, this.props.style]}>
                <View style={styles.bottomBorderView} >
                    <Image
                        resizeMode={"contain"}
                        style={{ width: widthSizer(Constant.SCREEN_WIDTH * this.props.width), height: '100%' }}
                        source={require('../assets/images/button_bottom_gold_border.png')} />
                </View>

                <TextInput
                    editable={this.props.disabled != undefined ? this.props.disabled : true}
                    selectionColor={Constant.COLOR_GOLD}
                    secureTextEntry={this.props.securityText}
                    style={[styles.findTextView, {
                        width: widthSizer((Constant.SCREEN_WIDTH * this.props.width) - fontSizer(8)),
                        textAlign: this.props.centerText ? 'center' : "left"
                    }]}
                    autoCapitalize={"none"}
                    value={this.props.value}
                    placeholder={this.props.placeholderValue}
                    placeholderTextColor={this.props.placeholderColor ? this.props.placeholderColor : "rgba(245, 209, 101,.4)"}
                    onChangeText={rawText => this.props.onValueChange(rawText)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
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
    GradientText: {
        padding: fontSizer(6),
        letterSpacing: 1.2,
        fontFamily: Constant.FONT_CORKI_REGULAR,
    },
    findTextView: {
        fontSize: fontSizer(19),
        marginTop: -1,
        backgroundColor: "rgba(23,23,23,0.6)",
        color: Constant.COLOR_MAIN,
        borderRadius: fontSizer(4),
        fontFamily: Constant.FONT_CORKI_REGULAR,
        marginHorizontal: fontSizer(4),
        marginBottom: fontSizer(3),
        padding: fontSizer(10),
        letterSpacing: 1.5
    },
});
