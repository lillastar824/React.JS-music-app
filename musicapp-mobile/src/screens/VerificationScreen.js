import React from "react";
import {
    StyleSheet, Image, Text, View, ImageBackground, Platform,
} from "react-native";

import Dialog, { SlideAnimation } from 'react-native-popup-dialog';
import { NavigationActions, StackActions } from 'react-navigation'
import PhoneInput from "react-native-phone-input";
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/Entypo'

import {
    isTablet,
    emailValidation,
    passwordValidation,
    widthSizer,
    manageApiResponseCode,
    Storage,
    getStatusBarHeight,
    fontSizer
} from "../utils/MethodUtils";

import {
    setUserLoginDetails
} from "../action/ActionUserAuth"

import Constant from '../constant/Constant'
import RoundCornerTextinput from '../component/RoundCornerTextinput'
import RoundCornerButton from '../component/RoundCornerButton'
import BottomBorderTextInput from "../component/BottomBorderTextInput"
import TextGradient from "../component/TextGradient"
import BottomBorderButton from "../component/BottomBorderButton"

class VerificationScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: "",
            changeEmailDialogVisible: false,
            verificationCode: "",
            isEmailVerification: false,
            phoneNo: '',
            loader: false,
            newEmail: "",
            newPhoneNumber: "",
        };
    }

    componentWillMount() {

        const { params } = this.props.navigation.state

        if (params.fromEditProfile) {

            console.log(params.sendableData);

            var userEmailVerificationStatus = false
            if (params.sendableData.isChangeEmail && params.sendableData.emailVerificationStatus == 0) {
                userEmailVerificationStatus = true
            } else if (params.sendableData.isChangeContact && params.sendableData.contactVerificationStatus == 0) {
                userEmailVerificationStatus = false
            }

            this.setState({
                isEmailVerification: userEmailVerificationStatus,
                email: params.sendableData.email,
                phoneNo: params.sendableData.contactNumber,
            }, () => this._sendNewVerificationCodeAPI())

        } else {
            var userEmailVerificationStatus = false
            if (this.props.userData.user.email !== null && this.props.userData.user.is_email_verify == 0) {
                userEmailVerificationStatus = true
            } else if (this.props.userData.user.contact_no !== null && this.props.userData.user.is_mobile_verify == 0) {
                userEmailVerificationStatus = false
            }

            this.setState({
                isEmailVerification: userEmailVerificationStatus,
                email: this.props.userData.user.email,
                phoneNo: this.props.userData.user.contact_no,
            })
        }

    }

    _sendNewVerificationCodeAPI = () => {
        this.showLoader();

        var formData = new FormData();
        formData.append('token', this.props.userData.token);
        formData.append('email', this.state.email);
        formData.append('contact_no', this.state.phoneNo);
        formData.append('type', this.state.isEmailVerification ? "1" : "2");

        fetch(Constant.API_SEND_VERIFICATION_CODE, {
            method: 'POST',
            headers: {
                "Authorization": Constant.HEADER,
            },
            body: formData
        }).then(r => r.json())
            .then(data => {
                this.hideLoader()

                if (data.status_code === 200) {
                    Constant.showToast.show(data.message, Constant.ToastDuration);
                } else {
                    manageApiResponseCode(data, this.props.navigation)
                }

            }).catch((err) => {
                console.log(err);
                this.hideLoader()
            });
    }

    _codeVerifyAPI = () => {

        if (this.state.verificationCode == "") {
            Constant.showToast.show("enter code !", Constant.ToastDuration);
            return
        }

        this.showLoader();

        var formData = new FormData();
        formData.append('token', this.props.userData.token);
        formData.append('verify_code', this.state.verificationCode);
        formData.append('type', this.state.isEmailVerification ? "1" : "2");

        fetch(Constant.API_VERIFY_USER, {
            method: 'POST',
            headers: {
                "Authorization": Constant.HEADER,
            },
            body: formData
        }).then(r => r.json())
            .then(data => {
                this.hideLoader()

                if (data.status_code === 200) {

                    const { params } = this.props.navigation.state

                    if (params.fromEditProfile) {

                        if (this.state.isEmailVerification) {
                            params.sendableData.isChangeEmail = true
                            params.sendableData.emailVerificationStatus = 1
                        } else {
                            params.sendableData.isChangeContact = true
                            params.sendableData.contactVerificationStatus = 1
                        }

                        const sendableData = {
                            isChangeEmail: params.sendableData.isChangeEmail,
                            isChangeContact: params.sendableData.isChangeContact,
                            email: params.sendableData.email,
                            contactNumber: params.sendableData.contactNumber,
                            updateVerificationStatus: params.sendableData.updateVerificationStatus,
                            emailVerificationStatus: params.sendableData.emailVerificationStatus,
                            contactVerificationStatus: params.sendableData.contactVerificationStatus,
                        }

                        if (params.sendableData.emailVerificationStatus == 0 || params.sendableData.contactVerificationStatus == 0) {
                            this.props.navigation.replace('Verification', { fromEditProfile: true, sendableData })
                        } else {
                            params.sendableData.updateVerificationStatus(sendableData)
                            this.props.navigation.pop()
                        }


                    } else {
                        this._navigateToDashBoard()
                    }
                } else {
                    manageApiResponseCode(data, this.props.navigation)
                }

            }).catch((err) => {
                console.log(err);
                this.hideLoader()
            });
    }

    _navigateToDashBoard = () => {

        var userData = this.props.userData
        if (this.state.isEmailVerification) {
            userData.user.is_email_verify = 1
        } else {
            userData.user.is_mobile_verify = 1
        }

        this.props.setUserLoginDetails(userData)

        Storage.setItem("user_data", userData)

        if ((this.props.userData.user.email !== null && this.props.userData.user.is_email_verify == 0) ||
            (this.props.userData.user.contact_no !== null && this.props.userData.user.is_mobile_verify == 0)) {

            this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Verification', params: { fromEditProfile: false } })],
            }))

        } else {
            this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
            }))
        }

    }

    chagneEmailORMobile = () => {

        this.showLoader();

        var formData = new FormData();
        formData.append('token', this.props.userData.token);
        formData.append('type', this.state.isEmailVerification ? "1" : "2");
        formData.append('password', this.state.password);

        if (this.state.isEmailVerification) {
            formData.append('email', this.state.newEmail);
        } else {
            formData.append('contact_no', this.phone.getValue());
        }

        fetch(Constant.API_CHANGE_EMAIL_MOBILE, {
            method: 'POST',
            headers: {
                "Authorization": Constant.HEADER,
            },
            body: formData
        }).then(r => r.json())
            .then(data => {
                this.hideLoader()

                if (data.status_code === 200) {
                    Constant.showToast.show(data.message, Constant.ToastDuration);

                    var userData = this.props.userData
                    if (this.state.isEmailVerification) {
                        userData.user.email = this.state.newEmail
                    } else {
                        userData.user.contact_no = this.state.newPhoneNumber
                    }

                    this.props.setUserLoginDetails(userData)

                    Storage.setItem("user_data", userData)

                } else {
                    manageApiResponseCode(data, this.props.navigation)
                }

            }).catch((err) => {
                console.log(err);
                this.hideLoader()
            });

    }

    _resendVerificationCodeAPI = () => {
        this.showLoader();

        var formData = new FormData();
        formData.append('token', this.props.userData.token);
        formData.append('type', this.state.isEmailVerification ? "1" : "2");

        fetch(Constant.API_RESEND_VERIFICATION_CODE, {
            method: 'POST',
            headers: {
                "Authorization": Constant.HEADER,
            },
            body: formData
        }).then(r => r.json())
            .then(data => {
                this.hideLoader()

                if (data.status_code === 200) {
                    Constant.showToast.show(data.message, Constant.ToastDuration);
                } else {
                    manageApiResponseCode(data, this.props.navigation)
                }

            }).catch((err) => {
                console.log(err);
                this.hideLoader()
            });
    }

    showLoader = () => {
        Constant.showLoader.showLoader()
    }

    hideLoader = () => {
        Constant.showLoader.hideLoader()
    }

    render() {
        return (
            <View style={styles.container}>

                <ImageBackground source={require('../assets/images/ic_app_bac.png')}
                    style={{ width: '100%', height: '100%', flex: 1 }}>

                    <FastImage source={require("../assets/images/ic_bac_image.png")} style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        right: 0,
                        left: 0
                    }} />

                    <View style={{ flex: 0.65, width: '100%', alignItems: 'center', paddingHorizontal: 20 }} >

                        <Image style={styles.logoView} resizeMode="contain"
                            source={require('../assets/images/ic_header_app_logo_new.png')}
                        />

                        <Text style={styles.textEmailVerify}>
                            {this.state.isEmailVerification ?
                                `Your email is not yet verified.` :
                                `Your Phone number is not yet verified.`}</Text>

                        <Text style={styles.textInformationVerify}>
                            {this.state.isEmailVerification ?
                                `We have sent verification code on ${this.state.email}. please complete email verification and try again.` :
                                `We have sent verification code on ${this.state.phoneNo}. please complete phone number verification and try again.`
                            }
                        </Text>


                        <BottomBorderTextInput
                            value={this.state.verificationCode}
                            placeholderValue={"Enter Code"}
                            centerText={true}
                            width={0.5}
                            style={{ marginTop: Constant.SCREEN_HEIGHT * 0.04 }}
                            onValueChange={(verificationCode) => {
                                this.setState({ verificationCode })
                            }}
                        />

                        <BottomBorderButton
                            text={"VERIFY"}
                            width={0.5}
                            style={{ marginVertical: Constant.SCREEN_HEIGHT * 0.02 }}
                            fontSize={22}
                            onPressButton={() => {
                                this._codeVerifyAPI()
                            }}
                        />

                    </View>

                    {!this.props.navigation.state.params.fromEditProfile &&

                        <View style={{ flex: 0.35, width: '100%', alignItems: 'center' }} >

                            <Text style={styles.textWrongEmail}>
                                {this.state.isEmailVerification ? `Entered wrong email?` : `Entered wrong phone number?`}
                            </Text>

                            <BottomBorderButton
                                text={this.state.isEmailVerification ? "Change your email" : "Change your phone number"}
                                width={0.8}
                                style={{ marginVertical: Constant.SCREEN_HEIGHT * 0.01 }}
                                fontSize={22}
                                onPressButton={() => {
                                    this.setState({
                                        changeEmailDialogVisible: true,
                                        password: "",
                                        newEmail: "",
                                        newPhoneNumber: ''
                                    })
                                }}
                            />

                            <View style={{ height: '10%' }} />

                            <Text style={styles.textWrongEmail}>Haven't received verification code?</Text>

                            <BottomBorderButton
                                text={"Resend verification code"}
                                width={0.8}
                                style={{ marginVertical: Constant.SCREEN_HEIGHT * 0.01 }}
                                fontSize={22}
                                onPressButton={() => {
                                    this._resendVerificationCodeAPI()
                                }}
                            />

                        </View>
                    }

                </ImageBackground>

                <Dialog
                    visible={this.state.changeEmailDialogVisible}
                    dialogAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                    })}
                    dialogStyle={{ backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}
                    width={isTablet() ? "60%" : "80%"}
                    height={"65%"}
                    onTouchOutside={() => {
                        this.setState({ changeEmailDialogVisible: false });
                    }} >

                    <ImageBackground source={require("../assets/images/ic_app_bac.png")} style={styles.dialogView}>

                        <Icon
                            style={{
                                marginTop: 25,
                                marginBottom: 15
                            }}
                            name={this.state.isEmailVerification ? "mail" : "mobile"}
                            size={fontSizer(50)}
                            color={Constant.COLOR_GOLD} />


                        <Text style={styles.dialogTextView}>{
                            this.state.isEmailVerification ?
                                `Change your email address` :
                                `Change your phone number`
                        }</Text>

                        <View style={{ paddingHorizontal: 30 }}>

                            <Text style={styles.enterNewValueText}>
                                {this.state.isEmailVerification ? `Enter your new email address` : `Enter your new phone number`}
                            </Text>

                            {this.state.isEmailVerification ?
                                <BottomBorderTextInput
                                    value={this.state.newEmail}
                                    placeholderValue={"New email"}
                                    width={0.6}
                                    style={{ marginTop: Constant.SCREEN_HEIGHT * 0.01 }}
                                    onValueChange={(newEmail) => {
                                        this.setState({ newEmail })
                                    }}
                                />
                                :

                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: Constant.SCREEN_HEIGHT * 0.01,
                                    width: Constant.SCREEN_WIDTH * (isTablet() ? 0.67 : 1) - 154
                                }}>

                                    <View style={styles.bottomBorderView} >
                                        <Image
                                            resizeMode={"contain"}
                                            style={{ width: '100%', height: '100%' }}
                                            source={require('../assets/images/button_bottom_gold_border.png')} />
                                    </View>

                                    <PhoneInput
                                        style={{
                                            width: Constant.SCREEN_WIDTH * (isTablet() ? 0.67 : 1) - 162,
                                            marginLeft: fontSizer(4),
                                            borderRadius: fontSizer(4),
                                            backgroundColor: "rgba(23,23,23,.6)",
                                            padding: fontSizer(11),
                                            marginBottom: fontSizer(4)
                                        }}
                                        value={this.state.email}
                                        textStyle={{
                                            color: Constant.COLOR_GOLD,
                                            fontSize: fontSizer(19),
                                            height: fontSizer(20),
                                            letterSpacing: 1.5,
                                            fontFamily: Constant.FONT_CORKI_REGULAR
                                        }}
                                        flagStyle={{
                                            width: fontSizer(27),
                                            height: fontSizer(18),
                                        }}
                                        ref={ref => this.phone = ref}
                                    />

                                </View>

                            }


                            <Text style={[styles.enterNewValueText, { marginTop: Constant.SCREEN_HEIGHT * 0.015 }]}>Enter your password</Text>

                            <BottomBorderTextInput
                                value={this.state.password}
                                placeholderValue={"Your password"}
                                width={0.6}
                                securityText={true}
                                style={{ marginTop: Constant.SCREEN_HEIGHT * 0.01 }}
                                onValueChange={(password) => {
                                    this.setState({ password })
                                }}
                            />

                        </View>

                        <BottomBorderButton
                            text={"UPDATE"}
                            width={0.6}
                            style={{ marginVertical: Constant.SCREEN_HEIGHT * 0.025 }}
                            fontSize={22}
                            onPressButton={() => {
                                if (this.state.isEmailVerification) {
                                    if (!emailValidation(this.state.newEmail)) {
                                        return
                                    }
                                } else {
                                    if (!this.phone.isValidNumber()) {
                                        Constant.showToast.show("Enter valid contact number.", Constant.ToastDuration);
                                        return
                                    }
                                }

                                this.setState({ changeEmailDialogVisible: false }, () => this.chagneEmailORMobile())
                            }}
                        />

                        <View style={{ marginBottom: 30 }}></View>
                    </ImageBackground>
                </Dialog>

            </View >
        );
    }
}

