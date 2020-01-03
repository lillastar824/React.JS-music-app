import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  AppState
} from 'react-native';

import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image'
import Video from 'react-native-af-video-player'
import Orientation from 'react-native-orientation';
import TrackPlayer from 'react-native-track-player';
import Icon from 'react-native-vector-icons/Entypo'
import IconIonic from 'react-native-vector-icons/Ionicons'

import {
  widthSizer,
  fontSizer,
  manageApiResponseCode,
  GoogleAnalyticsTrackScreen
} from "../utils/MethodUtils"

import {
  setVideoPlayerState,
  setCurrentPlayingVideoDetails,
  pauseMusicFromApp
} from "../action/ActionMusic"

import {
  setUserCurrentOpenedScreen
} from "../action/ActionUserAuth"

import TabBarHeader from "../component/TabBarHeader"
import Constant from "../constant/Constant"
import TrackListItem from "../component/TrackListItem"

var lastOpenedScreen, videoPauseAutomatic = false;

class NowPlayingVideoScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      trackList: [],
      videoInFullScreen: false,
    }
  }

  componentDidMount() {
    lastOpenedScreen = this.props.currentOpenScreen
    this.props.setUserCurrentOpenedScreen(11)
    GoogleAnalyticsTrackScreen.VideoPlayerScreen()

    this.setScreenOrientation()
    this.getUpcomingVideoApi()
    AppState.addEventListener('change', this._handleAppStateChange);
  }
  _handleAppStateChange = (nextAppState) => {
    console.log('App has come to the foreground!' + nextAppState);
    if (nextAppState === "active") {
      if (videoPauseAutomatic) {
        this.video.play()
        TrackPlayer.pause();
        this.props.pauseMusicFromApp(false)
        videoPauseAutomatic = false
      }
    } else {
      if (this.props.isVideoPlaying) {
        this.video.pause()
        videoPauseAutomatic = true
      }
    }
  };


  componentWillUnmount() {
    this.props.setVideoPlayerState(false)
    this.props.setUserCurrentOpenedScreen(lastOpenedScreen)
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  setScreenOrientation = () => {

    Orientation.unlockAllOrientations();

    this.props.navigation.addListener('didFocus', payload => {
      Orientation.unlockAllOrientations();
    });

    this.props.screenProps.rootNavigation.addListener('didFocus', payload => {
      Orientation.unlockAllOrientations();
    });

    this.props.screenProps.rootNavigation.addListener('willBlur', payload => {
      Orientation.lockToPortrait();
    });

    this.props.navigation.addListener('willBlur', payload => {
      Orientation.lockToPortrait();
    });

  }

  getUpcomingVideoApi = () => {

    var formData = new FormData()
    formData.append("token", this.props.userData.token)
    formData.append("id", this.props.currentPlayingVideoDetails.id)

    Constant.showLoader.showLoader()

    fetch(Constant.API_UPCOMING_VIDEOS, {
      method: 'POST',
      headers: {
        'Authorization': Constant.HEADER,
      },
      body: formData
    }).then(r => r.json())
      .then((data) => {
        this.setState({ isNoDataFoundDisplay: true })
        Constant.showLoader.hideLoader()

        if (data.status_code === 200) {

          if (data.data.length > 0) {
            this.setState({ trackList: data.data })
          }

        } else {
          manageApiResponseCode(data, this.props.screenProps.mainNavigation)
        }

      }).catch(exception => {
        console.log("exception ---> " + JSON.stringify(exception));
        Constant.showLoader.hideLoader()
      });
  }


  onFullScreen(status) {

    this.setState({ videoInFullScreen: status })
    // Set the params to pass in fullscreen status to navigationOptions
    this.props.screenProps.rootNavigation.setParams({
      fullscreen: !status
    })
  }

  renderTrackList = ({ item, index }) => {
    const isPlaying = this.props.isVideoPlaying && this.props.currentPlayingVideoDetails.id == item.id
    const isPaused = this.props.currentPlayingVideoDetails.id == item.id

    return (
      <TrackListItem
        item={item}
        index={index}
        clickable={false}
        isPlaying={isPlaying}
        isPaused={isPaused}
        isPlayIconVisible={true}
        onItemClick={(item, index) => {
        }}
        onPlayPauseClick={(item, isPlaying, index) => {

          if (this.props.currentPlayingVideoDetails.id == item.id) {

            if (this.props.isVideoPlaying) {
              this.video.pause()
            } else {
              this.video.play()
            }

          } else {
            this.props.setCurrentPlayingVideoDetails(this.state.trackList[index], true)
          }

        }}
      />
    )
  }

  _playNextVideo = () => {
    const currentPLayingVideoId = this.state.trackList.findIndex(x => x.id === this.props.currentPlayingVideoDetails.id)
    this.props.setCurrentPlayingVideoDetails(this.state.trackList[currentPLayingVideoId + 1], true)
    GoogleAnalyticsTrackScreen.PlayVideo(this.props.currentPlayingVideoDetails.title)
  }

  _playPreviousVideo = () => {
    const currentPLayingVideoId = this.state.trackList.findIndex(x => x.id === this.props.currentPlayingVideoDetails.id)
    this.props.setCurrentPlayingVideoDetails(this.state.trackList[currentPLayingVideoId - 1], true)
    GoogleAnalyticsTrackScreen.PlayVideo(this.props.currentPlayingVideoDetails.title)
  }

  render() {
    return (
      <View style={styles.container}>

        {!this.state.videoInFullScreen &&
          <TabBarHeader
            headerTitle={"Now Playing"}
            isBackVisible={true}
            onPressBack={() => {
              this.props.navigation.pop()
            }} />
        }

        <ImageBackground source={require("../assets/images/ic_app_bac.png")} style={{ flex: 1 }}>

          <View style={{ overflow: 'hidden' }} >
            <Video
              ref={(ref) => { this.video = ref }}
              style={{
                alignSelf: 'center',
                backgroundColor: Constant.COLOR_BLACK,
                width: widthSizer(Constant.SCREEN_WIDTH),
                height: fontSizer(210)
              }}
              onFullScreen={status => this.onFullScreen(status)}
              // lockPortraitOnFsExit={true}
              // playInBackground={false}
              // playWhenInactive={false}
              volume={1}
              rotateToFullScreen={true}
              onPlay={async (status) => {
                this.props.setVideoPlayerState(status)
                await TrackPlayer.pause();
                this.props.pauseMusicFromApp(false)
              }}
              onEnd={() => {
                if (this.state.trackList.findIndex(x => x.id === this.props.currentPlayingVideoDetails.id) < this.state.trackList.length - 1) {
                  this._playNextVideo()
                }
              }}
              autoPlay={this.props.willPlayVideo}
              theme={{
                title: Constant.COLOR_MAIN,
                more: Constant.COLOR_WHITE,
                center: this.props.isVideoPlaying ? Constant.COLOR_MAIN : "transparent",
                fullscreen: Constant.COLOR_WHITE,
                volume: Constant.COLOR_WHITE,
                scrubberThumb: '#c9c9c9',
                scrubberBar: Constant.COLOR_MAIN,
                seconds: Constant.COLOR_WHITE,
                duration: Constant.COLOR_WHITE,
                progress: Constant.COLOR_MAIN,
                loading: Constant.COLOR_MAIN,
              }}
              url={Constant.URL_MEDIA_ENDPOINT + this.props.currentPlayingVideoDetails.url} />

          </View>

          {!this.props.isVideoPlaying &&
            <View style={[styles.absoluteFullView, {
              height: this.state.videoInFullScreen ? (Constant.SCREEN_WIDTH - 35) : (fontSizer(210) - 35),
            }]}>


              <View style={{ width: '55%', flexDirection: 'row', marginTop: 35, justifyContent: 'space-between' }}>

                {this.state.trackList.findIndex(x => x.id === this.props.currentPlayingVideoDetails.id) <= 0 ?
                  <View style={{ width: fontSizer(18) + 20, }} />
                  :
                  <TouchableOpacity
                    onPress={() => this._playPreviousVideo()}
                    style={{ padding: 10 }}  >
                    <Icon name="controller-jump-to-start" size={fontSizer(27)} color={Constant.COLOR_WHITE} />
                  </TouchableOpacity>
                }

                <TouchableOpacity
                  onPress={async () => {
                    GoogleAnalyticsTrackScreen.PlayVideo(this.props.currentPlayingVideoDetails.title)
                    this.video.play()
                    await TrackPlayer.pause();
                    this.props.pauseMusicFromApp(false)
                  }}
                  style={styles.playButtonView} >
                  <Icon name="controller-play" style={{ marginTop: fontSizer(3), marginLeft: fontSizer(5) }} size={fontSizer(26)} color={Constant.COLOR_BACK_BLACK} />
                </TouchableOpacity>

                {this.state.trackList.findIndex(x => x.id === this.props.currentPlayingVideoDetails.id) >= this.state.trackList.length - 1 ?
                  <View style={{ width: fontSizer(18) + 20 }} />
                  :
                  <TouchableOpacity
                    onPress={() => this._playNextVideo()}
                    style={{ padding: 10, }}  >
                    <Icon name="controller-next" size={fontSizer(27)} color={Constant.COLOR_WHITE} />
                  </TouchableOpacity>
                }
              </View>

            </View>
          }

          <TrackListItem
            item={this.props.currentPlayingVideoDetails}
            clickable={false}
            sPlayIconVisible={false} />

          <View style={styles.musicListDividerView} />

          {this.state.trackList.length > 0 &&
            <Text style={styles.musicNameText}>{`Up Next`}</Text>
          }

          {this.state.trackList.length > 0 &&
            <FlatList
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              data={this.state.trackList}
              renderItem={this.renderTrackList}
            />
          }

        </ImageBackground>

      </View >
    );
  }
}

