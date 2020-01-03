import React from 'react';
import { View, StyleSheet, Text, FlatList, ScrollView, TouchableOpacity, Animated, ImageBackground } from 'react-native';

import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image'
import Swiper from 'react-native-swiper';

import {
  widthSizer,
  fontSizer,
  isTablet,
  manageApiResponseCode,
  GoogleAnalyticsTrackScreen
} from "../../utils/MethodUtils"

import {
  setMusicCategory,
  setVideoAlbumCategory,
  setVideoTrackData,
  setCurrentPlayingVideoDetails
} from "../../action/ActionMusic"

import Constant from "../../constant/Constant"
import DropdownMenu from '../../component/DropdownMenu';
import TrackListItem from '../../component/TrackListItem';
import NoDataFoundView from "../../component/NoDataFoundView"

class VideoScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: 0,
      currentListTopIndex: 0,
      isNoDataFoundDisplay: false,
      isNoAlbumFoundDisplay: false,
      isNoTrackFoundDisplay: false,
      currentCategoryTitle: "",
      paddingAnimation: new Animated.Value(0),
      changeSwiperValue: false
    }
  }

  componentDidMount() {
    GoogleAnalyticsTrackScreen.VideoDashboardScreen()
    this.getCategoryNameApi()
  }

  getCategoryNameApi = () => {

    var formData = new FormData()
    formData.append("token", this.props.userData.token)

    Constant.showLoader.showLoader()

    fetch(Constant.API_CATEGORY, {
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
            this.props.setMusicCategory(data.data)
            this.getAlbumListApi(data.data[0].id)
            this.setState({ currentCategoryTitle: data.data[0].category })
          }

        } else {
          manageApiResponseCode(data, this.props.screenProps.mainNavigation)
        }

      }).catch(exception => {
        console.log("exception ---> " + JSON.stringify(exception));
        Constant.showLoader.hideLoader()
      });
  }

  getAlbumListApi = (id) => {

    var formData = new FormData()
    formData.append("token", this.props.userData.token)
    formData.append("category_id", id)
    formData.append("type", "2")

    Constant.showLoader.showLoader()

    fetch(Constant.API_ALBUM_LIST, {
      method: 'POST',
      headers: {
        'Authorization': Constant.HEADER,
      },
      body: formData
    }).then(r => r.json())
      .then((data) => {
        this.setState({ isNoAlbumFoundDisplay: true })
        Constant.showLoader.hideLoader()

        if (data.status_code === 200) {

          this.props.setVideoAlbumCategory(data.data)
          this.getTrackListApi(data.data[0].id, true)

        } else {
          manageApiResponseCode(data, this.props.screenProps.mainNavigation)
        }

      }).catch(exception => {
        console.log("exception ---> " + JSON.stringify(exception));
        Constant.showLoader.hideLoader()
      });
  }

  getTrackListApi = (id, loadNew) => {
    this.setState({ changeSwiperValue: false })

    var formData = new FormData()
    formData.append("token", this.props.userData.token)
    formData.append("album_id", id)
    formData.append("type", "2")

    Constant.showLoader.showLoader()

    fetch(Constant.API_TRACK_LIST, {
      method: 'POST',
      headers: {
        'Authorization': Constant.HEADER,
      },
      body: formData
    }).then(r => r.json())
      .then((data) => {
        this.setState({ isNoTrackFoundDisplay: true, changeSwiperValue: true })
        Constant.showLoader.hideLoader()

        if (data.status_code === 200) {

          this.props.setVideoTrackData(data.data, loadNew)
          this._arrowViewAnimation()

        } else {
          manageApiResponseCode(data, this.props.screenProps.mainNavigation)
        }

      }).catch(exception => {
        console.log("exception ---> " + JSON.stringify(exception));
        Constant.showLoader.hideLoader()
      });
  }


  onPressMainCategory = (item, index) => {
    this.setState({ selectedIndex: index }, () => this.getTrackListApi(item.id, true))
  }

  _arrowViewAnimation = () => {
    const marginValue = (fontSizer(100) * (this.state.selectedIndex - this.state.currentListTopIndex)) + fontSizer(40)
    Animated.timing(this.state.paddingAnimation, { toValue: marginValue, duration: 400 }).start();
  }


  renderCategoryView = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => this.onPressMainCategory(item, index)}
        style={{ marginLeft: fontSizer(index == 0 ? 17 : 7), marginRight: fontSizer(7), width: fontSizer(85) }} >
        <FastImage
          style={styles.categoryImageView}
          source={item.cover_image != null ? { uri: Constant.URL_ALBUM_ENDPOINT + item.cover_image } : require("../../assets/images/ic_no_category_found.png")}
          resizeMode={FastImage.resizeMode.cover}
        />

        <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.categoryTitle}>{item.album_name}</Text>
        <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.categoriesSubTitle}>{item.artist}</Text>

      </TouchableOpacity>
    )
  }

  renderTrackList = ({ item, index }) => {
    return (
      <TrackListItem
        item={item}
        index={index}
        isPlaying={false}
        isPaused={false}
        isPlayIconVisible={true}
        onItemClick={(item, index) => {
          this.props.setCurrentPlayingVideoDetails(item, false)
          this.props.screenProps.rootNavigation.navigate("NowPlayingVideo")
        }}
        onPlayPauseClick={(item, isPlaying, index) => {
          this.props.setCurrentPlayingVideoDetails(item, true)
          this.props.screenProps.rootNavigation.navigate("NowPlayingVideo")
        }}
      />
    )
  }

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    this.setState({ currentListTopIndex: viewableItems[0].index }, () => {
      clearTimeout(this.flatListIndexChange)
      this.flatListIndexChange = setTimeout(() => {
        this.CategoryList.scrollToIndex({ animated: true, index: this.state.currentListTopIndex });
      }, 1000);
    })

  }

  renderMainView = () => {
    return (

      <View style={{ flex: 1 }} >

        {this.props.videoAlbumList.length > 0 ?

          <ScrollView style={styles.scrollView}>

            <View style={styles.categoryRootView} >

              <Text style={styles.categoryName} >{'TRENDING VIDEO'}</Text>

              <View style={styles.dividerView} />

              <FlatList
                ref={CategoryList => this.CategoryList = CategoryList}
                horizontal={true}
                style={{ marginTop: fontSizer(10), marginBottom: fontSizer(7) }}
                showsHorizontalScrollIndicator={false}
                data={this.props.videoAlbumList}
                renderItem={this.renderCategoryView}
                onViewableItemsChanged={this.onViewableItemsChanged}
              />

            </View>

            <View style={{ width: Constant.SCREEN_WIDTH, height: fontSizer(15) }} >
              <Animated.View style={[styles.arrowView, { marginLeft: this.state.paddingAnimation }]} />
            </View>

            {Object.keys(this.props.videoTrackData).length > 0 && this.props.videoTrackData.media.length > 0 ?

              <View style={styles.categoryMainView} >

                {this.props.videoTrackData.images.length > 0 &&

                  <View style={styles.swiperRootView}>

                    {this.state.changeSwiperValue &&

                      <Swiper
                        dot={(<View style={styles.disabledDotView} />)}
                        loop={false}
                        index={0}
                        activeDot={(<View style={styles.activeDotView} />)}
                        paginationStyle={{ bottom: fontSizer(-25), position: 'absolute', }}
                        showsButtons={false}>

                        {this.props.videoTrackData.images.map((item, index) => {
                          return (
                            <View style={{ alignItems: 'center' }}>
                              <FastImage
                                resizeMode={FastImage.resizeMode.cover}
                                style={{
                                  height: "100%",
                                  width: Constant.SCREEN_WIDTH - fontSizer(isTablet() ? Constant.SCREEN_WIDTH * 0.2 : 20) - 12,
                                  borderRadius: fontSizer(6),
                                  marginHorizontal: fontSizer(10)
                                }}
                                source={{ uri: Constant.URL_ALBUM_ENDPOINT + item.thumbnail }}
                              />

                              <View style={styles.swiperDataView}>
                                <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.albumTitle}>{item.album_name}</Text>
                                <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.albumDesc}>{item.artist}</Text>
                              </View>
                            </View>
                          )
                        })
                        }

                      </Swiper>
                    }

                  </View>
                }

                {this.props.videoTrackData.media.length > 0 &&
                  <FlatList
                    style={{ marginTop: fontSizer(25) }}
                    showsVerticalScrollIndicator={false}
                    data={this.props.videoTrackData.media}
                    renderItem={this.renderTrackList}
                  />
                }

              </View>
              :
              <View style={styles.categoryMainView}>
                <NoDataFoundView
                  view={this.state.isNoTrackFoundDisplay}
                  icon={require("../../assets/images/no_video_list_found.png")}
                  textLabel={`No video found.`}
                  style={{ width: Constant.SCREEN_WIDTH, height: Constant.SCREEN_HEIGHT * 0.5 }}
                />
              </View>
            }

          </ScrollView>
          :
          <NoDataFoundView
            view={this.state.isNoAlbumFoundDisplay}
            icon={require("../../assets/images/no_video_list_found.png")}
            textLabel={`No video category found for ${this.state.currentCategoryTitle}.`}
          />
        }

      </View>
    )
  }

  render() {

    return (
      <ImageBackground source={require("../../assets/images/ic_app_bac.png")} style={styles.container}>

        <FastImage source={require("../../assets/images/ic_bac_image.png")} style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0
        }} />

        <View style={{ flex: 1, backgroundColor: "transparent" }} >

          {this.props.musicCategoryList.length > 0 && this.props.musicCategoryList[0].length > 0 ?
            <DropdownMenu
              style={{ marginTop: 10, zIndex: 20, }}
              bgColor={"transparent"}
              tintColor={Constant.COLOR_WHITE}
              activityTintColor={Constant.COLOR_WHITE}
              optionTextStyle={{ fontSize: fontSizer(15), fontFamily: Constant.FONT_BACK_GOTHIC_MEDIUM }}
              titleStyle={{ fontSize: fontSizer(20), fontFamily: Constant.FONT_BACK_GOTHIC_MEDIUM }}
              maxHeight={Constant.SCREEN_HEIGHT * 0.3}
              handler={(selection, row) => {
                this.setState({ currentCategoryTitle: this.props.MusicCategoryAllData[row].category })
                this.setState({ selectedIndex: 0 })
                this.getAlbumListApi(this.props.MusicCategoryAllData[row].id)
              }}
              data={this.props.musicCategoryList}
            >
              {this.renderMainView()}
            </DropdownMenu>
            :
            <NoDataFoundView
              view={this.state.isNoDataFoundDisplay}
              icon={require("../../assets/images/no_music_list_found.png")}
              textLabel={"No category found."}
            />
          }

        </View>

      </ImageBackground >
    );
  }
}

