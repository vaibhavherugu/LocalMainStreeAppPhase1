'use strict';
import ScrollViewIndicator from 'react-native-scroll-indicator';
import React, { Component } from 'react';
import axios from 'axios';
import {
  View,
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Linking,
  Button,
  Platform,
  Modal,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera as Camera } from 'react-native-camera';
import { ScrollView } from 'react-native-gesture-handler';
var id;
var mainId;
var databasecheck;
var decryptedData;
var encryptedData;
var dollar;
class ScanScreen extends Component {
  //states
  constructor(props) {
    super(props);
    this.state = {
      nameq: {},
      balance: {},
      amount: '',
      text: ``,
      reactivate: Boolean,
      data: {},
      view: 'none',
      translate: '50%',
      dollar: Number,
      dollarAmount: dollar,
      translY: '-86%',
      scaleYs: 1,
      show: false,
      clear: '',
    };
  }
  //decrypts data and checks it: onSuccess
  onSuccess = async (e) => {
    this.setState({
      scaleYs: 0.1,
    });
    const data = e.data;
    try {
      mainId = JSON.parse(data)._id;
    } catch (error) {
      this.setState({
        view: 'none',
        translate: Platform.OS === 'ios' ? '20%' : 60,
        text: `This QR Code is invalid or has no money left. If you think this is a mistake, please contact info@localmainstreet.com.`,
      });
    }

    this.setState({
      reactivate: true,
      view: 'flex',
      translate: '0%',
    });
    if (this.state.reactivate === true) {
      this.setState({
        reactivate: false,
      });
    }
    if (this.state.reactivate === false) {
      this.setState({
        reactivate: true,
      });
    }
    try {
      var encrypto;
      var decrypto;
      const head = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      await axios
        .get(
          'https://localmainstreetbackend.herokuapp.com/app/qrcode/' + mainId,
        )
        .then((res) => {
          encrypto = JSON.stringify(res.data.encData);
        })
        .catch((err) => {
          console.log(err);
        });
      await axios
        .post(
          'https://localmainstreetbackend.herokuapp.com/app/payment/decryption',
          {
            data: encrypto,
          },
          head,
        )
        .then((res) => {
          decrypto = res.data.decryptedData;
        })
        .catch((err) => {
          console.log(err);
        });
      var encryptedData2 = JSON.parse(data).encData;
      encryptedData = JSON.stringify(encryptedData2);
      if (encryptedData2.balance === 0) {
        axios
          .delete(
            'https://localmainstreetbackend.herokuapp.com/app/qrcode/' + mainId,
          )
          .then((res) => {
            console.log(JSON.stringify(res));
          })
          .catch((err) => {
            console.log(err);
          });
        return 0;
      }
      axios
        .post(
          'https://localmainstreetbackend.herokuapp.com/app/payment/decryption',
          {
            data: encryptedData,
          },
          head,
        )
        .then((res) => {
          decryptedData = res.data.decryptedData;
          this.setState({
            data: decryptedData,
          });
          if (decrypto.balance === 0) {
            alert('User has no money left in account.');
            this.setState({
              text: `No money left.`,
              view: 'none',
            });
            axios
              .delete(
                'https://localmainstreetbackend.herokuapp.com/app/qrcode/' +
                mainId,
              )
              .then((res) => {
                console.log(JSON.stringify(res));
              })
              .catch((err) => {
                console.log(err);
              });
            return 0;
          } else if (decrypto.balance < 0) {
            alert(`User's account has ${decrypto.balance}`);
            this.setState({
              text: `Negative funds.`,
            });
            return 0;
          }
          this.setState({
            dollar: decrypto.balance,
          });
          dollar = this.state.dollar;
          this.setState({
            dollarAmount: dollar,
          });
          this.setState({
            text: `Gift card balance is $${this.state.dollarAmount}. Enter the amount paid to complete the transaction. If the gift card does not have enough money to complete the transaction, pay the gift card amount in the app and take the remaining from the customer.`,
            translate: Platform.OS === 'ios' ? '18%' : 60,
            clear: '',
          });
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            view: 'none',
            translate: Platform.OS === 'ios' ? '20%' : 60,
            text: `This QR Code is invalid or has no money left. If you think this is a mistake, please contact info@localmainstreet.com.`,
          });
        });
    } catch (err) {
      console.log(err);
      this.setState({
        view: 'none',
        translate: Platform.OS === 'ios' ? '20%' : 60,
        text: `This QR Code is invalid or has no money left. If you think this is a mistake, please contact info@localmainstreet.com.`,
      });
    }
  };
  handleAmount = (number) => {
    this.setState({ amount: number });
    //sets amount to what is put in
  };
  amountpaid = async () => {
    var encrypto;
    var decrypto;
    const head = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    dollar = this.state.dollar - this.state.amount;
    this.setState({
      dollarAmount: dollar,
    });
    await axios
      .get('https://localmainstreetbackend.herokuapp.com/app/qrcode/' + mainId)
      .then((res) => {
        encrypto = JSON.stringify(res.data.encData);
      })
      .catch((err) => {
        console.log(err);
        //catches error
        alert('Oops! Something went wrong. Please try again.');
      });
    await axios
      .post(
        'https://localmainstreetbackend.herokuapp.com/app/payment/decryption',
        {
          data: encrypto,
        },
        head,
      )
      .then((res) => {
        decrypto = res.data.decryptedData;
      })
      .catch((err) => {
        alert('Oops! Something went wrong. Please try again.');
      });
    var data = {
      ...this.state.data,
      balance: decrypto.balance - this.state.amount,
    };
    if (data.balance < 0) {
      alert(
        `Customer does not have enough money to pay. Choose a lower price. There are $${decrypto.balance} dollars left in this voucher.`,
      );
      return 0;
    }
    if (data.balance === 0) {
      alert('Warning: User has no money left on gift card.');
      setTimeout(() => {
        console.log('timeout');
      }, 2000000000000000);
    }
    var encData;
    await axios
      .post(
        'https://localmainstreetbackend.herokuapp.com/app/payment/encryptionApp',
        {
          data: JSON.stringify(data),
        },
      )
      .then((res) => {
        encData = JSON.stringify(res.data.encryptedData);
      })
      .catch((err) => {
        alert('Oops! Something went wrong. Please try again.');
      });
    axios
      .patch(
        'https://localmainstreetbackend.herokuapp.com/app/qrcode/' + mainId,
        {
          encData: JSON.parse(encData),
        },
      )
      .then((res) => {
        console.log(res);
        alert('Success! Payment Processed!');
      })
      .catch((err) => {
        alert('Oops! Something went wrong. Please try again.');
      });
  };
  amountpaidFull = async () => {
    axios
      .delete(
        'https://localmainstreetbackend.herokuapp.com/app/qrcode/' + mainId,
      )
      .then((res) => {
        console.log(JSON.stringify(res));
        alert("Success! Payment Processed!");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      //scanner
      <ScrollView style={{ backgroundColor: '#ffffff' }}>
        <View style={{}}>
          <QRCodeScanner
            onRead={this.onSuccess}
            flashMode={Camera.Constants.FlashMode.auto}
            reactivate={true}
            reactivateTimeout={2000}
            containerStyle={{
              top: this.state.translate,
              transform: [
                {
                  translateY: Platform.OS === 'ios' ? '-120%' : -60,
                },
              ],
            }}
            topContent={
              //put in the amounts and submit
              <View
                style={{
                  display: this.state.view,
                }}>
                <TextInput
                  style={{
                    marginTop: 15,
                    height: 40,
                    borderColor: '#000000',
                    borderWidth: 1,
                    color: '#000000',
                    width: 340,
                    borderRadius: 15,
                    display: this.state.view,
                    zIndex: 999999999,
                  }}
                  contextMenuHidden={true}
                  keyboardType={'numeric'}
                  underlineColorAndroid="transparent"
                  placeholder="Amount Paid"
                  placeholderTextColor="#000000"
                  autoCapitalize="none"
                  onChangeText={this.handleAmount}
                />
                <Text></Text>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <TouchableOpacity
                    title="Submit"
                    style={{
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 5,
                      width: 170,
                      opacity: 1,
                      backgroundColor: '#000000',
                      zIndex: 999999999,
                      display: this.state.view,
                      borderBottomLeftRadius: 15,
                      borderBottomRightRadius: 0,
                      borderTopLeftRadius: 15,
                      borderTopRightRadius: 0,
                    }}
                    onPress={this.amountpaid}>
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    title="Submit"
                    style={{
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 5,
                      width: 170,
                      opacity: 1,
                      backgroundColor: '#fff',
                      zIndex: 999999999,
                      display: this.state.view,
                      borderColor: '#000000',
                      borderWidth: 1,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 15,
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 15,
                    }}
                    onPress={this.amountpaidFull}>
                    <Text style={styles.buttonText2}>Pay Full Amount</Text>
                  </TouchableOpacity></View>
                <Text
                  style={{
                    display: Platform.OS === 'ios' ? 'none' : 'flex',
                    fontSize: 15,
                    textAlign: 'center',
                    zIndex: 9999999999999,
                    fontFamily:
                      Platform.OS === 'android'
                        ? 'sans-serif-condensed'
                        : 'Avenir',
                  }}>
                  Scroll down to see the amount details of the gift card.
                </Text>

                <Text
                  style={{
                    display: Platform.OS === 'ios' ? 'none' : 'flex',
                  }}></Text>
                <Text
                  style={{
                    display: Platform.OS === 'ios' ? 'none' : 'flex',
                  }}></Text>
                <Text
                  style={{
                    display: Platform.OS === 'ios' ? 'none' : 'flex',
                  }}></Text>
                <Text
                  style={{
                    display: Platform.OS === 'ios' ? 'none' : 'flex',
                  }}></Text>
              </View>
            }
            fadeIn={true}
            bottomContent={
              //space
              <ScrollView>
                <Text></Text>
                <Text
                  style={{
                    display: Platform.OS === 'ios' ? 'none' : 'flex',
                  }}></Text>
                <Text
                  style={{
                    display: Platform.OS === 'ios' ? 'none' : 'flex',
                  }}></Text>
                <Text
                  style={{
                    display: Platform.OS === 'ios' ? 'none' : 'flex',
                  }}></Text>

                <Text //customer amount info
                  style={styles.texts}>
                  {this.state.text}
                </Text>
              </ScrollView>
            }
          />
        </View>
      </ScrollView>
    );
  }
}
//styles
const styles = StyleSheet.create({
  buttonText: {
    color: '#ffffff',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-condensed' : 'Avenir',
    textAlign: 'center',
  },
  buttonText2: {
    color: '#000000',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-condensed' : 'Avenir',
    textAlign: 'center',
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
    zIndex: 999999999,
  },
  text: {
    textAlign: 'center',
    fontSize: 15,
    fontFamily: Platform.OS === 'android' ? 'sans-serif-condensed' : 'Avenir',
  },
  input2: {
    marginTop: 15,
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    color: '#000000',
    width: 340,
    borderRadius: 15,
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#000000',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-condensed' : 'Avenir',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-condensed' : 'Avenir',
  },
  buttonTouchable: {
    padding: 16,
  },
  background: {
    backgroundColor: '#ffffff',
  },
  texts: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-medium' : 'Avenir',
    zIndex: 9999999999999,
    marginBottom: 10,
  },
});
export default ScanScreen;
