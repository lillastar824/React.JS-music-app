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
} from "./ActionName"

const setPlayerState = (state) => {
    return ({
        type: ACTION_SET_PLAYER_STATE,
        state: state
    })
}

const setMusicCategory = (category) => {
    return ({
        type: ACTION_SET_MUSIC_CATEGORY,
        musicCategory: category
    })
}

const setAlbumCategory = (category) => {
    return ({
        type: ACTION_SET_ALBUM_CATEGORY,
        albumCategory: category
    })
}

const setTrackData = (trackData, loadNew) => {
    return ({
        type: ACTION_SET_TRACK_DATA,
        trackData: trackData,
        loadNew: loadNew
    })
}


const setVideoAlbumCategory = (category) => {
    return ({
        type: ACTION_SET_VIDEO_ALBUM_CATEGORY,
        albumCategory: category
    })
}

const setVideoTrackData = (trackData, loadNew) => {
    return ({
        type: ACTION_SET_VIDEO_TRACK_DATA,
        trackData: trackData,
        loadNew: loadNew
    })
}

const setCurrentPlayingDetails = (currentPlayingMusicDetails) => {
    return ({
        type: ACTION_SET_CURRENT_PLAYING_DETAILS,
        currentPlayingMusicDetails
    })
}

const setCurrentPlayingVideoDetails = (currentPlayingVideoDetails, willPlayVideo) => {
    return ({
        type: ACTION_SET_CURRENT_VIDEO_PLAYING_DETAILS,
        currentPlayingVideoDetails,
        willPlayVideo
    })
}

const setVideoPlayerState = (state) => {
    return ({
        type: ACTION_SET_VIDEO_PLAYER_STATE,
        state: state
    })
}

const setMusicShuffleState = (state) => {
    return ({
        type: ACTION_SET_SHUFFLE_PLAY,
        state: state
    })
}

const setMusicSRepeatState = (state) => {
    return ({
        type: ACTION_SET_REPEAT_PLAY,
        state: state
    })
}

const setResetTrackData = (state) => {
    return ({
        type: ACTION_RESET_TRACK_DATA,
        state: state
    })
}

const setIsRepeatMusicEnable = (state) => {
    return ({
        type: ACTION_IS_REPEAT_ENABLE,
        state: state
    })
}

const resetMusicState = () => {
    return ({
        type: ACTION_RESET_MUSIC_STATE
    })
}

const setMusicButtonLoader = (state) => {
    return ({
        type: ACTION_IS_SHOW_LOADER_ON_BUTTON,
        state: state
    })
}

const pauseMusicFromApp = (state) => {
    return ({
        type: ACTION_PAUSE_MUSIC_FROM_APP,
        state: state
    })
}

export {
    setPlayerState,
    setMusicCategory,
    setAlbumCategory,
    setTrackData,
    setCurrentPlayingDetails,
    setVideoAlbumCategory,
    setVideoTrackData,
    setCurrentPlayingVideoDetails,
    setVideoPlayerState,
    setMusicShuffleState,
    setMusicSRepeatState,
    setResetTrackData,
    setIsRepeatMusicEnable,
    resetMusicState,
    setMusicButtonLoader,
    pauseMusicFromApp
}