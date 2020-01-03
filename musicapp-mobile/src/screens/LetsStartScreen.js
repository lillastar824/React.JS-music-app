import React from 'react';
import { ImageBackground, StyleSheet, Image, Text, View } from 'react-native';

import Orientation from 'react-native-orientation';
import { connect } from 'react-redux';

import {
  widthSizer,
  fontSizer
} from "../utils/MethodUtils"

import Constant from "../constant/Constant"
import RoundCornerButton from "../component/RoundCornerButton"

class LetsStartScreen extends React.Component {

  componentDidMount() {
    Orientation.lockToPortrait();
  }

  render() {
    return (
      <ImageBackground source={require("../assets/images/ic_app_bac.png")} style={styles.container}>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

          <Image
            resizeMode={"contain"}
            style={styles.centerIcon}
            source={require('../assets/images/ic_header_app_logo_new.png')} />

          <Text style={styles.findTextView} >{`Find music & videos\nyou love.`}</Text>
          <Text style={styles.descText}>{`Being the savage's bows man, that is,\nthe person who pulled the bow-oar in\nhis boat n was my cheerful duty.\n`}</Text>

        </View>

        <RoundCornerButton
          hasImage={false}
          text={"Let's start"}
          onPress={() => {
            this.props.navigation.navigate("LoginSighup")
          }}
          style={{ marginBottom: Constant.SCREEN_HEIGHT * 0.06 }}
        />

      </ImageBackground >
    );
  }
}

const mapStateToProps = (store) => {
  return {
    name: store.UserAuth.name
  }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(LetsStartScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  centerIcon: {
    width: Constant.SCREEN_WIDTH,
    height: fontSizer(70),
    margin: '10%'
  },
  findTextView: {
    fontSize: fontSizer(27),
    color: Constant.COLOR_WHITE,
    textAlign: "center",
    fontFamily: Constant.FONT_SFP_REGULAR
  },
  descText: {
    marginTop: '10%',
    fontSize: fontSizer(16),
    color: Constant.COLOR_WHITE,
    textAlign: "center",
    fontFamily: Constant.FONT_SFP_REGULAR
  }
});
