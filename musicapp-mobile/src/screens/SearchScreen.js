import React from 'react';
import { View, StyleSheet, ImageBackground, FlatList, TouchableOpacity, Text, TextInput, Keyboard } from 'react-native';

import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image'
import Orientation from 'react-native-orientation';
import IconEvil from 'react-native-vector-icons/EvilIcons'

import {
  widthSizer,
  fontSizer,
  getStatusBarHeight,
  manageApiResponseCode,
  GoogleAnalyticsTrackScreen
} from "../utils/MethodUtils"

import {
  setCurrentPlayingVideoDetails
} from "../action/ActionMusic"

import Constant from "../constant/Constant"
import TabBarHeader from "../component/TabBarHeader"
import TrackListItem from "../component/TrackListItem"
import NoDataFoundView from "../component/NoDataFoundView"

var navigationRef, thisRef;

class SearchScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      searchedMusicData: [],
      searchText: "",
      isNoSearchFoundDisplay: false
    }
  }

  componentDidMount() {
    GoogleAnalyticsTrackScreen.SearchScreen()
    this._focusEvent()
    Orientation.lockToPortrait();
    navigationRef = this.props.navigation
    thisRef = this
  }

  _focusEvent = () => {
    const didBlurSubscription = this.props.navigation.addListener(
      'willFocus',
      payload => {
        setTimeout(() => {
          this.searchInputRef.focus()
        }, 300);
      }
    );

    const didBlurSubscription_root = this.props.screenProps.rootNavigation.addListener(
      'willFocus',
      payload => {
        setTimeout(() => {
          this.searchInputRef.focus()
        }, 300);
      }
    );
  }

  static manageChildStack = () => {
    navigationRef.popToTop();
  }

  static navigateToPlayScreen = () => {
    navigationRef.navigate("NowPlaying", { currentPlayingMusicDetails: thisRef.props.currentPlayingMusicDetails, fromSearch: false });
  }

  getSearchedMusicListApi = () => {

    if (this.state.searchText.trim() === "") {
      return
    }

    var formData = new FormData()
    formData.append("token", this.props.userData.token)
    formData.append("search", this.state.searchText)

    Constant.showLoader.showLoader()

    fetch(Constant.API_SEARCH_MUSIC, {
      method: 'POST',
      headers: {
        'Authorization': Constant.HEADER,
      },
      body: formData
    }).then(r => r.json())
      .then((data) => {
        this.setState({ isNoSearchFoundDisplay: true })
        Constant.showLoader.hideLoader()

        if (data.status_code === 200) {

          this.setState({ searchedMusicData: data.data })

        } else {
          manageApiResponseCode(data, this.props.screenProps.rootNavigation.navigate)
        }

      }).catch(exception => {
        console.log("exception ---> " + JSON.stringify(exception));
        Constant.showLoader.hideLoader()
      });
  }

  _onMusicItemRowPress = async (item, index) => {

    if (item.type == 1) {

      var musicData = musicData = {
        id: item.id,
        url: Constant.URL_MEDIA_ENDPOINT + item.url,
        title: item.title,
        artist: item.artist,
        artwork: Constant.URL_MEDIA_IMAGE_ENDPOINT + item.thumbnail,
      }

      var currentMusicValue = {
        trackCurrentPlyingTime: 0,
        trackSeekedValue: 0,
        totalTrackLength: item.duration,
        trackObject: musicData,
      }

      this.props.navigation.navigate("NowPlaying", { currentPlayingMusicDetails: currentMusicValue, fromSearch: true })

    } else {
      this.props.setCurrentPlayingVideoDetails(item, false)
      this.props.navigation.navigate("NowPlayingVideo")
    }

  }

  renderTrackList = ({ item, index }) => {
    return (
      <TrackListItem
        item={item}
        index={index}
        isPlayIconVisible={false}
        onItemClick={this._onMusicItemRowPress}
      />
    )
  }

  render() {
    return (
      <ImageBackground source={require("../assets/images/ic_app_bac.png")} style={styles.container}>


        <FastImage source={require("../assets/images/ic_bac_image.png")} style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0
        }} />

        <View style={styles.searchRootView}>

          <View style={styles.searchBottomView} >

            <View style={styles.searchTextEnterView}>

              <IconEvil name="search" size={fontSizer(23)} color={Constant.COLOR_GOLD} style={{ padding: 5 }} />

              <TextInput
                ref={searchInputRef => this.searchInputRef = searchInputRef}
                placeholder={"Search here..."}
                value={this.state.searchText}
                placeholderTextColor={Constant.COLOR_TEXT_GRAY}
                autoCapitalize={"none"}
                autoCorrect={false}
                returnKeyType={"search"}
                onSubmitEditing={() => this.getSearchedMusicListApi()}
                style={styles.textInputView}
                onChangeText={searchText => this.setState({ searchText })}
              />

            </View>

            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss()
                this.setState({
                  searchText: "",
                  isNoSearchFoundDisplay: false,
                  searchedMusicData: []
                })
              }}
              style={styles.cancelView} >
              <Text style={styles.cancelText}>{`Cancel`}</Text>
            </TouchableOpacity>

          </View>

        </View>

        <View style={{ flex: 1 }} >

          {this.state.searchedMusicData.length > 0 ?

            <FlatList
              style={{ marginTop: fontSizer(10) }}
              showsVerticalScrollIndicator={false}
              data={this.state.searchedMusicData}
              renderItem={this.renderMusicListView}
              renderItem={this.renderTrackList}
            />
            :
            <NoDataFoundView
              view={this.state.isNoSearchFoundDisplay}
              icon={require("../assets/images/no_music_list_found.png")}
              textLabel={`No result found for ${this.state.searchText}`}
            />
          }

        </View>

      </ImageBackground>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    userData: store.UserAuth.userData,
    currentPlayingMusicDetails: store.MusicState.currentPlayingMusicDetails
  }
}

