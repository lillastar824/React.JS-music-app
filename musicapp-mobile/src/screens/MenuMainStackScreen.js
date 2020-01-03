import React from 'react';
import { View, StyleSheet, Image, StatusBar } from 'react-native';

import { connect } from 'react-redux';

import {
  widthSizer,
  fontSizer
} from "../utils/MethodUtils"

import {
  setUserCurrentOpenedScreen
} from "../action/ActionUserAuth"

import Constant from "../constant/Constant"

import MenuStackNavigator from "../navigators/MenuStackNavigator"

import MenuScreen from "./MenuScreen"

class MenuMainStackScreen extends React.Component {

  componentDidMount() {
    const didBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload => {
        MenuScreen.manageChildStack()
      }
    );
    const didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.props.setUserCurrentOpenedScreen(2)
      }
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <MenuStackNavigator screenProps={{ rootNavigation: this.props.navigation }} />
      </View>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    name: store.UserAuth.name
  }
}

const mapDispatchToProps = {
  setUserCurrentOpenedScreen
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuMainStackScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constant.COLOR_WHITE
  },
  centerIcon: {
    width: Constant.SCREEN_WIDTH,
    height: fontSizer(70)
  }
});
