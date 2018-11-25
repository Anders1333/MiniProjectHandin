import { Platform, Text, View, StyleSheet,Alert } from 'react-native';
import { Constants, Location, Permissions, Notifications } from 'expo';

import React, { Component } from 'react';





class MenuBar extends Component{

state = {
    showForm : null
};


render(){

    
    return(
        <View style = {styles.menu}>
          
            <Text>hello there!</Text>
        </View>
    )
}
}



const styles = StyleSheet.create({
    menu: {
      
      paddingTop: Constants.statusBarHeight,
      backgroundColor: '#ecf0f1',
    }})

export default MenuBar;


