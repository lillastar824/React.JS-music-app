import {
    ACTION_SET_PLAYER_STATE,
    ACTION_SET_MUSIC_CATEGORY,
    ACTION_SET_ALBUM_CATEGORY,
    ACTION_SET_TRACK_DATA,
    ACTION_SET_CURRENT_PLAYING_DETAILS,
    ACTION_SET_VIDEO_ALBUM_CATEGORY,
    ACTION_SET_VIDEO_TRACK_DATA,
    ACTION_SET_CURRENT_VIDEO_PLAYING_DETAILS,
    ACTION_SET_VIDEO_PLAYER_STATE,
    ACTION_SET_SHUFFLE_PLAY,
    ACTION_SET_REPEAT_PLAY,
    ACTION_RESET_TRACK_DATA,
    ACTION_IS_REPEAT_ENABLE,
    ACTION_RESET_MUSIC_STATE,
    ACTION_IS_SHOW_LOADER_ON_BUTTON,
    ACTION_PAUSE_MUSIC_FROM_APP
} from "../action/ActionName"

const initialState = {
    isPlaying: false,
    isVideoPlaying: false,
    currentPlayingMusicDetails: {},
    currentPlayingVideoDetails: {},
    musicCategoryList: [],
    MusicCategoryAllData: [],
    musicAlbumList: [],
    trackData: {},
    videoAlbumList: [],
    videoTrackData: {},
    willPlayVideo: false,
    isShufflePlayON: false,
    repeatType: false,
    resetTrackData: false,
    isRepeatApplicable: false,
    showLoaderOnPlayButton: false,
    isPauseMusicFromApp: false
};

export default MusicState = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_SET_PLAYER_STATE: {
            return { ...state, isPlaying: action.state };
        }
        case ACTION_SET_VIDEO_PLAYER_STATE: {
            return { ...state, isVideoPlaying: action.state };
        }
        case ACTION_SET_MUSIC_CATEGORY: {
            var categoryNameList = [];
            for (var itemData of action.musicCategory) {
                categoryNameList.push(itemData.category)
            }
            return { ...state, musicCategoryList: [categoryNameList], MusicCategoryAllData: action.musicCategory };
        }
        case ACTION_SET_ALBUM_CATEGORY: {
            return { ...state, musicAlbumList: action.albumCategory };
        }
        case ACTION_SET_VIDEO_ALBUM_CATEGORY: {
            return { ...state, videoAlbumList: action.albumCategory };
        }
        case ACTION_SET_CURRENT_PLAYING_DETAILS: {
            return { ...state, currentPlayingMusicDetails: action.currentPlayingMusicDetails };
        }
        case ACTION_SET_TRACK_DATA: {
            const newTrackData = action.loadNew ? action.trackData :
                state.trackData.media.concat(action.trackData.media)

            return { ...state, trackData: Object.assign({}, newTrackData) };
        }
        case ACTION_SET_VIDEO_TRACK_DATA: {
            const newTrackData = action.loadNew ? action.trackData :
                state.videoTrackData.media.concat(action.videoTrackData.media)

            return { ...state, videoTrackData: Object.assign({}, newTrackData) };
        }
        case ACTION_SET_CURRENT_VIDEO_PLAYING_DETAILS: {
            return { ...state, currentPlayingVideoDetails: action.currentPlayingVideoDetails, willPlayVideo: action.willPlayVideo };
        }
        case ACTION_SET_SHUFFLE_PLAY: {
            return { ...state, isShufflePlayON: action.state };
        }
        case ACTION_SET_REPEAT_PLAY: {
            return { ...state, repeatType: action.state };
        }
        case ACTION_RESET_TRACK_DATA: {
            return { ...state, resetTrackData: action.state };
        }
        case ACTION_IS_REPEAT_ENABLE: {
            return { ...state, isRepeatApplicable: action.state };
        }
        case ACTION_IS_SHOW_LOADER_ON_BUTTON: {
            return { ...state, showLoaderOnPlayButton: action.state };
        }
        case ACTION_PAUSE_MUSIC_FROM_APP: {
            return { ...state, isPauseMusicFromApp: action.state };
        }
        case ACTION_RESET_MUSIC_STATE: {
            return { ...initialState };
        }
        default: {
            return state;
        }
    }
};