const mapStateToProps = (store) => {
  return {
    userData: store.UserAuth.userData,
    musicCategoryList: store.MusicState.musicCategoryList,
    videoAlbumList: store.MusicState.videoAlbumList,
    videoTrackData: store.MusicState.videoTrackData,
    MusicCategoryAllData: store.MusicState.MusicCategoryAllData
  }
}

const mapDispatchToProps = {
  setMusicCategory,
  setVideoAlbumCategory,
  setVideoTrackData,
  setCurrentPlayingVideoDetails
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constant.COLOR_WHITE
  },
  categoriesView: {
    marginTop: fontSizer(10),
    backgroundColor: Constant.COLOR_WHITE,
    width: '100%',
  },


  // category section
  categoryName: {
    fontSize: fontSizer(22),
    marginLeft: '4%',
    color: Constant.COLOR_TEXT_BLACK,
    letterSpacing: 1.3,
    fontFamily: Constant.FONT_CORKI_REGULAR
  },
  categoryDescText: {
    marginTop: '1%',
    marginLeft: '4%',
    fontSize: fontSizer(13),
    color: Constant.COLOR_TEXT_BLACK,
    fontFamily: Constant.FONT_SFP_LIGHT
  },
  dividerView: {
    width: Constant.SCREEN_WIDTH - 42,
    backgroundColor: Constant.COLOR_TEXT_BLACK,
    marginTop: fontSizer(5),
    alignSelf: 'center',
    height: 1
  },

  // category list
  categoryRootView: {
    width: Constant.SCREEN_WIDTH - fontSizer(10),
    backgroundColor: "rgba(23, 23, 23, .7)",
    marginTop: fontSizer(7),
    paddingVertical: fontSizer(10),
    marginHorizontal: fontSizer(5),
    borderWidth: 1,
    borderColor: Constant.COLOR_GOLD,
    borderRadius: 5
  },
  categoryImageView: {
    width: fontSizer(85),
    height: fontSizer(85),
    borderRadius: fontSizer(6)
  },
  categoryTitle: {
    color: Constant.COLOR_WHITE,
    fontSize: fontSizer(16),
    marginTop: fontSizer(7),
    letterSpacing: 1.2,
    fontFamily: Constant.FONT_CORKI_REGULAR
  },
  categoriesSubTitle: {
    color: Constant.COLOR_TEXT_BLACK,
    fontSize: fontSizer(14),
    marginTop: fontSizer(2),
    letterSpacing: -0.5,
    fontFamily: Constant.FONT_BACK_GOTHIC_MEDIUM
  },

  // category List
  arrowView: {
    width: fontSizer(30),
    height: fontSizer(15),
    borderBottomColor: Constant.COLOR_GOLD,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftWidth: fontSizer(15),
    borderRightWidth: fontSizer(15),
    borderBottomWidth: fontSizer(15),
  },
  scrollView: {
    flex: 1,
    width: Constant.SCREEN_WIDTH
  },


  // swiper dot
  swiperRootView: {
    width: Constant.SCREEN_WIDTH - 12,
    height: fontSizer(Constant.SCREEN_HEIGHT * (isTablet() ? 0.15 : 0.23)),
    marginTop: fontSizer(12),
    backgroundColor: Constant.COLOR_TRANSPARENT
  },
  disabledDotView: {
    borderColor: Constant.COLOR_MAIN,
    borderWidth: 1,
    width: fontSizer(8),
    height: fontSizer(8),
    borderRadius: fontSizer(4),
    margin: fontSizer(3),
  },
  activeDotView: {
    backgroundColor: Constant.COLOR_MAIN,
    width: fontSizer(8),
    height: fontSizer(8),
    borderRadius: fontSizer(4),
    margin: fontSizer(3),
  },
  albumTitle: {
    color: Constant.COLOR_WHITE,
    fontSize: fontSizer(16),
    letterSpacing: 1.5,
    fontFamily: Constant.FONT_CORKI_REGULAR
  },
  albumDesc: {
    color: Constant.COLOR_WHITE,
    fontSize: fontSizer(14),
    marginTop: fontSizer(2),
    fontFamily: Constant.FONT_BACK_GOTHIC_MEDIUM
  },
  swiperDataView: {
    backgroundColor: 'rgba(0,0,0,.5)',
    position: 'absolute',
    left: fontSizer(isTablet() ? Constant.SCREEN_WIDTH * 0.1 : 10),
    bottom: 0,
    right: fontSizer(isTablet() ? Constant.SCREEN_WIDTH * 0.1 : 10),
    borderBottomLeftRadius: fontSizer(6),
    borderBottomRightRadius: fontSizer(6),
    padding: fontSizer(9)
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
  musicListDividerView: {
    marginHorizontal: fontSizer(15),
    flex: 1,
    height: 1,
    backgroundColor: Constant.COLOR_DIVIDER
  },
  categoryMainView: {
    backgroundColor: "rgba(23, 23, 23, .7)",
    marginHorizontal: fontSizer(5),
    marginBottom: fontSizer(5),
    borderWidth: 1,
    borderColor: Constant.COLOR_GOLD,
    borderRadius: 5
  }
});
