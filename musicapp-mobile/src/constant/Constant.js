import { Dimensions } from 'react-native';

const base_url = "http://3.17.146.24/api"

export default Constant = {

    //Header 
    HEADER: 'Basic YXBpQHlvcG1haWwuY29tOmFwaUAxMjM=',

    // social page ids
    FACEBOOK_PAGE_ID: "force1combat",
    FACEBOOK_PROFILE_ID: "219918175126396",
    TWITTER_PAGE_ID: "Force1Combat",
    INSTAGRAM_PAGE_ID: "theoutlawstar",
    SOUNDCLOUD_PAGE_ID: "force1combat",

    // twitter keys
    TWITTER_CONSUMER_KEY: "m8xHMA6lvMKvyzXzsyNf1bUk0",
    TWITTER_CONSUMER_SECRET: "mjMQGD8ecAHUCQAstNwbcTY727MZJ0bfc67D6OMNjmrUWSp9Z3",

    // instagram keys
    INSTAGRAM_CLIENT_ID: '92e8c10e091a445d9d02eeb0006a21b2',
    INSTAGRAM_CLIENT_SECRET: '13a123f1d5e34da4b17b8ce205ff8a64',
    INSTAGRAM_REDIRECT_URL: 'http://localhost',

    // app color 
    COLOR_MAIN: "#f5d165",
    COLOR_GRAY: "#5C5C5C",
    COLOR_TEXT_GRAY: "#9F9F9F",
    COLOR_DIVIDER: "#E5E5E5",
    COLOR_TEXT_BLACK: "#4A4A4A",
    COLOR_WHITE: "#FFFFFF",
    COLOR_BLACK: "#000000",

    COLOR_BACK_BLACK: "#171717",
    COLOR_TRANSPARENT: "transparent",
    COLOR_GOLD: "#f5d165",

    // fonts 
    FONT_SFP_LIGHT: "SFProDisplay-Light",
    FONT_SFP_REGULAR: "SFProDisplay-Regular",
    FONT_SFP_MEDIUM: "SFProDisplay-Medium",
    FONT_SFP_Bold: "SFProDisplay-Bold",
    FONT_TAKEN_VULTURES_DEMO: "TakenbyVulturesDemo",
    FONT_CORKI_REGULAR: "Corki-Regular",
    FONT_BACK_GOTHIC_MEDIUM: "BankGothicBT-Medium",

    // screen width 
    SCREEN_WIDTH: Dimensions.get('window').width,
    SCREEN_HEIGHT: Dimensions.get('window').height,

    //static urls
    USER_PROFILE_PIC_URL: "https://s3.us-east-2.amazonaws.com/musics-app/profile/",
    URL_MEDIA_ENDPOINT: "http://d3frw9fdeazuwm.cloudfront.net/medias/",
    URL_MEDIA_IMAGE_ENDPOINT: "https://s3.us-east-2.amazonaws.com/musics-app/medias/",
    URL_ALBUM_ENDPOINT: "https://s3.us-east-2.amazonaws.com/musics-app/albums/",

    URL_PRIVACY_POLICY: "http://3.17.146.24/help",
    URL_HELP: "http://3.17.146.24/help",
    URL_TERMS_CONDITION: "http://3.17.146.24/help",

    // static global reference
    showToast: "",
    ToastDuration: 1500,
    showLoader: "",
    showCustomAlert: "",
    toastDuration: 2000,

    ALERT_TITLE: "Exclusive Clientele",

    // Api List
    API_SOCIAL_SIGNUP: base_url + "/SignUpSocial",
    API_SIGNUP: base_url + "/SignUp",
    API_RESEND_VERIFICATION_CODE: base_url + "/ResendVerifyCode",
    API_CHANGE_EMAIL_MOBILE: base_url + "/ChangeEmailContactNo",
    API_VERIFY_USER: base_url + "/VerifyRegisteredUser",
    API_LOGIN: base_url + "/Login",
    API_CATEGORY: base_url + "/Category",
    API_ALBUM_LIST: base_url + "/Albums",
    API_TRACK_LIST: base_url + "/AlbumsDetails",
    API_SEARCH_MUSIC: base_url + "/Search",
    API_CHANGE_PASSWORD: base_url + "/changePassword",
    API_FORGOT_PASSWORD: base_url + "/ForgotPassword",
    API_UPCOMING_VIDEOS: base_url + "/UpComing",
    API_UPDATE_USER_PROFILE: base_url + "/UpdateUserProfile",
    API_SEND_VERIFICATION_CODE: base_url + "/SendVerifyCode",
    API_WEB_CONTENT: base_url + "/Pages",

}