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
  //states
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
  //sets states to text in TextInputs
  handleUS = (text) => {
    this.setState({username: text});
  };
  handlePW = (text) => {
    this.setState({password: text});
  };

  toggleRememberMe = () => {
    //checks whether the check mark is checked. If so, it does this.rememberUser();
    this.setState({rememberMe: this.state.checked});

    if (this.state.checked === true) {
      this.rememberUser();
    } else {
    }
  };

  rememberUser = async () => {
    try {
      //it sets the async storage of the username and password and sets this.state.showCheck to none, which is called in the display prop of the check
      await AsyncStorage.setItem('username', this.state.username);
      await AsyncStorage.setItem('password', this.state.password);
      this.setState({showCheck: 'none'});
    } catch (error) {
      alert(error);
    }
  };

  getRememberedUser = async () => {
    try {
      //getting the remembered user from async storage. If it is not null, it sets username and password to it and returns it
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
    //gets remembered user and sets states. This is a componentDidMount, so it happens as soon as the code starts
    const username = (await this.getRememberedUser()).username;
    const password = (await this.getRememberedUser()).password;
    this.setState({
      username: username || '',
      password: password || '',
      rememberMe: username ? true : false,
    });
    //if its not null, then it gets rid of the remember me check by setting a state to none. The state is called in display of the check
    if (this.state.username !== '' && this.state.password != '') {
      this.setState({showCheck: 'none'});
    }
  }

  onLogin = async (e) => {
    e.preventDefault();
    //sends this.state.username and password and posts to check
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
        //gets the response status and sets the token
        console.log('##res', response);
        if (response.status === 200) {
          AsyncStorage.setItem('token', JSON.stringify(response.data));
        }
        //gets the tokenval-if there is no tokenval, then it is incorrect login details and ot alerts
        const tokenval = AsyncStorage.getItem('token');
        console.log(tokenval);

        if (!tokenval) {
          console.log('##err', err);
          alert('Incorrect login credentials. Please try again.');
        }
        //since it has the tokenval, it does this.toggleRememberMe(). Then it navigates to LocalMainStreet, which is the homepage
        this.toggleRememberMe();
        this.props.navigation.navigate('LocalMainStreet');
      })
      .catch(function (err) {
        //error, could be incorrect login credentials
        if (err === 'Error: Request failed with status code 404') {
          alert('Incorrect login credentials. Please try again.');
        } else {
          alert('Incorrect login credentials. Please try again.');
        }
      });
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      //header, text fields and check mark
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
            //metioned earlier
            display: this.state.showCheck,
          }}>
          <CheckBox
            style={{
              //different styles for ios and android
              marginTop: Platform.OS === 'android' ? -63 : 0,
              marginBottom: Platform.OS === 'android' ? -63 : 0,
            }}
            isChecked={this.state.checked}
            leftText={'Check Box'}
            onClick={() => {
              //can be toggled, state is called in this.toggleRememberMe()
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
            //Links and text
            style={{
              marginTop: 3,
              fontFamily:
                Platform.OS === 'android' ? 'sans-serif-condensed' : 'Avenir',
            }}>
            Remember Me
          </Text>
        </View>
        <Text style={styles.buttonTextForSignUp}>
          Sign up or Forgot Password? Go to
        </Text>
        <Text
          style={styles.buttonTextForSignUp2}
          onPress={() => Linking.openURL('https://localmainstreet.com')}>
          localmainstreet.com
        </Text>
      </View>
    );
  }
}
//styles
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
