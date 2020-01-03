import React from 'react';
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';

import { LinearTextGradient } from "react-native-text-gradient";

import {
    widthSizer,
    fontSizer,
    isTablet
} from "../utils/MethodUtils"

import Constant from "../constant/Constant"

export default class BottomBorderButton extends React.Component {

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

                <TouchableOpacity
                    onPress={() => this.props.onPressButton()}
                    activeOpacity={0.7}
                    style={[styles.ButtonView, { width: widthSizer((Constant.SCREEN_WIDTH * this.props.width) - fontSizer(isTablet() ? 8 : 5)), }]} >
                    <LinearTextGradient
                        style={[styles.GradientText, { fontSize: fontSizer(this.props.fontSize) }]}
                        locations={[0, 0.5, 1]}
                        colors={["#F5D165", "#8D7F4F", "#F5D165"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}>{this.props.text}</LinearTextGradient>
                </TouchableOpacity>
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
    ButtonView: {
        borderRadius: fontSizer(4),
        margin: fontSizer(isTablet() ? 2.5 : 3),
        alignItems: 'center',
        backgroundColor: "rgba(23,23,23,.6)"
    },
    GradientText: {
        padding: fontSizer(6),
        letterSpacing: 1.2,
        fontFamily: Constant.FONT_CORKI_REGULAR,
    }
});
