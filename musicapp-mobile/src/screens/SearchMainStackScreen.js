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

import SearchStackNavigator from "../navigators/SearchStackNavigator"

import SearchScreen from "./SearchScreen"

class SearchMainStackScreen extends React.Component {

  componentDidMount() {
    const didBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload => {
        SearchScreen.manageChildStack()
      }
    );
    const didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.props.setUserCurrentOpenedScreen(1)
      }
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <SearchStackNavigator screenProps={{ rootNavigation: this.props.navigation }} />
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchMainStackScreen);


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
