import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import Constant from '../constant/Constant';

export default class AppLoader extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isVisible: false,
      color: ""
    }
  }

  showLoader = (color) => {
    this.setState({
      isVisible: true,
      color: color == undefined ? Constant.COLOR_MAIN : Constant.COLOR_WHITE
    })
  }

  hideLoader = () => {
    this.setState({
      isVisible: false
    })
  }

  render() {
    const { isVisible } = Object.keys(this.props).length > 0 ? this.props : this.state

    return (
      <View style={{ elevation: 10, position: 'absolute', width: isVisible ? '100%' : '0%', height: isVisible ? '100%' : '0%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
        {isVisible &&
          <ActivityIndicator size="large" color={this.state.color} />
        }
      </View>
    );
  }
}
