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

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      fname: '',
      lname: '',
    };
  }
  handleUS = (text) => {
    this.setState({username: text});
  };
  handlePW = (text) => {
    this.setState({password: text});
  };

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
        emails = this.state.email;
        this.props.navigation.navigate('Scan A Gift Card');
      })
      .catch(function (err) {
        if (err === 'Error: Request failed with status code 404') {
          console.log('##err', err);
          alert('Incorrect login credentials. Please try again.');
        } else {
          console.log('##err', err);
          alert('Incorrect login credentials. Please try again.');
        }
      });
    // await axios
    //   .get(
    //     'https://localmainstreetbackend.herokuapp.com/app/LoginAPI/posts',
    //   )
    //   .then((response) => {
    //     if (response.email === this.state.email) {
    //       const name = {
    //         fname: response.fname,
    //         lname: response.lname,
    //       };
    //       console.log('##res', response);
    //       setTimeout(() => {
    //         this.setState({
    //           fname: name.fname,
    //           lname: name.lname,
    //         });
    //       }, 1000);
    //       console.log('##names', this.state.fname, this.state.lname);
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     alert(err);
    //   });
  };

  // saveName = async (e) => {
  //   e.preventDefault();
  //   await axios
  //     .get('https://localmainstreetbackend.herokuapp.com/app/LoginAPI/posts')
  //     .then((response) => {
  //       const data = response.data;
  //       console.log(response);
  //       setTimeout(() => {
  //         this.setState({
  //           fname: data.fname,
  //           lname: data.lname,
  //         });
  //       }, 1000);
  //       alert(this.state.fname);
  //       alert(this.state.lname);
  //       console.log('##names', this.state.fname, this.state.lname);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       alert(err);
  //     });
  // };
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
          onChangeText={this.handleUS}
        />

        <TextInput
          style={styles.input2}
          underlineColorAndroid="transparent"
          placeholder="Password"
          placeholderTextColor="#000000"
          autoCapitalize="none"
          secureTextEntry
          onChangeText={this.handlePW}
        />

        <TouchableOpacity style={styles.buttons} onPress={this.onLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonsUnderLogin} onPress={() => {}}>
          <Text style={styles.buttonTextForSignUp}>Sign up at</Text>

          <Text
            style={styles.buttonTextForSignUp2}
            onPress={() =>
              Linking.openURL('https://localmainstreet.com/BusinessLogin')
            }>
            localmainstreet.com
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.buttonsUnderLogin}
          onPress={() => {
            navigate('Reset Password');
          }}>
          <Text style={styles.buttonTextForSignUp}>Forgot Your Password?</Text>
        </TouchableOpacity> */}
        <Text style={styles.buttonTextForSignUp}>Need Help?</Text>
        <Text style={styles.buttonTextForSignUp}>
          Contact us at info@localmainstreet.com or dial 732-803-8584
        </Text>
      </View>
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

export default LoginScreen;
