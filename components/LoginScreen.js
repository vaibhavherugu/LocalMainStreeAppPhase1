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
  Linking,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import AsyncStorage from '@react-native-community/async-storage';
var emails;

class LoginScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      fname: '',
      lname: '',
      checkedTwo: false,
      checked: false,
      rememberMe: false,
      showCheck: 'flex',
    };
  }

  handleUS = (text) => {
    this.setState({ username: text });
  };
  handlePW = (text) => {
    this.setState({ password: text });
  };

  toggleRememberMe = () => {

    this.setState({ rememberMe: this.state.checked });

    if (this.state.checked === true) {
      this.rememberUser();
    } else {
    }
  };

  rememberUser = async () => {
    try {

      await AsyncStorage.setItem('username', this.state.username);
      await AsyncStorage.setItem('password', this.state.password);
      this.setState({ showCheck: 'none' });
    } catch (error) {
      alert(error);
    }
  };

  getRememberedUser = async () => {
    try {

      const username = await AsyncStorage.getItem('username');
      const password = await AsyncStorage.getItem('password');
      if (username !== null && password != null) {
        const stuff = {
          username: username,
          password: password,
        };
        return stuff;
      }
    } catch (error) {
      alert(error);
    }
  };

  async componentDidMount() {

    const username = (await this.getRememberedUser()).username;
    const password = (await this.getRememberedUser()).password;
    this.setState({
      username: username || '',
      password: password || '',
      rememberMe: username ? true : false,
    });

    if (this.state.username !== '' && this.state.password != '') {
      this.setState({ showCheck: 'none' });
    }
  }

  onLogin = async (e) => {
    e.preventDefault();
    const payload = {
      emailb: this.state.username,
      passwordb: this.state.password,
    };
    await axios
      .post(
        'https://localmainstreetbackend.herokuapp.com/app/BusinessLoginAPI/loginB',
        payload,
      )
      .then((response) => {
        console.log('##res', response);
        if (response.status === 200) {
          AsyncStorage.setItem('token', JSON.stringify(response.data));
        }
        const tokenval = AsyncStorage.getItem('token');
        console.log(tokenval);

        if (!tokenval) {
          console.log('##err', err);
          alert('Incorrect login credentials. Please try again.');
        }

        this.toggleRememberMe();
        this.props.navigation.navigate('LocalMainStreet');
      })
      .catch(function (err) {
        if (err === 'Error: Request failed with status code 404') {
          alert('Incorrect login credentials. Please try again.');
        } else {
          alert('Incorrect login credentials. Please try again.');
        }
      });
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.viewForSearch}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.header}>Login</Text>
        <TextInput
          style={styles.input2}
          underlineColorAndroid="transparent"
          placeholder="Email"
          placeholderTextColor="#000000"
          autoCapitalize="none"
          defaultValue={this.state.username}
          onChangeText={this.handleUS}
        />
        <TextInput
          style={styles.input2}
          underlineColorAndroid="transparent"
          placeholder="Password"
          placeholderTextColor="#000000"
          autoCapitalize="none"
          secureTextEntry
          defaultValue={this.state.password}
          onChangeText={this.handlePW}
        />
        <TouchableOpacity style={styles.buttons} onPress={this.onLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            display: this.state.showCheck,
          }}>
          <CheckBox
            style={{
              marginTop: Platform.OS === 'android' ? -63 : 0,
              marginBottom: Platform.OS === 'android' ? -63 : 0,
            }}
            isChecked={this.state.checked}
            leftText={'Check Box'}
            onClick={() => {
              if (this.state.checked === true) {
                this.setState({
                  checked: false,
                });
              } else {
                this.setState({
                  checked: true,
                });
              }
            }}
          />
          <Text
            style={{
              marginTop: 3,
              fontFamily:
                Platform.OS === 'android' ? 'sans-serif-condensed' : 'Avenir',
            }}>
            Remember Me
          </Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily:
      Platform.OS === 'android' ? 'sans-serif-medium' : 'AvenirNext-Bold',
  },
  input2: {
    margin: 15,
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    color: '#000000',
    width: 340,
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
    width: 340,
    opacity: 1,
    backgroundColor: '#000000',
    borderRadius: 15,
    marginLeft: 500,
    marginRight: 500,
  },
  buttons2: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    width: 90,
    opacity: 1,
    backgroundColor: '#000000',
    borderRadius: 15,
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-condensed' : 'Avenir',
  },
  buttonTextForSignUp: {
    color: '#000000',
    textAlign: 'center',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-condensed' : 'Avenir',
  },
  buttonTextForSignUp2: {
    color: '#000000',
    textAlign: 'center',
    color: '#03b1fc',
    textDecorationLine: 'underline',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-condensed' : 'Avenir',
  },
  buttonsUnderLogin: {
    margin: 7,
  },
});

export default LoginScreen;
