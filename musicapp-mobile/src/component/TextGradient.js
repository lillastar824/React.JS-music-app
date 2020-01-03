import React from 'react';
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';

import { LinearTextGradient } from "react-native-text-gradient";

import {
    widthSizer,
    fontSizer
} from "../utils/MethodUtils"

import Constant from "../constant/Constant"

export default class TextGradient extends React.Component {

    render() {
        return (
            <LinearTextGradient
                style={[styles.GradientText, { fontSize: fontSizer(this.props.fontSize) } , this.props.style]}
                locations={[0, 0.5, 1]}
                colors={["#F5D165", "#8D7F4F", "#F5D165"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>{this.props.text}</LinearTextGradient>
        );
    }Ò
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
        margin: fontSizer(4),
        alignItems: 'center',
        backgroundColor: Constant.COLOR_BACK_BLACK
    },
    GradientText: {
        fontFamily: Constant.FONT_CORKI_REGULAR,
        textAlign:'center',
    }
});
