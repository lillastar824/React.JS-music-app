import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/Entypo'

import {
  widthSizer,
  fontSizer
} from "../utils/MethodUtils"

import Constant from '../constant/Constant';

export default class TrackListItem extends React.Component {

  render() {
    const { item } = this.props
    return (
      <TouchableOpacity
        disabled={this.props.clickable != undefined ? !this.props.clickable : false}
        onPress={() => this.props.onItemClick(item, this.props.index)}>

        <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }} >

          <View style={styles.musicListRootView}>
            <FastImage
              style={styles.musicListIcon}
              source={item.thumbnail != null ?
                { uri: Constant.URL_MEDIA_IMAGE_ENDPOINT + item.thumbnail }
                :
                (item.url.includes("mp3") ? require("../assets/images/ic_music_image_not_found.png") : require("../assets/images/ic_video_image_not_found.png"))
              }
              resizeMode={FastImage.resizeMode.cover}
            />

            <View>
              <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.musicNameText}>{item.title}</Text>
              <Text numberOfLines={1} ellipsizeMode={"tail"} style={[styles.categoriesSubTitle, { maxWidth: Constant.SCREEN_WIDTH - fontSizer(130) }]}>{item.artist}</Text>
            </View>
          </View>

          {this.props.isPlayIconVisible &&
            <TouchableOpacity
              onPress={() => {
                setTimeout(() => {
                  this.props.onPlayPauseClick(item, this.props.isPlaying, this.props.index)
                }, 300);
              }}
              style={styles.playPauseIconView}>

              {this.props.isPlaying ?
                <Icon name="controller-paus" size={fontSizer(23)} color={Constant.COLOR_GOLD} />
                :
                <Icon name="controller-play" size={fontSizer(23)} color={this.props.isPaused ? Constant.COLOR_GOLD : 'rgba(255,255,255,.5)'} />
              }

            </TouchableOpacity>
          }

        </View>

        <View style={styles.musicListDividerView} />
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


  // music List view
  musicListRootView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: fontSizer(15)
  },
  musicListIcon: {
    width: fontSizer(40),
    height: fontSizer(40),
    borderRadius: fontSizer(20),
    marginHorizontal: fontSizer(15),
    borderWidth: 1,
    borderColor: Constant.COLOR_GOLD,
  },
  playPauseIconView: {
    marginRight: fontSizer(10),
    width: fontSizer(30),
    height: fontSizer(30),
    alignItems: 'center',
    justifyContent: 'center'
  },
  playPauseIcon: {
    width: fontSizer(15),
    height: fontSizer(15),
  },
  musicNameText: {
    color: Constant.COLOR_WHITE,
    fontSize: fontSizer(16),
    maxWidth: Constant.SCREEN_WIDTH - fontSizer(130),
    fontFamily: Constant.FONT_CORKI_REGULAR,
    letterSpacing: 1.5
  },
  musicListDividerView: {
    marginHorizontal: fontSizer(15),
    flex: 1,
    height: 1,
    backgroundColor: Constant.COLOR_TEXT_BLACK
  },
  categoriesSubTitle: {
    color: Constant.COLOR_WHITE,
    fontSize: fontSizer(13),
    marginTop: fontSizer(2),
    fontFamily: Constant.FONT_BACK_GOTHIC_MEDIUM
  },

});
