import { Dimensions, StatusBar, Platform, AsyncStorage, PixelRatio } from 'react-native';

import { NavigationActions, StackActions } from 'react-navigation'
import TrackPlayer from 'react-native-track-player';
import firebase from "react-native-firebase"

import Store from "../store/Store"
import Constant from "../constant/Constant"

import {
    setUserLoginDetails
} from "../action/ActionUserAuth"

import {
    resetMusicState
} from "../action/ActionMusic"


const Storage = {
    setItem: async (key, value) => {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    },
    getItem: async (key) => {
        const rawValue = await AsyncStorage.getItem(key)
        return JSON.parse(rawValue)
    },
    removeItem: async (key) => {
        await AsyncStorage.removeItem(key)
    }
}

const isIphoneX = () => {
    const dimen = Dimensions.get("window");
    return (
        Platform.OS === "ios" &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        (dimen.height === 812 ||
            dimen.width === 812 ||
            dimen.height === 896 ||
            dimen.width === 896)
    );
}

const hasDeviceNotch = () => {
    const dimen = Dimensions.get("window");

    return (
        Platform.OS === "ios" &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        (dimen.height === 812 ||
            dimen.width === 812 ||
            dimen.height === 896 ||
            dimen.width === 896)
    );
};

const getStatusBarHeight = () => {
    const dimen = Dimensions.get("window");
    if (Platform.OS === "ios") {
        if (
            !Platform.isPad &&
            !Platform.isTVOS &&
            (dimen.height === 812 ||
                dimen.width === 812 ||
                dimen.height === 896 ||
                dimen.width === 896)
        ) {
            return 44
        } else {
            return 22
        }
    } else {
        return StatusBar.currentHeight
    }
};

const widthSizer = (width) => {
    if (isTablet()) {
        return width * 0.8;
    } else if (Constant.SCREEN_WIDTH > 250) {
        return width;
    }
}

const fontSizer = (size) => {
    if (isTablet()) {
        return size * 1.6
    } else {
        return size;
    }
}

const isTablet = () => {
    let pixelDensity = PixelRatio.get();
    const adjustedWidth = Constant.SCREEN_WIDTH * pixelDensity;
    const adjustedHeight = Constant.SCREEN_HEIGHT * pixelDensity;
    if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
        return true;
    } else {
        return (
            pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)
        );
    }
};



const emailValidation = (email) => {
    var emailString = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.+[A-Za-z]{2,64}"

    if (!email.match(emailString)) {
        Constant.showToast.show("Enter valid Email", Constant.ToastDuration);
    }

    return email.match(emailString)
}

const passwordValidation = (password) => {

    if (password.length < 8) {
        Constant.showToast.show("Password strength should be minimum 8 characters.", Constant.ToastDuration);
        return false
    } else {
        return true
    }

    var passwordString = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})";

    if (!password.match(passwordString)) {
        const alertData = {
            title: "Password Strength",
            message: "Minimum of 8 characters with at least one of each: upper case, lower case, number and special character.",
            Buttons: [
                {
                    text: "OK",
                    color: Constant.COLOR_MAIN
                }
            ],
            getReturnData: {},
            onButtonPress: () => { }
        }

        Constant.showCustomAlert.showAlert(alertData)
    }

    return password.match(passwordString)
}

const manageApiResponseCode = (response, navigation) => {


    const alertData = {
        title: Constant.ALERT_TITLE,
        message: response.message,
        Buttons: [
            {
                text: "OK",
                color: Constant.COLOR_MAIN
            }
        ],
        getReturnData: {},
        onButtonPress: () => { }
    }

    Constant.showCustomAlert.showAlert(alertData)

    if (response.status_code === 401) {
        this.clearAppData(navigation)
    }

}


const logoutFromApp = (isViewDialog, navigation) => {

    if (isViewDialog) {

        const alertData = {
            title: "Log out",
            message: `Are you sure you want to logout.`,
            Buttons: [
                {
                    text: "Cancel",
                    color: "#a2a2a2"
                },
                {
                    text: "Logout",
                    color: Constant.COLOR_MAIN
                }
            ],
            getReturnData: {
                navigation: navigation
            },
            onButtonPress: this._onAlertButtonPress
        }

        Constant.showCustomAlert.showAlert(alertData)

    } else {
        this.clearAppData(navigation)
    }
}

_onAlertButtonPress = (data) => {
    switch (data.buttonIndex) {
        case 0:
            break;
        case 1:
            this.clearAppData(data.navigation)
            break;
        default:
            break;
    }
}

clearAppData = (navigation) => {

    TrackPlayer.reset();
    TrackPlayer.destroy();

    setTimeout(() => {
        Store.dispatch(resetMusicState())
        Store.dispatch(setUserLoginDetails({}))
        Storage.setItem("user_data", {})
    }, 1000);

    navigation.dispatch(StackActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: 'LoginSighup' })],
    }))

    return

    var formData = new FormData();
    formData.append('token', Constant.USER_DATA.token);
    formData.append('device_type', Platform.OS);
    formData.append('device_token', Constant.FCM_TOKEN);

    fetch(Constant.API_LOGOUT, {
        method: 'POST',
        headers: {
            "Authorization": Constant.HEADER,
        },
        body: formData
    }).then(r => r.json())
        .then(data => {
        })

    Constant.IS_LOGIN = "false"
    Constant.USER_DATA = {}
    AsyncStorage.setItem('user_data', JSON.stringify({}))
    AsyncStorage.setItem('is_login', 'false')

    try {
        navigation.dispatch(StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
        }))
    } catch (error) {
        alert(error)
    }
}


