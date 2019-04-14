import React from 'react';
import {
    AppRegistry,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Picker,
    TextInput,
    Button
} from 'react-native';
import { WebBrowser } from 'expo';
import SelectInput from 'react-native-select-input-ios'
import { MonoText } from '../components/StyledText';
import { MapView } from "expo";
import IOSPicker from 'react-native-ios-picker';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);

    this.state = { isLoading: true, markers: [], delta_time: -1, keyword: '', longitude:-118.255665, latitude:34.040599, distance_delta: 0};
  }

  componentDidMount() {
    this.fetchMarkerData();
  }

  fetchMarkerData=() => {

    const method = "GET";
    const body = this.state;

    const params = ((params)=>{
      var attr_list=[]
      for (var key in params){
        attr_list.push(key+'='+params[key])
      }
      return attr_list.join('&')
    })(body)

    console.log("Send: ", params)
    fetch("http://localhost:8080/query_event?" + params)
        .then(res => res.json())
        // .then(body => console.log("Receive: ",JSON.stringify(body.count, null, "\t")))
        .then(responseJson => {
          this.setState({
            isLoading: false,
            markers: responseJson.data
          });
          // console.log("Receive :", responseJson)
        })
  }

  renderMarkers() {
    return this.state.isLoading
        ? null
        : this.state.markers.map((marker, index) => {
      const coords = {
        latitude: marker.location.latitude,
        longitude: marker.location.longitude
      };

      const metadata = `creator: ${marker.creator}`;

      return (
          <MapView.Marker
              key={index}
              coordinate={coords}
              title={marker.descripation}
              description={metadata}
          />
      );
    });
  }
  updateTime = (delta_time) => {
    this.setState({ delta_time: delta_time })
  }

  change(d, i) {
    this.setState({distance_delta: d});
    // console.log(d);
  }
  getPickerOptions() {
    return [
      { value: 0, label: 'Apple' },
      { value: 1, label: 'Banana' },
      { value: 2, label: 'Orange' },
      { value: 3, label: 'Strawberry' }
    ]
  }
  render() {
    const timeOptions = [{ value: -1, label: "time range"},{ value: 0, label: "currently happening"},{value: 86400000, label: "within oneday"},{value: 86400000*7, label: "within one week"}];
    const disOptions = [{ value: 0, label: "distance range"},{ value: 1, label: "1 km"},{value: 2, label: "2 km"},{value: 5, label: "5 km"},{ value: 10, label: "10 km"}];
    const disData = ["1 km", "2 km", "5 km", "10 km"];
    const data = [{name: 'SanPyaeLin', code: '22'},{name: 'Jhon', code: '1'},{name: 'Marry', code: '2'}];
    return (
        <View style={styles.overallViewContainer}>
          <MapView
              style={styles.container}
              provider="google"
              region={{
                latitude: 34.040599,
                longitude: -118.255665,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }}
          >
            {this.renderMarkers()}
          </MapView>
          <View style = {{flexDirection: 'column', width: '90%', top: 40}}>
          <View style={styles.inputContainer}>
            <TextInput
                placeholder=" Please input some Keywords if you want! "
                style={ styles.input }
                onChangeText={(text) => this.setState({"keyword": text})}
            />
          </View>


          <View style = {{flexDirection: 'row'}}>
            <View style={styles.inputContainer2 }>
              <SelectInput
                  style={styles.input}

                  value={this.state.delta_time} options={timeOptions}
                  onSubmitEditing={(val) =>
                      this.setState({delta_time: val})}
              />

            </View>

            <View style={styles.inputContainer2 }>
              <SelectInput
                  style={styles.input}
                  value={this.state.distance_delta} options={disOptions}
                  onSubmitEditing={(d)=>this.setState({distance_delta:d})}
              />
            </View>
          </View>
          </View>


          <View style={styles.button} >
            <Button title="Search" style = {styles.buttonText} onPress={this.fetchMarkerData}>
              title = "Search"
            </Button>
          </View>
        </View>
    );
  }

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

const styles = StyleSheet.create({
  overallViewContainer: {
    alignItems: 'center',
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  input: {
    elevation: 1,
    width: '99%',
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  inputContainer: {
    alignItems: 'center',
    elevation: 1,
    backgroundColor: 'white',
    height: 40,
    borderRadius: 4,
    shadowOpacity: 0.75,
    shadowRadius: 1,
    shadowColor: 'gray',
    shadowOffset: { height: 0, width: 0}
  },
  inputContainer2: {
    alignItems: 'center',
    elevation: 1,
    backgroundColor: 'white',
    width: '50%',
    height: 40,
    borderRadius: 4,
    shadowOpacity: 0.75,
    shadowRadius: 1,
    shadowColor: 'gray',
    shadowOffset: { height: 0, width: 0}
  },
  button: {
    elevation: 1,
    position: 'absolute',
    bottom: 25,
    backgroundColor: '#ff6600',
    borderRadius: 10,
    width: '50%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.75,
    shadowRadius: 1,
    shadowColor: 'gray',
    shadowOffset: { height: 0, width: 0}
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',

  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  allNonMapThings: {
    alignItems: 'center',
    height: '100%',
    width: '100%'
  },
  inputContainerWithMargin: {
    elevation: 1,
    backgroundColor: 'white',
    width: '90%',
    height: 40,
    marginTop: 5,
    borderRadius: 3,
    shadowOpacity: 0.75,
    shadowRadius: 1,
    shadowColor: 'gray',
    shadowOffset: { height: 0, width: 0}
  },
  wrapper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },

});