const mapStateToProps = (store) => {
  return {
    userData: store.UserAuth.userData,
    currentPlayingVideoDetails: store.MusicState.currentPlayingVideoDetails,
    isVideoPlaying: store.MusicState.isVideoPlaying,
    willPlayVideo: store.MusicState.willPlayVideo,
    currentOpenScreen: store.UserAuth.currentOpenScreen
  }
}

const mapDispatchToProps = {
  setVideoPlayerState,
  setCurrentPlayingVideoDetails,
  setUserCurrentOpenedScreen,
  pauseMusicFromApp
}

export default connect(mapStateToProps, mapDispatchToProps)(NowPlayingVideoScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constant.COLOR_BLACK
  },
  musicNameText: {
    color: Constant.COLOR_TEXT_BLACK,
    fontSize: fontSizer(22),
    padding: fontSizer(12),
    letterSpacing: 1.5,
    fontFamily: Constant.FONT_CORKI_REGULAR
  },
  categoriesSubTitle: {
    color: Constant.COLOR_TEXT_BLACK,
    fontSize: fontSizer(16),
    marginTop: fontSizer(2),
    fontFamily: Constant.FONT_SFP_REGULAR
  },

  //video view
  absoluteFullView: {
    position: 'absolute',
    top: 0,
    bottom: 35,
    right: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },

  // control section
  controlSectionRootView: {
    flex: 0.4,
    width: Constant.SCREEN_WIDTH * 0.75,
    alignSelf: 'center'
  },
  repeatButtonView: {
    padding: fontSizer(8)
  },
  timeDisplayView: {
    color: Constant.COLOR_TEXT_BLACK,
    fontSize: fontSizer(13),
    marginTop: fontSizer(2),
    fontFamily: Constant.FONT_SFP_LIGHT
  },
  repeatButtonRootView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  playButtonRootView: {
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexGrow: 1,
  },
  playButtonView: {
    backgroundColor: Constant.COLOR_MAIN,
    width: fontSizer(44),
    height: fontSizer(44),
    borderRadius: fontSizer(22),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Constant.COLOR_MAIN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 4,
  },
  playIconImageView: {
    width: fontSizer(18),
    height: fontSizer(18),
    marginLeft: 4
  },
  pauseIconImageView: {
    width: fontSizer(15),
    height: fontSizer(15)
  },

  musicListDividerView: {
    width: Constant.SCREEN_WIDTH,
    height: 1,
    backgroundColor: Constant.COLOR_MAIN
  }

});