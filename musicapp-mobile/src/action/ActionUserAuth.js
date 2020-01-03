import {
    ACTION_SET_USER_DATA,
    ACTION_SET_CURRENT_OPEN_SCREEN
} from "./ActionName"

const setUserLoginDetails = (userData) => {
    return ({
        type: ACTION_SET_USER_DATA,
        userData: userData
    })
}

const setUserCurrentOpenedScreen = (type) => {
    return ({
        type: ACTION_SET_CURRENT_OPEN_SCREEN,
        screenType: type
    })
}

export {
    setUserLoginDetails,
    setUserCurrentOpenedScreen
}