const mapStateToProps = (store) => {
    return {
        userData: store.UserAuth.userData
    }
}

const mapDispatchToProps = {
    setUserLoginDetails
}

export default connect(mapStateToProps, mapDispatchToProps)(VerificationScreen);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#ffffff"
    },
    logoView: {
        marginTop: getStatusBarHeight(),
        height: fontSizer(100),
        width: fontSizer(100),
        justifyContent: "center",
        alignItems: "center",
    },
    textEmailVerify: {
        marginTop: 10,
        fontSize: fontSizer(18),
        letterSpacing: 1.1,
        color: Constant.COLOR_GOLD,
        fontFamily: Constant.FONT_CORKI_REGULAR,
        textAlign: "center"
    },
    textInformationVerify: {
        marginTop: 13,
        fontSize: fontSizer(19),
        letterSpacing: 1.05,
        color: Constant.COLOR_GOLD,
        fontFamily: Constant.FONT_CORKI_REGULAR,
        textAlign: "center"
    },
    enterCodeView: {
        marginTop: 20,
        width: "60%",
    },
    textWrongEmail: {
        fontSize: fontSizer(20),
        color: Constant.COLOR_GOLD,
        fontFamily: Constant.FONT_CORKI_REGULAR,
        textAlign: "center",
    },
    dialogView: {
        alignSelf: 'center',
        width: '100%',
        backgroundColor: Constant.COLOR_BACK_BLACK,
        borderColor: Constant.COLOR_GOLD,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        marginTop: 2,
        alignItems: "center",
        borderRadius: 8
    },
    dialogLogoView: {
        height: "17%",
        width: "17%",
        alignItems: "center",
        marginTop: 35,
        marginBottom: 15
    },
    dialogTextView: {
        marginBottom: 15,
        fontSize: fontSizer(20),
        letterSpacing: 1.1,
        color: Constant.COLOR_GOLD,
        fontFamily: Constant.FONT_CORKI_REGULAR,
        textAlign: "center"
    },
    enterNewValueText: {
        fontSize: fontSizer(14),
        letterSpacing: 1.1,
        color: Constant.COLOR_GOLD,
        fontFamily: Constant.FONT_CORKI_REGULAR,
        marginLeft: 15
    },

    flagFont: {
        fontSize: fontSizer(15),
        color: Constant.COLOR_MAIN,
        fontFamily: Constant.FONT_SFP_MEDIUM
    },
    flagImageView: {
        width: fontSizer(27),
        height: fontSizer(18),
    },
    bottomBorderView: {
        position: 'absolute',
        bottom: fontSizer(-5),
        right: 0,
        left: 0,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        height: fontSizer(25),
    },
});