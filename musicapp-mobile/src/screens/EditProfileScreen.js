import React from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';

import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';
import { NavigationActions, StackActions } from 'react-navigation'
import FastImage from 'react-native-fast-image'
import PhoneInput from "react-native-phone-input";
import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/Entypo'
import IconEvil from 'react-native-vector-icons/EvilIcons'

import {
  widthSizer,
  fontSizer,
  Storage,
  emailValidation,
  manageApiResponseCode,
  GoogleAnalyticsTrackScreen,
  isTablet
} from "../utils/MethodUtils"

import Constant from "../constant/Constant"
import TabBarHeader from "../component/TabBarHeader"
import RoundCornerTextinput from "../component/RoundCornerTextinput"
import RoundCornerButton from "../component/RoundCornerButton"
import BottomBorderTextInput from "../component/BottomBorderTextInput"
import TextGradient from "../component/TextGradient"
import BottomBorderButton from "../component/BottomBorderButton"

import {
  setUserLoginDetails
} from "../action/ActionUserAuth"

class EditProfileScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      email: "",
      name: "",
      contactNumber: "",
      profileImageURl: "",
      isImageChanged: false,
    }
  }

  async componentDidMount() {
    Orientation.lockToPortrait();
    this.setState({
      email: this.props.userData.user.email,
      name: this.props.userData.user.real_name,
      contactNumber: this.props.userData.user.contact_no,
      profileImageURl: Constant.USER_PROFILE_PIC_URL + this.props.userData.user.profile_picture,
      isImageChanged: false
    })
  }


  _editProfileAPi = () => {

    var formData = new FormData()
    formData.append("token", this.props.userData.token)
    formData.append("name", this.state.name)

    const isChangeEmail = this.props.userData.user.email !== this.state.email
    const isChangeContact = (this.props.userData.user.contact_no != null ? this.props.userData.user.contact_no.replace("+", "") : this.phone.getCountryCode()) !== this.phone.getValue().replace("+", "")

    if (isChangeEmail) {
      formData.append("email", this.state.email)
    }

    if (isChangeContact) {
      formData.append("contact_no", this.phone.getValue())
    }

    if (this.state.isImageChanged) {
      formData.append("profile_pic", { uri: this.state.profileImageURl, name: `photo.jpg`, type: `image/jpg` })
    }


    Constant.showLoader.showLoader()

    fetch(Constant.API_UPDATE_USER_PROFILE, {
      method: 'POST',
      headers: {
        'Authorization': Constant.HEADER,
      },
      body: formData
    }).then(r => r.json())
      .then((data) => {

        Constant.showLoader.hideLoader()

        if (data.status_code === 200) {
          Constant.showToast.show(data.message, Constant.ToastDuration);

          const userNewData = {
            user: data.data[0],
            token: this.props.userData.token
          }

          this.props.setUserLoginDetails(userNewData)
          Storage.setItem("user_data", userNewData)

          this._navigateUser()
        } else {
          manageApiResponseCode(data, this.props.navigation)
        }

      }).catch(exception => {
        console.log("exception ---> " + JSON.stringify(exception));
        Constant.showLoader.hideLoader()
      });
  }


  _onPressEditProfile = () => {

    if (this.props.userData.user.email !== this.state.email) {
      if (this.state.email != "" && !emailValidation(this.state.email)) {
        return
      }
    }

    const getContactNumber = this.phone.getValue()
    const getContactCountryCode = this.phone.getCountryCode()

    if (getContactNumber.replace("+" + getContactCountryCode, "").length > 0 && !this.phone.isValidNumber()) {
      Constant.showToast.show("Enter valid contact number.", Constant.ToastDuration);
      return
    }

    if (this.state.email == "" && getContactNumber.replace("+" + getContactCountryCode, "").length == 0) {
      Constant.showToast.show("Enter valid details.", Constant.ToastDuration);
      return
    }

    const isChangeEmail = this.props.userData.user.email !== this.state.email
    const isChangeContact = (this.props.userData.user.contact_no != null ? this.props.userData.user.contact_no.replace("+", "") : this.phone.getCountryCode()) !== this.phone.getValue().replace("+", "")

    if (isChangeEmail || isChangeContact) {

      const sendableData = {
        isChangeEmail: isChangeEmail,
        isChangeContact: isChangeContact,
        email: this.state.email,
        contactNumber: this.phone.getValue(),
        updateVerificationStatus: this.updateVerificationStatus,
        emailVerificationStatus: isChangeEmail ? 0 : 1,
        contactVerificationStatus: isChangeContact ? 0 : 1,
      }

      this.props.navigation.navigate('Verification', { fromEditProfile: true, sendableData })

    } else {
      this._editProfileAPi()
    }
  }

  updateVerificationStatus = (userData) => {
    if ((userData.isChangeEmail == true && userData.emailVerificationStatus == 1) ||
      (userData.isChangeContact == true && userData.emailVerificationStatus == 1)) {
      this._editProfileAPi()
    } else {
      Constant.showToast.show("It seems like get some error in verification process.", Constant.ToastDuration);
    }
  }

  _navigateUser = () => {
    GoogleAnalyticsTrackScreen.ProfileChange()
    this.props.navigation.pop()
  }

  _onSelectActionOption = (index) => {
    switch (index) {
      case 0:
        ImagePicker.openCamera({
          width: 300,
          height: 300,
          cropping: true,
        }).then(image => {
          this.setState({ profileImageURl: image.path, isImageChanged: true })
        });
        break
      case 1:

        ImagePicker.openPicker({
          width: 300,
          height: 300,
          cropping: true
        }).then(image => {
          this.setState({ profileImageURl: image.path, isImageChanged: true })
        });
        break
    }

  }

  getUserProfileImageUrl = () => {
    if (this.state.isImageChanged) {
      return { uri: this.state.profileImageURl }
    } else {
      if (Object.keys(this.props.userData).length > 0 && this.props.userData.user.profile_picture !== "") {
        return { uri: Constant.USER_PROFILE_PIC_URL + this.props.userData.user.profile_picture }
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <TabBarHeader
          headerTitle={"Edit Profile"}
          isBackVisible={true}
          onPressBack={() => {
            this.props.navigation.pop()
          }} />

        <ImageBackground source={require("../assets/images/ic_app_bac.png")} style={{
          flex: 1,
          width: '100%',
          backgroundColor: Constant.COLOR_BACK_BLACK,
          alignItems: 'center',
        }} >

          <FastImage source={require("../assets/images/ic_bac_image.png")} style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0
          }} />

          <View style={styles.userProfileIcon}>

            {this.state.isImageChanged || Object.keys(this.props.userData).length > 0 && this.props.userData.user.profile_picture !== "" ?
              <FastImage
                style={[styles.userProfileIcon, { marginVertical: 0, borderColor: Constant.COLOR_GOLD, borderWidth: 2 }]}
                source={this.getUserProfileImageUrl()}
                resizeMode={FastImage.resizeMode.cover}
              />
              :
              <IconEvil name={"user"} size={fontSizer(130)}
                style={{
                  width: widthSizer(Constant.SCREEN_WIDTH * 0.35),
                  alignSelf: 'center',
                  height: widthSizer(Constant.SCREEN_WIDTH * 0.3),
                }}
                color={Constant.COLOR_GOLD} />
            }

            <TouchableOpacity
              onPress={() => this.ActionSheet.show()}
              style={styles.addImageButtonView}>

              <Icon name={"plus"}
                size={fontSizer(21)}
                color={Constant.COLOR_BACK_BLACK} />

            </TouchableOpacity>
          </View>

          <BottomBorderTextInput
            value={this.state.name}
            style={{ marginVertical: Constant.SCREEN_HEIGHT * 0.01 }}
            placeholderValue={"Enter your name"}
            width={0.8}
            onValueChange={(name) => {
              this.setState({ name })
            }}
          />

          <BottomBorderTextInput
            value={this.state.email}
            disabled={Object.keys(this.props.userData).length > 0 && this.props.userData.user.type <= 2}
            style={{ marginVertical: Constant.SCREEN_HEIGHT * 0.01 }}
            placeholderValue={"Enter your email"}
            width={0.8}
            onValueChange={(email) => {
              this.setState({ email })
            }}
          />

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: Constant.SCREEN_HEIGHT * 0.01
          }}>

            <View style={styles.bottomBorderView} >
              <Image
                resizeMode={"contain"}
                style={{ width: widthSizer(Constant.SCREEN_WIDTH * 0.8), height: '100%' }}
                source={require('../assets/images/button_bottom_gold_border.png')} />
            </View>

            <PhoneInput
              style={styles.phoneInputStyle}
              value={this.state.contactNumber}
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


          <BottomBorderButton
            text={"UPDATE"}
            width={0.8}
            fontSize={25}
            style={{
              marginVertical: Constant.SCREEN_HEIGHT * 0.03,
              position: 'absolute',
              bottom: 0,
            }}
            onPressButton={() => {
              this._onPressEditProfile()
            }}
          />

        </ImageBackground>

        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={'Which one do you like ?'}
          options={['Camera', 'Gallery', 'cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={(index) => this._onSelectActionOption(index)}
        />

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

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(0,0,0,.07)"
  },
  centerIcon: {
    width: Constant.SCREEN_WIDTH,
    height: fontSizer(70)
  },
  userProfileIcon: {
    width: widthSizer(Constant.SCREEN_WIDTH * 0.25),
    height: widthSizer(Constant.SCREEN_WIDTH * 0.25),
    borderRadius: widthSizer(Constant.SCREEN_WIDTH * 0.5),
    marginVertical: widthSizer(Constant.SCREEN_WIDTH * 0.07),
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
  addImageButtonView: {
    width: fontSizer(22),
    height: fontSizer(22),
    borderRadius: fontSizer(20),
    backgroundColor: Constant.COLOR_GOLD,
    position: 'absolute',
    paddingLeft: fontSizer(0.5),
    right: fontSizer(4),
    bottom: fontSizer(4),
  },
  phoneInputStyle: {
    width: widthSizer(Constant.SCREEN_WIDTH * 0.8) - fontSizer(8),
    marginLeft: fontSizer(4),
    borderRadius: fontSizer(4),
    backgroundColor: "rgba(23,23,23,.6)",
    padding: fontSizer(11),
    marginBottom: fontSizer(isTablet() ? 2 : 4)
  }

});