const mapDispatchToProps = {
  setCurrentPlayingVideoDetails
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.07)"
  },
  centerIcon: {
    width: Constant.SCREEN_WIDTH,
    height: fontSizer(70)
  },


  // music List view
  musicListRootView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: fontSizer(12)
  },
  musicListIcon: {
    width: fontSizer(40),
    height: fontSizer(40),
    borderRadius: fontSizer(20),
    marginHorizontal: fontSizer(15)
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
    color: Constant.COLOR_TEXT_BLACK,
    fontSize: fontSizer(16),
    maxWidth: Constant.SCREEN_WIDTH - fontSizer(130),
    fontFamily: Constant.FONT_SFP_LIGHT
  },
  categoriesSubTitle: {
    color: Constant.COLOR_TEXT_BLACK,
    fontSize: fontSizer(13),
    marginTop: fontSizer(2),
    fontFamily: Constant.FONT_SFP_LIGHT
  },
  musicListDividerView: {
    marginHorizontal: fontSizer(15),
    flex: 1,
    height: 1,
    backgroundColor: Constant.COLOR_DIVIDER
  },

  // search view
  searchRootView: {
    backgroundColor: Constant.COLOR_BACK_BLACK,
    paddingTop: getStatusBarHeight()
  },
  searchBottomView: {
    width: "100%",
    padding: fontSizer(12),
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchTextEnterView: {
    width: Constant.SCREEN_WIDTH - fontSizer(100),
    backgroundColor: Constant.COLOR_GRAY,
    borderRadius: 50,
    flexDirection: 'row'
  },
  magnifierIconView: {
    width: fontSizer(17),
    height: fontSizer(17),
    marginVertical: fontSizer(10),
    marginLeft: fontSizer(15),
    marginRight: fontSizer(10),
  },
  textInputView: {
    fontSize: fontSizer(16),
    padding: 0,
    color: Constant.COLOR_WHITE,
    width: widthSizer(Constant.SCREEN_WIDTH - 150),
    fontFamily: Constant.FONT_BACK_GOTHIC_MEDIUM,
    letterSpacing: 2
  },
  cancelView: {
    width: fontSizer(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: fontSizer(18),
    color: Constant.COLOR_MAIN,
    letterSpacing: 2,
    fontFamily: Constant.FONT_CORKI_REGULAR
  },
});
