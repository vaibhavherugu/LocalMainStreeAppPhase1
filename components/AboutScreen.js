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
} from 'react-native';

var emails;

class AboutScreen extends React.Component {
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
            marginTop: 20,
            fontFamily:
              Platform.OS === 'android' ? 'sans-serif-medium' : 'Avenir',
          }}>
          Back in late March, we were hit with a global pandemic caused due to
          the Coronavirus. As the crisis started to unfold, we saw our schools
          and local businesses being shut down. Besides the serious danger to
          public health, the economy also came to a standstill. We saw small
          businesses, the backbone of America, feel the impact. Our favorite
          local restaurants, salons, and other small businesses were struggling
          to survive. We decided to to something about it.
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 17,
            marginTop: 30,
            fontFamily:
              Platform.OS === 'android' ? 'sans-serif-medium' : 'Avenir',
          }}>
          Here at LocalMainStreet we allow customers to buy/share gift cards and
          vouchers from your favorite local businesses and redeem it later. This
          will help businesses survive these tough times. Registration is free
          and only takes a few clicks. This is our way of contributing to the
          community and the businesses that have served us for a long time.
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 17,
            marginTop: 30,
            fontFamily:
              Platform.OS === 'android' ? 'sans-serif-medium' : 'Avenir',
          }}>
          In the future, these local businesses can offer their own gift cards
          just like Visa or Amazon would do. United we stand, together we win!
        </Text>
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

export default AboutScreen;
