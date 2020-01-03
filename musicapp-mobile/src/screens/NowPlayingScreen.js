import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  ImageBackground,
  ActivityIndicator,
  Platform,
} from 'react-native';

import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import Orientation from 'react-native-orientation';
import TrackPlayer from 'react-native-track-player';
import Icon from 'react-native-vector-icons/Entypo'
import IconIonic from 'react-native-vector-icons/Ionicons'

import {
  widthSizer,
  fontSizer,
  addTrackInAudioPlayer,
  changeSecondToAppHour,
  addTrackInAudioPlayerWithSpecificId,
  GoogleAnalyticsTrackScreen
} from "../utils/MethodUtils"

import {
  setCurrentPlayingDetails,
  setMusicShuffleState,
  setMusicSRepeatState,
  setResetTrackData,
  setIsRepeatMusicEnable,
  setMusicButtonLoader,
  pauseMusicFromApp
} from "../action/ActionMusic"

import {
  setUserCurrentOpenedScreen
} from "../action/ActionUserAuth"

import TabBarHeader from "../component/TabBarHeader"
import Constant from "../constant/Constant"

var isPlayingLocal, musicChanged, lastOpenedScreen, musicSeeked = false

class NowPlayingScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      trackCurrentPlyingTime: 0,
      trackSeekedValue: 0,
      trackDetailObject: {},
      totalTrackLength: 1,
    }
    this.RotateValueHolder = new Animated.Value(0);
  }

  /**
   * Hide music bottom bar, google analytics, initialize track player event
   * add disc rotation animation
   * @memberof NowPlayingScreen
   */
  componentDidMount() {
    musicSeeked = false
    lastOpenedScreen = this.props.currentOpenScreen
    this.props.setUserCurrentOpenedScreen(11)
    GoogleAnalyticsTrackScreen.MusicPlayerScreen()
    isPlayingLocal = false
    musicChanged = false
    Orientation.lockToPortrait();
    this._setTrackerEvent()

    this.RotateValueHolder.addListener(({ value }) => this._value = value);

    if (this.props.isPlaying && (this.props.navigation.state.params.currentPlayingMusicDetails.trackObject.id == parseInt(this.props.currentPlayingMusicDetails.trackObject.id))) {
      isPlayingLocal = true
      this.StartImageRotateFunction()
    }

  }

  /**
   * unregister track player listner  
   * show music bottom bar
   * @memberof NowPlayingScreen
   */
  componentWillUnmount() {
    this.props.setUserCurrentOpenedScreen(lastOpenedScreen)
    this._onStateChanged.remove()
  }

  /**
   * set music track player event
   *
   * @memberof NowPlayingScreen
   */
  _setTrackerEvent = () => {

    this._onStateChanged = TrackPlayer.addEventListener('playback-state', (data) => {
      this.changeMusicStatue(data.state)
    })
  }

  changeMusicStatue = (state) => {
    if (state == TrackPlayer.STATE_PAUSED || state == 2) {

      isPlayingLocal = false

      Animated.timing(
        this.RotateValueHolder
      ).stop();

      clearInterval(this.getMusicDetailsInterval)

    } else if (state == TrackPlayer.STATE_BUFFERING || state == 6) {

      if (Platform.OS === "android") this.props.setMusicButtonLoader(true)

    } else if (state == TrackPlayer.STATE_PLAYING || state == 3) {

      if (Platform.OS === "android") {
        setTimeout(() => {
          this.props.setMusicButtonLoader(false)
        }, 200);

        if (musicSeeked) {
          TrackPlayer.seekTo(this.state.trackSeekedValue);
          TrackPlayer.play();
          musicSeeked = false
        }
      }

      if (this.props.showLoaderOnPlayButton) {
        return
      }

      if (!isPlayingLocal) {
        setTimeout(() => {
          this.StartImageRotateFunction()
        }, 300);
      }
      isPlayingLocal = true

      setTimeout(() => {
        musicChanged = true
      }, 300);

    } else if (state == TrackPlayer.STATE_READY) {
      setTimeout(() => {
        this.props.setMusicButtonLoader(false)
      }, 200);

      if (musicSeeked) {
        TrackPlayer.seekTo(this.state.trackSeekedValue);
        TrackPlayer.play();
        musicSeeked = false
      }
    }

  }

  /**
   * get current music playing details and send details in store
   * @memberof NowPlayingScreen
   */
  getCurrentMusicData = async () => {

    let trackId = await TrackPlayer.getCurrentTrack();
    let trackObject = await TrackPlayer.getTrack(trackId);
    let position = await TrackPlayer.getPosition();
    let buffered = await TrackPlayer.getBufferedPosition();
    let duration = await TrackPlayer.getDuration();

    const currentMusicValue = {
      trackCurrentPlyingTime: parseInt(position),
      trackSeekedValue: parseInt(position),
      trackObject: trackObject,
      totalTrackLength: parseInt(duration),
    }

    this.props.setCurrentPlayingDetails(currentMusicValue)

  }

  /**
   * manage music play button press event 
   * @memberof NowPlayingScreen
   */
  _onPlay = async () => {

    let currentBufferPosition = await TrackPlayer.getBufferedPosition()

    var isPLaying = musicChanged ? (currentBufferPosition === 0 ? false : true) :
      (Object.keys(this.props.currentPlayingMusicDetails).length > 0 &&
        (this.props.navigation.state.params.currentPlayingMusicDetails.trackObject.id == parseInt(this.props.currentPlayingMusicDetails.trackObject.id)) &&
        parseInt(this.props.currentPlayingMusicDetails.trackCurrentPlyingTime) > 1)

    if (!isPLaying) {

      this.props.setMusicButtonLoader(true)

      const { currentPlayingMusicDetails } = musicChanged ? this.props : (
        Object.keys(this.props.currentPlayingMusicDetails).length > 0 && (this.props.navigation.state.params.currentPlayingMusicDetails.trackObject.id == parseInt(this.props.currentPlayingMusicDetails.trackObject.id)) ?
          this.props : this.props.navigation.state.params
      )

      if (!this.props.navigation.state.params.fromSearch) {
        this.props.setIsRepeatMusicEnable(false)

        var NewMusicDataSet = []
        for (let i = this.props.trackData.media.findIndex(x => x.id === currentPlayingMusicDetails.trackObject.id); i < this.props.trackData.media.length; i++) {
          NewMusicDataSet.push(this.props.trackData.media[i])
        }

        await TrackPlayer.reset()

        await addTrackInAudioPlayer(NewMusicDataSet)

        if (musicSeeked) {

          const currentMusicValue = {
            trackCurrentPlyingTime: this.state.trackSeekedValue,
            trackSeekedValue: this.state.trackSeekedValue,
            trackObject: currentPlayingMusicDetails.trackObject,
            totalTrackLength: currentPlayingMusicDetails.totalTrackLength,
          }

          this.props.setCurrentPlayingDetails(currentMusicValue)
        } else {
          TrackPlayer.play();
        }

        await addTrackInAudioPlayerWithSpecificId(this.props.trackData.media, currentPlayingMusicDetails.trackObject.id)

      } else {

        const { trackObject } = this.props.navigation.state.params.currentPlayingMusicDetails
        const trackDataObject = {
          id: trackObject.id,
          url: trackObject.url.replace(Constant.URL_MEDIA_ENDPOINT, ""),
          title: trackObject.title,
          artist: trackObject.artist,
          thumbnail: trackObject.artwork.replace(Constant.URL_MEDIA_IMAGE_ENDPOINT, ""),
        }

        await TrackPlayer.reset()
        await addTrackInAudioPlayer([trackDataObject])

        if (musicSeeked) {
          const currentMusicValue = {
            trackCurrentPlyingTime: this.state.trackSeekedValue,
            trackSeekedValue: this.state.trackSeekedValue,
            trackObject: currentPlayingMusicDetails.trackObject,
            totalTrackLength: currentPlayingMusicDetails.totalTrackLength,
          }

          this.props.setCurrentPlayingDetails(currentMusicValue)
        } else {
          TrackPlayer.play();
        }

      }

    } else {
      if (musicSeeked) {
        TrackPlayer.seekTo(this.state.trackSeekedValue);

        const currentMusicValue = {
          trackCurrentPlyingTime: this.state.trackSeekedValue,
          trackSeekedValue: this.state.trackSeekedValue,
          trackObject: this.props.currentPlayingMusicDetails.trackObject,
          totalTrackLength: this.props.currentPlayingMusicDetails.totalTrackLength,
        }

        this.props.setCurrentPlayingDetails(currentMusicValue)
        musicSeeked = false
      }
      await TrackPlayer.play();
    }

  }

  /**
  * manage music pause button press event 
  * @memberof NowPlayingScreen
  */
  _onPause = () => {
    TrackPlayer.pause();
    clearInterval(this.TexChangeInterval)
    this.props.pauseMusicFromApp(false)
  }

  /**
   * set image rotation on play music 
   * @memberof NowPlayingScreen
   */
  StartImageRotateFunction = () => {
    if (!isPlayingLocal || !this.props.isPlaying) {
      return
    }

    clearInterval(this.getMusicDetailsInterval)

    this.getMusicDetailsInterval = setInterval(() => {
      this.getCurrentMusicData()
    }, 1000);


    if (this.RotateValueHolder._value > 0.95) {
      this.RotateValueHolder.setValue(0)
    }

    Animated.timing(
      this.RotateValueHolder,
      {
        toValue: 1,
        duration: 5000 * (1 - this.RotateValueHolder._value),
        easing: Easing.linear,
        useNativeDriver: true
      }
    ).start(() => {
      this.StartImageRotateFunction()
    })

  }

  /**
   * manage music progress bar change
   * @memberof NowPlayingScreen
   */
  _onSliderValueChange = (values) => {
    musicSeeked = true
    var newValues = values[0];
    this.setState({
      trackCurrentPlyingTime: newValues,
      trackSeekedValue: newValues
    });
  }

  /**
   * seek track on finish sliding Slider
   * @memberof NowPlayingScreen
   */
  _onSliderValueChangeFinish = async () => {

    var isPLaying = musicChanged ? true :
      (Object.keys(this.props.currentPlayingMusicDetails).length > 0 &&
        (this.props.navigation.state.params.currentPlayingMusicDetails.trackObject.id == parseInt(this.props.currentPlayingMusicDetails.trackObject.id)) &&
        parseInt(this.props.currentPlayingMusicDetails.trackCurrentPlyingTime) > 1)

    if (isPLaying) {

      TrackPlayer.seekTo(this.state.trackSeekedValue);

      const currentMusicValue = {
        trackCurrentPlyingTime: this.state.trackSeekedValue,
        trackSeekedValue: this.state.trackSeekedValue,
        trackObject: this.props.currentPlayingMusicDetails.trackObject,
        totalTrackLength: this.props.currentPlayingMusicDetails.totalTrackLength,
      }

      this.props.setCurrentPlayingDetails(currentMusicValue)
      musicSeeked = false
    }

  }

  /**
   * render slider marker view
   * @memberof NowPlayingScreen
   */
  _SliderMarkerView = () => {
    return (
      <View style={styles.thumbCircleView} />
    )
  }

  /**
   * manage previous music button press event
   * @memberof NowPlayingScreen
   */
  _onPressPrevious = async () => {

    let currentBufferPosition = await TrackPlayer.getBufferedPosition()

    var isPLaying = musicChanged ? (currentBufferPosition === 0 ? false : true) :
      (Object.keys(this.props.currentPlayingMusicDetails).length > 0 &&
        (this.props.navigation.state.params.currentPlayingMusicDetails.trackObject.id == parseInt(this.props.currentPlayingMusicDetails.trackObject.id)) &&
        parseInt(this.props.currentPlayingMusicDetails.trackCurrentPlyingTime) > 1)

    if (!isPLaying) {
      return
    }

    this.props.setIsRepeatMusicEnable(false)
    this.props.setMusicButtonLoader(true)

    // if shuffle is on then shuffle music on previous click otherwise previous song
    if (this.props.isShufflePlayON) {
      TrackPlayer.skipToNext()
    } else {
      TrackPlayer.skipToPrevious()
    }
  }

  /**
   * manage next music button press event
   * @memberof NowPlayingScreen
   */
  _onPressNext = async () => {

    let currentBufferPosition = await TrackPlayer.getBufferedPosition()

    var isPLaying = musicChanged ? (currentBufferPosition === 0 ? false : true) :
      (Object.keys(this.props.currentPlayingMusicDetails).length > 0 &&
        (this.props.navigation.state.params.currentPlayingMusicDetails.trackObject.id == parseInt(this.props.currentPlayingMusicDetails.trackObject.id)) &&
        parseInt(this.props.currentPlayingMusicDetails.trackCurrentPlyingTime) > 1)

    if (!isPLaying) {
      return
    }

    this.props.setMusicButtonLoader(true)
    this.props.setIsRepeatMusicEnable(false)
    TrackPlayer.skipToNext()
  }

  /**
   * repeat music button press 
   * @memberof NowPlayingScreen
   */
  _onPressRepeat = () => {
    this.props.setMusicShuffleState(false)
    this.props.setMusicSRepeatState(!this.props.repeatType)
    this.props.setIsRepeatMusicEnable(true)
  }

  /**
   * shuffle music button press
   * @memberof NowPlayingScreen
   */
  _onPressShuffle = () => {
    this.props.setMusicSRepeatState(false)
    this.props.setMusicSRepeatState(false)

    if (this.props.isShufflePlayON) {
      this.props.setResetTrackData(true)
    }
    this.props.setMusicShuffleState(!this.props.isShufflePlayON)
  }

  render() {
    const RotateData = this.RotateValueHolder.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })

    var isPLaying = musicChanged ? true :
      (Object.keys(this.props.currentPlayingMusicDetails).length > 0 &&
        (this.props.navigation.state.params.currentPlayingMusicDetails.trackObject.id == parseInt(this.props.currentPlayingMusicDetails.trackObject.id)) &&
        parseInt(this.props.currentPlayingMusicDetails.trackCurrentPlyingTime) > 1)

    const { currentPlayingMusicDetails } = musicChanged ? this.props : (
      Object.keys(this.props.currentPlayingMusicDetails).length > 0 && (this.props.navigation.state.params.currentPlayingMusicDetails.trackObject.id == parseInt(this.props.currentPlayingMusicDetails.trackObject.id)) ?
        this.props : this.props.navigation.state.params
    )

    const playPauseIcon = musicChanged ? (isPlayingLocal && this.props.isPlaying) : this.props.isPlaying && Object.keys(this.props.currentPlayingMusicDetails).length > 0 && (this.props.navigation.state.params.currentPlayingMusicDetails.trackObject.id == parseInt(this.props.currentPlayingMusicDetails.trackObject.id))

    return (
      <ImageBackground source={require("../assets/images/ic_app_bac.png")} style={styles.container}>

        <TabBarHeader
          headerTitle={"Now Playing"}
          isBackVisible={true}
          onPressBack={() => {
            this.props.navigation.pop()
          }} />

        <View style={{ flex: 1 }}>

          <View style={styles.diskSectionRootView}>

            <Animated.View style={[styles.diskView, { transform: [{ rotate: RotateData }] }]}>

              <FastImage
                style={styles.diskImage}
                source={require("../assets/images/ic_disk.png")}
                resizeMode={FastImage.resizeMode.cover}
              />

              <View style={[styles.absoluteFullView]}>
                <FastImage
                  style={styles.trackImageView}
                  source={currentPlayingMusicDetails.trackObject ? (currentPlayingMusicDetails.trackObject.artwork.includes("/null") ? require("../assets/images/ic_music_image_not_found.png") : { uri: currentPlayingMusicDetails.trackObject.artwork }) : { uri: "" }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </View>

              <View style={styles.absoluteFullView}>
                <View style={styles.centerWhiteView} />
              </View>

            </Animated.View>

            <View style={{ alignItems: 'center' }}>
              <Text style={styles.categoriesSubTitle} >{`Now Playing`}</Text>
              <Text numberOfLines={2} ellipsizeMode={"tail"} style={styles.musicNameText}>{currentPlayingMusicDetails.trackObject ? currentPlayingMusicDetails.trackObject.title : ""}</Text>
              <Text style={styles.categoriesSubTitle}>{currentPlayingMusicDetails.trackObject ? currentPlayingMusicDetails.trackObject.artist : ""}</Text>
            </View>

          </View>

          <View style={styles.controlSectionRootView}>

            <View style={styles.repeatButtonRootView} >

              <TouchableOpacity
                onPress={() => this._onPressRepeat()}
                style={[styles.repeatButtonView, { marginLeft: fontSizer(-8) }]} >
                <IconIonic name="md-repeat" size={fontSizer(17)} color={this.props.repeatType ? Constant.COLOR_GOLD : Constant.COLOR_WHITE} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this._onPressShuffle()}
                style={[styles.repeatButtonView, { marginRight: fontSizer(-8) }]} >
                <Icon name="shuffle" size={fontSizer(17)} color={this.props.isShufflePlayON ? Constant.COLOR_GOLD : Constant.COLOR_WHITE} />
              </TouchableOpacity>

            </View>

            <MultiSlider
              selectedStyle={{ backgroundColor: Constant.COLOR_GOLD }}
              unselectedStyle={{ backgroundColor: Constant.COLOR_DIVIDER }}
              min={0}
              max={currentPlayingMusicDetails.totalTrackLength == 0 ? 1 : currentPlayingMusicDetails.totalTrackLength}
              values={[!isPLaying ? this.state.trackSeekedValue : parseInt(currentPlayingMusicDetails.trackCurrentPlyingTime)]}
              containerStyle={{ height: fontSizer(20) }}
              trackStyle={{ height: fontSizer(4) }}
              touchDimensions={styles.thumbTouchDimension}
              onValuesChange={(value) => this._onSliderValueChange(value)}
              onValuesChangeFinish={() => this._onSliderValueChangeFinish()}
              sliderLength={Constant.SCREEN_WIDTH * 0.75}
              customMarker={() => this._SliderMarkerView()}
            />

            <View style={styles.repeatButtonRootView} >
              <Text style={styles.timeDisplayView}>{changeSecondToAppHour(currentPlayingMusicDetails.trackCurrentPlyingTime)}</Text>
              <Text style={styles.timeDisplayView}>{changeSecondToAppHour(currentPlayingMusicDetails.totalTrackLength)}</Text>
            </View>


            <View style={styles.playButtonRootView} >

              <TouchableOpacity
                disabled={this.props.showLoaderOnPlayButton}
                onPress={() => {
                  setTimeout(() => {
                    this._onPressPrevious()
                  }, 300);
                }}
                style={{ padding: 10 }}  >
                <Icon name="controller-jump-to-start" size={fontSizer(27)} color={Constant.COLOR_WHITE} />
              </TouchableOpacity>

              <TouchableOpacity
                disabled={this.props.showLoaderOnPlayButton}
                onPress={() => {
                  setTimeout(() => {
                    if (playPauseIcon) {
                      this._onPause()
                    } else {
                      this._onPlay()
                    }
                  }, 300);
                }}
                style={styles.playButtonView} >


                {this.props.showLoaderOnPlayButton ?
                  <ActivityIndicator size={"small"} color={Constant.COLOR_BLACK} />
                  :
                  <View>
                    {playPauseIcon ?
                      <Icon name="controller-paus" style={{ marginTop: fontSizer(2), marginLeft: fontSizer(1) }} size={fontSizer(23)} color={Constant.COLOR_BACK_BLACK} />
                      :
                      <Icon name="controller-play" style={{ marginTop: fontSizer(2), marginLeft: fontSizer(4) }} size={fontSizer(26)} color={Constant.COLOR_BACK_BLACK} />
                    }
                  </View>

                }
              </TouchableOpacity>

              <TouchableOpacity
                disabled={this.props.showLoaderOnPlayButton}
                onPress={() => {
                  setTimeout(() => {
                    this._onPressNext()
                  }, 300)
                }}
                style={{ padding: 10 }}  >
                <Icon name="controller-next" size={fontSizer(27)} color={Constant.COLOR_WHITE} />
              </TouchableOpacity>


            </View>

          </View>

        </View>

      </ImageBackground>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    isPlaying: store.MusicState.isPlaying,
    currentPlayingMusicDetails: store.MusicState.currentPlayingMusicDetails,
    trackData: store.MusicState.trackData,
    isShufflePlayON: store.MusicState.isShufflePlayON,
    repeatType: store.MusicState.repeatType,
    showLoaderOnPlayButton: store.MusicState.showLoaderOnPlayButton,
    currentOpenScreen: store.UserAuth.currentOpenScreen,
  }
}

