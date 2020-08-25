import {
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
  ActivityIndicator,
  Modal,
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
      Loginbtntext: 'flex',
      LoginbtnActivityIndicator: 'none',
      stripeIDres: '',
    };
  }

  handleUS = (text) => {
    this.setState({username: text});
  };
  handlePW = (text) => {
    this.setState({password: text});
  };

  toggleRememberMe = () => {
    this.setState({rememberMe: this.state.checked});

    if (this.state.checked === true) {
      this.rememberUser();
    } else {
    }
  };

  setLoading = (isLoading) => {
    if (isLoading) {
      this.setState({Loginbtntext: 'none', LoginbtnActivityIndicator: 'flex'});
    } else if (!isLoading) {
      this.setState({Loginbtntext: 'flex', LoginbtnActivityIndicator: 'none'});
    }
  };

  rememberUser = async () => {
    try {
      await AsyncStorage.setItem('username', this.state.username);
      await AsyncStorage.setItem('password', this.state.password);
      this.setState({showCheck: 'none'});
    } catch (error) {
      console.log(error);
      alert('Something went wrong, please try again.');
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
      console.log(error);
      alert('Something went wrong, please try again.');
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
      this.setState({showCheck: 'none'});
    }
  }

  onLogin = async (e) => {
    e.preventDefault();
    this.setLoading(true);
    if (this.state.username == '' || this.state.password == '') {
      alert('Please fill out all fields.');
      this.setLoading(false);
      return null;
    }
    const payload = {
      email: this.state.username,
      password: this.state.password,
    };
    await axios
      .post(
        'https://localmainstreetbackend.herokuapp.com/app/LoginAPI/login',
        payload,
      )
      .then(async (response) => {
        console.log('##res', response);
        if (response.status === 200) {
          await AsyncStorage.setItem(
            'token',
            JSON.stringify(response.data.token),
          );
          if (response.data.email == undefined || null || NaN) {
            await AsyncStorage.setItem(
              'emailb',
              JSON.stringify(response.data.emailb),
            );
          } else {
            await AsyncStorage.setItem(
              'email',
              JSON.stringify(response.data.email),
            );
          }

          await AsyncStorage.setItem(
            'fname',
            JSON.stringify(response.data.fname),
          );
          await AsyncStorage.setItem(
            'lname',
            JSON.stringify(response.data.lname),
          );
        }
        const tokenval = response.data.token;
        console.log(tokenval);
        this.setState({
          stripeIDres: response.data.stripeId,
        });
        console.log('tokenval', tokenval);

        if (!tokenval) {
          console.log('##err', err);
          alert(
            'Incorrect login credentials. Please try again. If you are sure that it is correct, please check your internet connection and try again.',
          );
          this.setLoading(false);
        }

        if (response.data.url === '/Shop') {
          await AsyncStorage.removeItem('type');
          await AsyncStorage.setItem('type', 'customer');
          this.props.navigation.navigate('Shop');
        } else if (
          response.data.url === '/Dashboard' &&
          response.data.stripeId
        ) {
          await AsyncStorage.removeItem('type');
          await AsyncStorage.setItem('type', 'business');
          this.props.navigation.navigate('Scan A Gift Card', {
            email: this.state.username,
          });
        } else {
          alert(
            'Whoops! Something went wrong. Possible causes are that this account has not registered properly.',
          );
        }

        this.toggleRememberMe();

        // await AsyncStorage.setItem('emailCheck', this.state.username)
        // alert(JSON.stringify(AsyncStorage.getItem('emailCheck')))
        this.setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        if (err === 'Error: Request failed with status code 404') {
          alert(
            'Incorrect login credentials. Please try again. If you are sure that they are correct, please check your internet connection and try again.',
          );
          this.setLoading(false);
        } else {
          alert(
            'Incorrect login credentials. Please try again. If you are sure that they are correct, please check your internet connection and try again.',
          );
          this.setLoading(false);
        }
      });
  };

  render() {
    const {navigate} = this.props.navigation;
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
          <Text
            style={{
              color: '#ffffff',
              fontFamily:
                Platform.OS === 'android' ? 'sans-serif-condensed' : 'Avenir',
              display: this.state.Loginbtntext,
            }}>
            Login
          </Text>
          <ActivityIndicator
            style={{display: this.state.LoginbtnActivityIndicator}}
          />
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
