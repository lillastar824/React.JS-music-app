import { Platform } from 'react-native'
import TrackPlayer from 'react-native-track-player';
import Constant from '../constant/Constant';

import Store from '../store/Store';
import { setPlayerState } from "../action/ActionMusic"

module.exports = async function () {

  TrackPlayer.addEventListener('remote-play', () => {
    TrackPlayer.play()
  })

  TrackPlayer.addEventListener('remote-pause', () => {
    TrackPlayer.pause()
  });

  TrackPlayer.addEventListener('remote-next', () => {
    TrackPlayer.skipToNext()
  });

  TrackPlayer.addEventListener('remote-previous', () => {
    TrackPlayer.skipToPrevious()
  });

  TrackPlayer.addEventListener('remote-stop', () => {
    TrackPlayer.destroy()
  });

  TrackPlayer.addEventListener('playback-state', (state) => {
    const isPlaying = state.state == TrackPlayer.STATE_PLAYING || state.state == 3
    Store.dispatch(setPlayerState(isPlaying))
  });

};