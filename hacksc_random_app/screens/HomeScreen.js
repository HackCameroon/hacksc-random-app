import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import styles from '../assets/styles';
// import { MapView } from 'expo';
import MapView from 'react-native-maps';
import { TabNavigator } from "react-navigation";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);

    this.state = {
      latitude: 30.78825,
      longitude: -120.4324,
      error:null,
    };
  }

  componentDidMount() {
    // console.log('didnotmount')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("wokeeey");
        console.log(position);
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );
  }

  render() {
    // return(
    //   <View style={styles.container}>
    //     <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
    //       <Text> {this.state.latitude} </Text>
    //       <Text> {this.state.longitude} </Text>
    //       <Text> {this.state.error} </Text>
    //     </ScrollView>
    //   </View>
    // )

    // console.log('render: '+JSON.stringify(this.state))

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          {/* <View style={styles.welcomeContainer}> */}
          <View style={{ position: 'relative', height: 600}}>
            <Text>My HackSC App</Text>
            <MapView
              style={{ flex:1, left:0, right: 0, top:0, bottom: 0, position: 'absolute' }}
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              // initialRegion={{
              //   latitude: this.state.latitude,
              //   longitude: this.state.longitude,
              //   latitudeDelta: 1,
              //   longitudeDelta: 1,
              // }}
              showsUserLocation={true}
            />
            <Text>Test Map</Text>
          </View>
        </ScrollView>
      </View>
    )
    // return (
    //   <View style={{ position: 'relative', height: 500}}>
    //     <MapView
    //       style={{ left:0, right: 0, top:0, bottom: 0, position: 'absolute' }}
    //       initialRegion={{
    //         latitude: 37.78825,
    //         longitude: -122.4324,
    //         latitudeDelta: 0.0922,
    //         longitudeDelta: 0.0421,
    //       }}
    //     />
    //   </View>
    // );
  }
  /*
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/robot-dev.png')
                  : require('../assets/images/robot-prod.png')
              }
              style={styles.welcomeImage}
            />
          </View>

          <View style={styles.getStartedContainer}>
            {this._maybeRenderDevelopmentModeWarning()}

            <Text style={styles.getStartedText}>Get started by opening</Text>

            <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
              <MonoText style={styles.codeHighlightText}>screens/HomeScreen.js</MonoText>
            </View>

            <Text style={styles.getStartedText}>
              Change this text and your app will automatically reload.
            </Text>
          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
              <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

          <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
          </View>
        </View>
      </View>
    );
  }
  */

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}