import React from "react";
import {
    StyleSheet, Image, TouchableOpacity, View, Text,
} from "react-native";

import Icon from 'react-native-vector-icons/Ionicons'

import {
    getStatusBarHeight,
    widthSizer,
    fontSizer
} from "../utils/MethodUtils";

import Constant from '../constant/Constant'

export default class TabBarHeader extends React.Component {

    render() {
        return (
            <View style={styles.top_container}>

                <Text style={styles.centerText}>{this.props.headerTitle}</Text>

                <View style={{
                    width: Constant.SCREEN_WIDTH,
                    flexDirection: 'row',
                    alignItems: 'center'
                }} >

                    {this.props.isBackVisible &&
                        <TouchableOpacity
                            style={styles.backButtonView}
                            onPress={() => {
                                this.props.onPressBack()
                            }} >
                            <Icon name="ios-arrow-back" size={fontSizer(23)} color={Constant.COLOR_GOLD} />
                        </TouchableOpacity>
                    }


                    <View
                        style={styles.backButtonView} >
                        <Image
                            style={[styles.backButton, { width: 0 }]}
                        />
                    </View>

                </View>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    top_container: {
        paddingTop: getStatusBarHeight() + fontSizer(5),
        paddingBottom: fontSizer(5),
        backgroundColor: Constant.COLOR_BACK_BLACK,
        width: "100%",
        justifyContent: 'center',
    },

    // back image 
    backButtonView: {
        paddingHorizontal: fontSizer(20),
        paddingVertical: fontSizer(10),
    },
    backButton: {
        height: fontSizer(17),
        marginLeft: fontSizer(10),
        width: fontSizer(17)
    },

    centerText: {
        color: Constant.COLOR_MAIN,
        position: "absolute",
        fontSize: fontSizer(30),
        textAlign: 'center',
        width: Constant.SCREEN_WIDTH,
        fontFamily: Constant.FONT_TAKEN_VULTURES_DEMO,
        paddingTop: getStatusBarHeight() + fontSizer(15),
        paddingBottom: fontSizer(15)
    },
});
