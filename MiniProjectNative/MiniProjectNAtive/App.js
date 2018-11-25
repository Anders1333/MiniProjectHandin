import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet,Alert, Dimensions, TextInput, Button } from 'react-native';
import { Constants, Location, Permissions, Notifications } from 'expo';
import MapView, {Marker} from 'react-native-maps';
import Menubar from './MenuBar';
import { blue, yellow, white } from 'ansi-colors';
const backendURL =  "http://a8458a11.ngrok.io/api/login";



// When the app starts, state is set as follows:

export default class App extends Component {
  state = {
    location: null,
    username: null,
    radius: 0,
    errorMessage: null,
    notification : "",
    myPosition : {coordinate: {latitude : 55, longitude : 12}, title: 'You are here', subtitle: 'subtitle'},
    tracking : true,
  
    markers : [{
      coordinate: {latitude : 55, longitude : 12},
        title: 'You are here',
        subtitle: 'subtitle'
    }]
    
  };


  //if app mounts, we attempt to get the location:

  componentWillMount() {
    this._getLocationAsync();
  }

  _getLocationAsync = async () => {
    // We ask for permission to know the phones location (gps)
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    // set error-message if permission is denied. This will overule all else later. 
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    let pushToken = await Notifications.getExpoPushTokenAsync();
    // Get the location of the device
    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    
    // save the coordinates
    const {latitude,longitude} = location.coords;
    this.setState({ location });
    this.setState({ myPosition: {
      coordinate: {latitude : this.state.location.coords.latitude, longitude : this.state.location.coords.longitude},
        title: 'You are here',
        subtitle: 'subtitle',
        pinColor: 'blue'
        
        
    }});

    // Register the login ( Backend )   <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    /*fetch(PUSH_ENDPOINT+"/register", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: Constants.deviceId, pushToken, latitude, longitude
      }),
    }); */
    // this._notificationSubscription = Notifications.addListener(this._handleNotification);

    

    /* this.setState({yourMarker:{
    coordinate: {latitude : this.state.location.coords.latitude, longitude : this.state.location.coords.longitude},
      title: 'You are here',
      subtitle: 'subtitle'
    }});
    }; */

  }

  onScanPress = async () =>{

    

    
    fetch(backendURL, {
      method: 'POST' , 
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
        distance: this.state.radius,
        latitude: this.state.myPosition.coordinate.latitude,
        longitude: this.state.myPosition.coordinate.longitude
      }),
    }).then(response => JSON.stringify(response)).then(data => console.log(data)); 

    //***** */ Her ville jeg så mappe hen over hvert json object og fylde "markers" state med de brugere der blev fundet.
    // Således ville alle personer der har en position i databasen blive vist som markers hvis de var inden
    // for den givne radius. Personen der "scanner" ville automatisk opdatere sin position. således at andre ville kunne se ham. 
    // 
    
  }
    
  

  



  
   // A notification wether a user comes online. (Does this also work when others log in ??)
  _handleNotification = (notification) => {
    const msg = notification.data;
    const message = `User ${msg.id} just got online. Located at ${msg.latitude}, ${msg.longitude}`
    Alert.alert(message);
    this.setState({notification: message});
  };

render() {
  
  
  let text = 'Waiting..';
  if (this.state.errorMessage) {
    text = this.state.errorMessage;
  } else if (this.state.location) {
    return(
      <View>
       
      <MapView style={styles.map}
        initialRegion={{
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
        }}
      >
       <MapView.Circle
                key = { (this.state.location.coords.latitude + this.state.location.coords.longitude).toString() }
                center = { this.state.location.coords }
                radius = {parseInt(this.state.radius)}
                strokeWidth = { 1 }
                strokeColor = { '#1a66ff' }
                fillColor = { 'rgba(230,238,255,0.5)' }
              
        />
       
       <Marker {... this.state.myPosition}/>
      {this.state.markers.map((marker)=> {
       return <Marker key={marker.toString()} {... marker}/>
      })}
     </MapView>
       <View style = {styles.inputfields}>
          <TextInput placeholder="Username" onChangeText={(username) => this.setState({username})}/>
          <TextInput placeholder="Password" onChangeText={(password) => this.setState({password})}/>
          <TextInput placeholder="Radius" onChangeText={(radius) => this.setState({radius})}/>
          <Button title="Scan" onPress={this.onScanPress}/>
          </View>
      
      </View>
      
    )
    

    
  }else{
// Returns (renders) whatever is present. Errormessage, notification, location. 
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
    </View>
  );
}
}
}








// Stylesheet ,  Ignore  -----------------------
const styles = StyleSheet.create({
  inputfields:{
    borderWidth: 2,
  borderColor: 'black',
  width: Dimensions.get('window').height,
  paddingTop: Constants.statusBarHeight,
  backgroundColor: 'white',
  position: 'absolute',
  top: 0 
   
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
  map: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
});


