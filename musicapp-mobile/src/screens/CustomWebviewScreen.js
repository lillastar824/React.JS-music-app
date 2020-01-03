import React from 'react';
import {
  StyleSheet, View, WebView
} from 'react-native';

import { connect } from 'react-redux';

import {
  manageApiResponseCode,
} from "../utils/MethodUtils"

import TabBarHeader from "../component/TabBarHeader"
import Constant from '../constant/Constant';

class CustomWebviewScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      HTMLContent: ''
    }
  }

  componentWillMount() {
    this._getWebContentApi()
  }

  _getWebContentApi = () => {
    var formData = new FormData()
    formData.append("token", this.props.userData.token)
    formData.append("page_id", this.props.navigation.state.params.type)

    Constant.showLoader.showLoader()

    fetch(Constant.API_WEB_CONTENT, {
      method: 'POST',
      headers: {
        'Authorization': Constant.HEADER,
      },
      body: formData
    }).then(r => r.json())
      .then((data) => {
        Constant.showLoader.hideLoader()

        if (data.status_code === 200) {
          this.setState({ HTMLContent: data.data })
        } else {
          manageApiResponseCode(data, this.props.screenProps.rootNavigation.navigate)
        }

      }).catch(exception => {
        console.log("exception ---> " + JSON.stringify(exception));
        Constant.showLoader.hideLoader()
      });
  }


  render() {
    return (
      <View style={styles.container}>

        <View style={styles.webVeiwMainView} >

          <TabBarHeader
            headerTitle={""}
            isBackVisible={true}
            isNotificationIcon={false}
          />

          <WebView
            style={{ width: Constant.SCREEN_WIDTH, backgroundColor: Constant.COLOR_BACK_BLACK }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scalesPageToFit={true}
            source={{ html: this.state.HTMLContent }}
          />

        </View>

        <TabBarHeader
          headerTitle={this.props.navigation.state.params.title}
          isBackVisible={true}
          onPressBack={() => {
            this.props.navigation.pop()
          }}
        />

      </View>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    userData: store.UserAuth.userData,
  }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CustomWebviewScreen);


const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Constant.COLOR_BACK_BLACK,
  },
  webVeiwMainView: {
    width: Constant.SCREEN_WIDTH,
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Constant.COLOR_BACK_BLACK
  }
});
