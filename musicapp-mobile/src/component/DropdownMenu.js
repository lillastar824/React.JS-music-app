
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Animated, Easing, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import {
  widthSizer,
  fontSizer,
  isTablet
} from "../utils/MethodUtils"
import Constant from '../constant/Constant';


class DropdownMenu extends Component {

  constructor(props, context) {
    super(props, context);

    var selectIndex = new Array(this.props.data.length);
    for (var i = 0; i < selectIndex.length; i++) {
      selectIndex[i] = 0;
    }
    this.state = {
      activityIndex: -1,
      selectIndex: selectIndex,
      rotationAnims: props.data.map(() => new Animated.Value(0))
    };

    this.defaultConfig = {
      bgColor: 'grey',
      tintColor: '#333333',
      activityTintColor: "red",
      arrowImg: require('../assets/images/ic_drowpdown.png'),
      checkImage: require('../assets/images/ic_dropdown_menucheck.png')
    };

  }

  /**
   * render list of category list with selected icon
   *
   * @param {*} index item index
   * @param {*} title item title
   * @returns view
   * @memberof DropdownMenu
   */
  renderChcek(index, title) {
    var activityIndex = this.state.activityIndex;
    if (this.state.selectIndex[activityIndex] == index) {
      var checkImage = this.props.checkImage ? this.props.checkImage : this.defaultConfig.checkImage;
      return (
        <View style={{ flex: 1, justifyContent: 'space-between', alignItems: "center", paddingHorizontal: fontSizer(15), flexDirection: 'row' }} >
          <Text
            style={[
              styles.item_text_style,
              this.props.optionTextStyle,
              { color: this.props.activityTintColor ? this.props.activityTintColor : this.defaultConfig.activityTintColor }
            ]} >
            {title}
          </Text>
          <Image
            source={checkImage}
            resizeMode={"contain"}
            style={{ tintColor: Constant.COLOR_GOLD, width: fontSizer(15), height: fontSizer(15) }} />
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1, justifyContent: 'space-between', alignItems: "center", paddingHorizontal: fontSizer(15), flexDirection: 'row' }} >
          <Text style={[
            styles.item_text_style,
            this.props.optionTextStyle,
            { color: this.props.tintColor ? this.props.tintColor : this.defaultConfig.tintColor }
          ]} >{title}</Text>
        </View>
      );
    }
  }

  /**
   * render drop-down of category list view 
   * @returns category list view 
   * @memberof DropdownMenu
   */
  renderActivityPanel() {
    if (this.state.activityIndex >= 0) {

      var currentTitles = this.props.data[this.state.activityIndex];

      var heightStyle = {};
      if (this.props.maxHeight && this.props.maxHeight < currentTitles.length * 44) {
        heightStyle.height = this.props.maxHeight;
      }

      return (
        <View style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: fontSizer(55),
          bottom: 0,
        }}>

          <ScrollView style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              backgroundColor: Constant.COLOR_BACK_BLACK,
              borderWidth: 1,
              borderColor: Constant.COLOR_GOLD,
              margin: fontSizer(5),
              borderRadius: 5
            }, heightStyle]} >
            {
              currentTitles.map((title, index) => {
                return (
                  <TouchableOpacity key={index} activeOpacity={1} style={{ flex: 1, paddingVertical: fontSizer(10), borderBottomWidth: 1, borderColor: Constant.COLOR_GOLD }} onPress={this.itemOnPress.bind(this, index)} >
                    {this.renderChcek(index, title)}
                  </TouchableOpacity>
                )
              })
            }
          </ScrollView>
        </View>
      );
    } else {
      return (null);
    }
  }

  /**
   * handle open or close panel
   * @param {*} index
   * @memberof DropdownMenu
   */
  openOrClosePanel(index) {

    this.props.bannerAction ? this.props.bannerAction() : null;

    // var toValue = 0.5;
    if (this.state.activityIndex == index) {
      this.closePanel(index);
      this.setState({
        activityIndex: -1,
      });
      // toValue = 0;
    } else {
      if (this.state.activityIndex > -1) {
        this.closePanel(this.state.activityIndex);
      }
      this.openPanel(index);
      this.setState({
        activityIndex: index,
      });
      // toValue = 0.5;
    }
    // Animated.timing(
    //   this.state.rotationAnims[index],
    //   {
    //     toValue: toValue,
    //     duration: 300,
    //     easing: Easing.linear
    //   }
    // ).start();
  }

  /**
   * handle panel open event
   * @param {*} index
   * @memberof DropdownMenu
   */
  openPanel(index) {
    Animated.timing(
      this.state.rotationAnims[index],
      {
        toValue: 0.5,
        duration: 300,
        easing: Easing.linear
      }
    ).start();
  }

  /**
   * handle panel close event
   * @param {*} index
   * @memberof DropdownMenu
   */
  closePanel(index) {
    Animated.timing(
      this.state.rotationAnims[index],
      {
        toValue: 0,
        duration: 300,
        easing: Easing.linear
      }
    ).start();
  }

  /**
   * handle item press event
   * @param {*} index pressed item index
   * @memberof DropdownMenu
   */
  itemOnPress(index) {
    if (this.state.activityIndex > -1) {
      var selectIndex = this.state.selectIndex;
      selectIndex[this.state.activityIndex] = index;
      this.setState({
        selectIndex: selectIndex
      });
      if (this.props.handler) {
        this.props.handler(this.state.activityIndex, index);
      }
    }
    this.openOrClosePanel(this.state.activityIndex);
  }

  /**
   * render arrow 
   * @param {*} index
   * @returns
   * @memberof DropdownMenu
   */
  renderDropDownArrow(index) {
    var icon = this.props.arrowImg ? this.props.arrowImg : this.defaultConfig.arrowImg;
    return (
      <Animated.Image
        source={icon}
        style={{
          width: fontSizer(6),
          height: fontSizer(4),
          marginLeft: 8,
          tintColor: (index === this.state.activityIndex) ? (this.props.activityTintColor ? this.props.activityTintColor : this.defaultConfig.activityTintColor) : (this.props.tintColor ? this.props.tintColor : this.defaultConfig.tintColor),
          transform: [{
            rotateZ: this.state.rotationAnims[index].interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg']
            })
          }]
        }} />
    );
  }

  render() {

    return (
      <View style={{ flexDirection: 'column', alignItems: 'center', flex: 1 }} >

        <View style={[{
          backgroundColor: this.props.bgColor,
          alignItems: 'center',
        }, this.props.style]} >

          <View style={styles.bottomBorderView} >
            <Image
              resizeMode={"contain"}
              style={{ width: '100%', height: '100%' }}
              source={require('../assets/images/button_bottom_gold_border.png')} />
          </View>

          {
            this.props.data.map((rows, index) =>
              <TouchableOpacity
                activeOpacity={1}
                onPress={this.openOrClosePanel.bind(this, index)}
                key={index}
                style={{
                  paddingVertical: fontSizer(10),
                  paddingHorizontal: fontSizer(5),
                  borderRadius: 3,
                  marginBottom: fontSizer(isTablet() ? 2 : 4),
                  marginHorizontal: fontSizer(isTablet() ? 4 : 2),
                  minWidth: fontSizer(Constant.SCREEN_WIDTH * 0.4),
                  backgroundColor: Constant.COLOR_BACK_BLACK,
                  alignItems: "center",
                  justifyContent: "center"
                }} >
                <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "center" }} >
                  <Text
                    style={[
                      this.props.titleStyle,
                      {
                        color: (index === this.state.activityIndex) ?
                          (this.props.activityTintColor ? this.props.activityTintColor : this.defaultConfig.activityTintColor)
                          :
                          (this.props.tintColor ? this.props.tintColor : this.defaultConfig.tintColor),
                        letterSpacing: -1.5
                      }
                    ]} >
                    {rows[this.state.selectIndex[index]]}
                  </Text>
                  {this.renderDropDownArrow(index)}
                </View>
              </TouchableOpacity>
            )
          }
        </View>

        {this.props.children}

        {this.renderActivityPanel()}

      </View>
    );
  }

}

DropdownMenu.propTypes = {
  bgColor: PropTypes.string,
  tintColor: PropTypes.string,
  activityTintColor: PropTypes.string,
  arrowImg: PropTypes.number,
  checkImage: PropTypes.number,
  data: PropTypes.array,
  bannerAction: PropTypes.func,
  optionTextStyle: PropTypes.object,
  titleStyle: PropTypes.object,
  maxHeight: PropTypes.number
}

const styles = StyleSheet.create({
  title_style: {
    fontSize: fontSizer(14)
  },
  item_text_style: {
    color: '#333333',
    fontSize: 14
  },
  bottomBorderView: {
    position: 'absolute',
    bottom: fontSizer(-6),
    right: 0,
    left: 0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    height: fontSizer(25),
  },
});

export default DropdownMenu;