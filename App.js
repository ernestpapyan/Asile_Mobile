import React, { useState, useEffect } from 'react';
import { LogBox, PermissionsAndroid, Platform, } from 'react-native';
import { Provider } from 'react-redux';
import axios from 'axios';
import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import rootReducer from './src/redux/reducers';
import thunkMiddleware from 'redux-thunk';
import { Root } from 'native-base';
import Navigation from './src/navigations';
import { BASE_API_URL } from './src/utils/config'


axios.defaults.baseURL = BASE_API_URL;

const store = createStore(rootReducer,
  applyMiddleware(
    thunkMiddleware,
  ),
);

LogBox.ignoreAllLogs();

const App = () => {
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        // getOneTimeLocation();
        // subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          requestCameraPermission();
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
          } else {
            // setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    const requestCameraPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Cool Photo App Camera Permission",
            message:
              "Cool Photo App needs access to your camera " +
              "so you can take awesome pictures.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the camera");
        } else {
          console.log("Camera permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    };

    console.log("Request Permission.....")
    requestLocationPermission();
    
    return () => {
      // Geolocation.clearWatch(watchID);
    };
  }, []);
  return (
    <Provider store={store}>
      <Root>
        <Navigation />
      </Root>
    </Provider>
  );
};
export default App;
