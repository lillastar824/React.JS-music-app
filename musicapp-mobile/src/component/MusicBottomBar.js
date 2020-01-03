import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';

import { BottomTabBar } from 'react-navigation'
import { connect } from 'react-redux';
import TrackPlayer from 'react-native-track-player';
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/Entypo'

import {
  fontSizer,
  isTablet
} from "../utils/MethodUtils"

import {
  setIsRepeatMusicEnable,
  setMusicButtonLoader,
  pauseMusicFromApp
} from "../action/ActionMusic"

import Constant from '../constant/Constant';
import HomeScreen from "../screens/HomeScreen"
import SearchScreen from "../screens/SearchScreen"
import MenuScreen from "../screens/MenuScreen"

class MusicBottomBar extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      isPlaying: false
    }
  }

  _onPlayButtonPress = async () => {
    if (this.props.isPlaying) {
      TrackPlayer.pause();
      this.props.pauseMusicFromApp(false)
    } else {
      await TrackPlayer.play();
    }
  }

  render() {

    const isPlaying = Object.keys(this.props.currentPlayingMusicDetails).length > 0 &&
      "trackCurrentPlyingTime" in this.props.currentPlayingMusicDetails

    return (
      <View style={{ width: '100%', backgroundColor: Constant.COLOR_BACK_BLACK }}>

        {this.props.currentOpenScreen < 10 &&

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {

              const isPlayingInner = Object.keys(this.props.currentPlayingMusicDetails).length > 0 &&
                "trackCurrentPlyingTime" in this.props.currentPlayingMusicDetails

              if (!isPlayingInner) {
                return
              }

              switch (this.props.currentOpenScreen) {
                case 0:
                  HomeScreen.navigateToPlayScreen()
                  break;
                case 1:
                  SearchScreen.navigateToPlayScreen()
                  break;
                case 2:
                  MenuScreen.navigateToPlayScreen()
                  break;
                default:
                  break;
              }
            }}
          >
            <View style={[styles.musicBarMainView, { height: isPlaying ? fontSizer(50) : 0 }]} >

              <View style={styles.trackDetailsView}>

                <FastImage
                  style={styles.trackImage}
                  source={this.props.currentPlayingMusicDetails.trackObject ? (this.props.currentPlayingMusicDetails.trackObject.artwork.includes("/null") ? require("../assets/images/ic_music_image_not_found.png") : { uri: this.props.currentPlayingMusicDetails.trackObject.artwork }) : { uri: "" }}
                  resizeMode={FastImage.resizeMode.cover}
                />

                <View>
                  <Text style={styles.trackNameText} >{this.props.currentPlayingMusicDetails.trackObject ? this.props.currentPlayingMusicDetails.trackObject.title : ""}</Text>
                  <Text style={styles.trackArtistNameText}>{this.props.currentPlayingMusicDetails.trackObject ? this.props.currentPlayingMusicDetails.trackObject.artist : ""}</Text>
                </View>

              </View>

              <View style={styles.trackDetailsView} >

                <TouchableOpacity
                  onPress={() => {
                    setTimeout(() => {
                      this._onPlayButtonPress()
                    }, 300);
                  }}
                  disabled={this.props.showLoaderOnPlayButton}
                  style={styles.buttonTouchView}  >
                  {this.props.showLoaderOnPlayButton ?
                    <ActivityIndicator size={"small"} color={Constant.COLOR_BLACK} />
                    :
                    <View>
                      {this.props.isPlaying ?
                        <Icon name="controller-paus" size={fontSizer(23)} color={Constant.COLOR_BACK_BLACK} />
                        :
                        <Icon name="controller-play" size={fontSizer(23)} color={Constant.COLOR_BACK_BLACK} />
                      }
                    </View>
                  }
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={this.props.showLoaderOnPlayButton}
                  onPress={() => {
                    setTimeout(() => {
                      this.props.setIsRepeatMusicEnable(false)
                      this.props.setMusicButtonLoader(true)
                      TrackPlayer.skipToNext()
                    }, 300);
                  }}
                  style={[styles.buttonTouchView, { marginRight: fontSizer(5) }]}  >
                  <Icon name="controller-fast-forward" size={fontSizer(23)} color={Constant.COLOR_BACK_BLACK} />
                </TouchableOpacity>

              </View>

            </View>
          </TouchableOpacity>
        }


        <BottomTabBar {...this.props} />

      </View>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    isPlaying: store.MusicState.isPlaying,
    currentPlayingMusicDetails: store.MusicState.currentPlayingMusicDetails,
    trackData: store.MusicState.trackData,
    showLoaderOnPlayButton: store.MusicState.showLoaderOnPlayButton,
    currentOpenScreen: store.UserAuth.currentOpenScreen
  }
}

const mapDispatchToProps = {
  setIsRepeatMusicEnable,
  setMusicButtonLoader,
  pauseMusicFromApp
}

export default connect(mapStateToProps, mapDispatchToProps)(MusicBottomBar);

const styles = StyleSheet.create({
  musicBarMainView: {
    width: '100%',
    backgroundColor: Constant.COLOR_MAIN,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pauseIconImageView: {
    width: fontSizer(16),
    height: fontSizer(16)
  },
  buttonTouchView: {
    padding: fontSizer(10),
  },
  trackNameText: {
    color: Constant.COLOR_BACK_BLACK,
    fontSize: fontSizer(14),
    fontFamily: Constant.FONT_CORKI_REGULAR,
    letterSpacing: 1.5
  },
  trackArtistNameText: {
    color: Constant.COLOR_BACK_BLACK,
    fontSize: fontSizer(13),
    fontFamily: Constant.FONT_BACK_GOTHIC_MEDIUM
  },
  trackImage: {
    width: fontSizer(32),
    height: fontSizer(32),
    borderRadius: fontSizer(16),
    marginHorizontal: fontSizer(isTablet ? 15 : 10),
    // borderWidth: 1,
    // borderColor: Constant.COLOR_BACK_BLACK
  },
  trackDetailsView: {
    flexDirection: 'row',
    alignItems: 'center'
  }

})
