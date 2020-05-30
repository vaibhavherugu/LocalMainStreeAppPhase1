import {
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
} from 'react-native';
import * as React from 'react';
import axios from 'axios';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  AsyncStorage,
  Linking,
  Platform,
} from 'react-native';

var emails;

class AboutLMS extends React.Component {
  render() {
    const {navigate} = this.props.navigation;
    return (
      <ScrollView
        style={{
          backgroundColor: '#ffffff',
        }}>
        <StatusBar barStyle="dark-content" />
        <Text
          style={{
            textAlign: 'center',
            fontSize: 17,
            marginTop: 50,
            fontFamily:
              Platform.OS === 'android'
                ? 'sans-serif-medium'
                : 'AvenirNext-Bold',
          }}>
          If you are a Business,
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 17,
            marginTop: 10,
            fontFamily:
              Platform.OS === 'android' ? 'sans-serif-medium' : 'Avenir',
          }}>
          Register at localmainstreet.com. Enter payment info.
        </Text>
        <View style={{alignItems: 'center'}}>
          <Image source={require('./images/7.png')} />
        </View>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 17,
            marginTop: 5,
            marginBottom: 10,
            fontFamily:
              Platform.OS === 'android' ? 'sans-serif-medium' : 'Avenir',
          }}>
          When a customer walks in with a QR code, scan it. Enter the amount the
          customer owes click submit. You're done!
        </Text>
        <View style={{alignItems: 'center'}}>
          <Image
            style={{marginBottom: 80}}
            source={require('./images/4.png')}
          />
          <Text
            style={{
              textAlign: 'center',
              marginTop: 150,
            }}>
            Image credit to https://icons8.com
          </Text>
        </View>
        {/* <Text
          style={{
            textAlign: 'center',
            fontSize: 17,
            marginTop: 5,
            fontFamily:
              Platform.OS === 'android' ? 'sans-serif-medium' : 'Avenir',
          }}>
          Customers:
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 17,
            marginTop: 10,
            fontFamily:
              Platform.OS === 'android' ? 'sans-serif-medium' : 'Avenir',
          }}>
          1 - Register at localmainstreet.com
        </Text>
        <View style={{alignItems: 'center'}}>
          <Image
            style={{marginTop: 10, marginBottom: 10}}
            source={require('./images/1.png')}
          />
        </View>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 17,
            marginTop: 5,
            fontFamily:
              Platform.OS === 'android' ? 'sans-serif-medium' : 'Avenir',
          }}>
          2 - Buy gift cards/vouchers from your favorite local businesses. You
          will get QR Codes that will be sent to your email.
        </Text>
        <View style={{alignItems: 'center'}}>
          <Image source={require('./images/2.png')} />
        </View>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 17,
            marginTop: 5,
            marginBottom: 10,
            fontFamily:
              Platform.OS === 'android' ? 'sans-serif-medium' : 'Avenir',
          }}>
          3 - When you use the gift cards, enjoy the service from the
          businesses. When you are done, scan the QR codes with the owner. It's
          as easy as that.
        </Text>
        <View style={{alignItems: 'center'}}>
          <Image source={require('./images/4.png')} />
        </View> */}
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    textAlign: 'center',
  },
  input2: {
    margin: 15,
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    color: '#000000',
    width: 360,
    borderRadius: 15,
  },

  viewForSearch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },

  buttons: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    width: 360,
    opacity: 1,
    backgroundColor: '#000000',
    borderRadius: 15,
    marginLeft: 500,
    marginRight: 500,
  },

  buttonText: {
    color: '#ffffff',
  },
  buttonTextForSignUp: {
    color: '#000000',
    textAlign: 'center',
  },
  buttonTextForSignUp2: {
    color: '#000000',
    textAlign: 'center',
    color: '#03b1fc',
    textDecorationLine: 'underline',
  },
  buttonsUnderLogin: {
    margin: 7,
  },
});

export default AboutLMS;