const mapDispatchToProps = {
  setCurrentPlayingDetails,
  setUserCurrentOpenedScreen,
  setMusicShuffleState,
  setMusicSRepeatState,
  setResetTrackData,
  setIsRepeatMusicEnable,
  setMusicButtonLoader,
  pauseMusicFromApp
}

export default connect(mapStateToProps, mapDispatchToProps)(NowPlayingScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constant.COLOR_WHITE
  },
  musicNameText: {
    color: Constant.COLOR_MAIN,
    fontSize: fontSizer(25),
    letterSpacing: 1.5,
    marginVertical: fontSizer(8),
    fontFamily: Constant.FONT_CORKI_REGULAR
  },
  categoriesSubTitle: {
    color: Constant.COLOR_WHITE,
    fontSize: fontSizer(16),
    marginTop: fontSizer(2),
    fontFamily: Constant.FONT_BACK_GOTHIC_MEDIUM
  },

  // disk section 
  diskSectionRootView: {
    flex: 0.6,
    alignItems: "center",
    justifyContent: 'space-around',
  },
  diskView: {
    width: widthSizer(Constant.SCREEN_WIDTH * 0.4),
    height: widthSizer(Constant.SCREEN_WIDTH * 0.4),
  },
  diskImage: {
    width: '100%',
    height: '100%'
  },
  absoluteFullView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  trackImageView: {
    width: widthSizer(Constant.SCREEN_WIDTH * 0.18),
    height: widthSizer(Constant.SCREEN_WIDTH * 0.18),
    borderRadius: widthSizer(Constant.SCREEN_WIDTH * 0.9),
  },
  centerWhiteView: {
    width: widthSizer(Constant.SCREEN_WIDTH * 0.05),
    height: widthSizer(Constant.SCREEN_WIDTH * 0.05),
    borderRadius: widthSizer(Constant.SCREEN_WIDTH * 0.025),
    backgroundColor: Constant.COLOR_BACK_BLACK
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
    color: Constant.COLOR_WHITE,
    fontSize: fontSizer(13),
    marginTop: fontSizer(2),
    fontFamily: Constant.FONT_BACK_GOTHIC_MEDIUM
  },
  repeatButtonRootView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: '1%'
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
    backgroundColor: Constant.COLOR_GOLD,
    width: fontSizer(50),
    height: fontSizer(50),
    borderRadius: fontSizer(25),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Constant.COLOR_GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 4,
  },
  playIconImageView: {
    width: fontSizer(20),
    height: fontSizer(20),
    marginLeft: 4
  },
  pauseIconImageView: {
    width: fontSizer(14),
    height: fontSizer(14)
  },

  // sliderView 
  thumbCircleView: {
    width: fontSizer(14),
    height: fontSizer(14),
    backgroundColor: Constant.COLOR_WHITE,
    borderColor: Constant.COLOR_DIVIDER,
    borderWidth: fontSizer(3),
    borderRadius: 10,
    marginTop: fontSizer(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 4,
  },
  thumbTouchDimension: {
    height: 30,
    width: 30,
    borderRadius: 20,
  },
});