const prepareAudioPlayer = async () => {
    await TrackPlayer.setupPlayer().then(async () => {
    });
}

const addTrackInAudioPlayer = async (audioData) => {

    const musicList = []

    for (var musicData of audioData) {
        musicList.push({
            id: musicData.id,
            url: Constant.URL_MEDIA_ENDPOINT + musicData.url,
            title: musicData.title,
            artist: musicData.artist,
            artwork: Constant.URL_MEDIA_IMAGE_ENDPOINT + musicData.thumbnail,
        })
    }

    await TrackPlayer.add(musicList).then(function () {

    });
}

const addTrackInAudioPlayerWithSpecificId = async (audioData, id) => {

    const musicList = []

    var NewMusicDataSetUpComing = []

    var currentPLyingIdIndex = audioData.findIndex(x => x.id === id)

    for (let i = 0; i < parseInt(currentPLyingIdIndex); i++) {
        NewMusicDataSetUpComing.push(audioData[i])
    }

    for (var musicData of NewMusicDataSetUpComing) {
        musicList.push({
            id: musicData.id,
            url: Constant.URL_MEDIA_ENDPOINT + musicData.url,
            title: musicData.title,
            artist: musicData.artist,
            artwork: Constant.URL_MEDIA_IMAGE_ENDPOINT + musicData.thumbnail,
        })
    }

    await TrackPlayer.add(musicList, id.toString());

}

const checkUserEnterEmailOrMobile = (stringValue) => {
    return stringValue.includes("@") || isNaN(stringValue.replace("+", ""))
}

const changeSecondToAppHour = (seconds) => {
    var hrs = Math.floor(seconds / 3600);
    var mins = Math.floor(seconds % 3600 / 60);
    var secs = seconds % 3600 % 60;

    if (mins < 10) {
        mins = "0" + mins
    }

    if (hrs < 10) {
        hrs = "0" + hrs
    }

    if (secs < 10) {
        secs = "0" + secs
    }

    var AppropriateString = ""
    if (parseInt(hrs) > 0) {
        AppropriateString = hrs + ":"
    }

    if (parseInt(mins) > 0) {
        AppropriateString = AppropriateString + mins + ":"
    }

    AppropriateString = AppropriateString + secs

    if (parseInt(seconds) < 60) {
        return `00:${AppropriateString}`
    } else {
        return AppropriateString
    }

}

const GoogleAnalyticsTrackScreen = {
    SplashScreen: () => {
        firebase.analytics().logEvent("SplashScreen", { screenName: "SplashScreen" })
    },

    LoginScreen: () => {
        firebase.analytics().logEvent("LoginScreen", { screenName: "LoginScreen" })
    },

    LoginSuccess: () => {
        firebase.analytics().logEvent("LoginSuccess", { screenName: "LoginSuccess" })
    },

    SignupSuccess: () => {
        firebase.analytics().logEvent("SignupSuccess", { screenName: "SignupSuccess" })
    },

    SignupScreen: () => {
        firebase.analytics().logEvent("SignupScreen", { screenName: "SignupScreen" })
    },

    ForgotPasswordScreen: () => {
        firebase.analytics().logEvent("ForgotPasswordScreen", { screenName: "ForgotPasswordScreen" })
    },

    ChangePasswordScreen: () => {
        firebase.analytics().logEvent("ChangePasswordScreen", { screenName: "ChangePasswordScreen" })
    },

    MusicDashboardScreen: () => {
        firebase.analytics().logEvent("MusicDashboardScreen", { screenName: "MusicDashboardScreen" })
    },

    VideoDashboardScreen: () => {
        firebase.analytics().logEvent("VideoDashboardScreen", { screenName: "VideoDashboardScreen" })
    },

    MusicPlayerScreen: () => {
        firebase.analytics().logEvent("MusicPlayerScreen", { screenName: "MusicPlayerScreen" })
    },

    VideoPlayerScreen: () => {
        firebase.analytics().logEvent("MusicPlayerScreen", { screenName: "MusicPlayerScreen" })
    },

    PlayMusic: (trackName) => {
        firebase.analytics().logEvent("PlayMusic", { musicName: trackName })
    },

    PlayVideo: (trackName) => {
        firebase.analytics().logEvent("PlayVideo", { VideoName: trackName })
    },

    SearchScreen: () => {
        firebase.analytics().logEvent("SearchScreen", { screenName: "SearchScreen" })
    },

    ProfileChange: () => {
        firebase.analytics().logEvent("ProfileChange", { screenName: "ProfileChange" })
    },

    Logout: () => {
        firebase.analytics().logEvent("Logout", { screenName: "Logout" })
    },
}


export {
    Storage,
    hasDeviceNotch,
    getStatusBarHeight,
    widthSizer,
    fontSizer,
    isTablet,
    isIphoneX,
    emailValidation,
    passwordValidation,
    manageApiResponseCode,
    logoutFromApp,
    checkUserEnterEmailOrMobile,
    prepareAudioPlayer,
    addTrackInAudioPlayer,
    changeSecondToAppHour,
    addTrackInAudioPlayerWithSpecificId,
    GoogleAnalyticsTrackScreen
}