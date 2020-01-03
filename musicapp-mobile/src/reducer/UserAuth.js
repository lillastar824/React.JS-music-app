import {
    ACTION_SET_USER_DATA,
    ACTION_SET_CURRENT_OPEN_SCREEN
} from "../action/ActionName"

const initialState = {
    userData: {},
    currentOpenScreen: 0,
};

export default UserAuth = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_SET_USER_DATA: {
            if (action.userData == null) {
                return { ...state }
            }
            return { ...state, userData: action.userData };
        }
        case ACTION_SET_CURRENT_OPEN_SCREEN: {
            return { ...state, currentOpenScreen: action.screenType };
        }
        default: {
            return state;
        }
    }
};
