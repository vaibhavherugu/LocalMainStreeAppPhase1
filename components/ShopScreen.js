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
var limitcounter = 0;

class ShopScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shops: [],
      search: '',
      count: 0,
      paginationLoading: 'none',
      loading: 'none',
      searchPagination: true,
      loadingSearch: false,
    };
  }

  async componentDidMount() {
    this.setState({loading: 'flex'});
    const headers = {
      'auth-token': await AsyncStorage.getItem('token'),
      page: 0,
    };
    await axios
      .get(
        'https://localmainstreetbackend.herokuapp.com/app/BusinessLoginAPI/shop/count',
      )
      .then((res) => {
        this.setState({
          count: res.data,
        });
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
    await axios
      .get(
        'https://localmainstreetbackend.herokuapp.com/app/BusinessLoginAPI/shop/pagination',
        headers,
      )
      .then((res) => {
        this.setState({shops: res.data});
      })
      .catch((err) => {
        console.log(err);
      });

    this.setState({loading: 'none'});
  }

  handleSearch = async () => {
    this.setState({loadingSearch: true});
    var inputVal = this.state.search;

    if (!inputVal.replace(/\s/g, '').length) {
      if (inputVal === '') {
        this.setState({searchPagination: true});
        const headers222 = {
          'auth-token': await AsyncStorage.getItem('token'),
          page: 0,
        };
        axios
          .get(
            'https://localmainstreetbackend.herokuapp.com/app/BusinessLoginAPI/shop/pagination',
            {
              headers222,
            },
          )
          .then((response) => {
            this.setState({
              shops: response.data,
            });
          })

          .catch((err) => {
            console.error(err);
          });
      } else {
      }
    } else {
      this.setState({searchPagination: false});
      const tokenval = await AsyncStorage.getItem('token');
      const headers = {
        'auth-token': tokenval,
      };
      axios
        .post(
          'https://localmainstreetbackend.herokuapp.com/app/BusinessLoginAPI/shop/search',
          {
            query: inputVal,
          },
          {headers},
        )
        .then((res) => {
          this.setState({
            shops: res.data.results.map((shop) => shop),
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
    this.setState({loadingSearch: false});
  };

  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
        }}>
        <ScrollView
          style={{backgroundColor: '#fff'}}
          onScroll={async ({nativeEvent}) => {
            if (this.isCloseToBottom(nativeEvent)) {
              if (this.state.searchPagination) {
                this.setState({paginationLoading: 'flex'});
                console.log(this.state.searchPagination);
                const tokenval = await AsyncStorage.getItem('token');
                const headers = {
                  'auth-token': tokenval,
                  page: limitcounter,
                };
                let shopsStatic = this.state.shops;

                var checker = 17 * limitcounter;
                if (this.state.count <= checker) {
                } else {
                  axios
                    .get(
                      'https://localmainstreetbackend.herokuapp.com/app/BusinessLoginAPI/shop/pagination',
                      {
                        headers,
                      },
                    )
                    .then((response) => {
                      var total = shopsStatic.concat(response.data);

                      this.setState({
                        shops: total,
                      });
                    })

                    .catch((err) => {
                      console.error(err);
                    });

                  limitcounter++;
                }

                this.setState({paginationLoading: 'none'});
              }
            }
          }}
          scrollEventThrottle={400}>
          <View style={styles.search}>
            <TextInput
              style={styles.input}
              placeholder="Search by Zip, City, or Name"
              underlineColorAndroid="transparent"
              placeholderTextColor="#000000"
              autoCapitalize="none"
              value={this.state.search}
              onChangeText={(e) => {
                this.setState({search: e});
              }}
            />
            <TouchableOpacity
              style={styles.button2}
              onPress={this.handleSearch}>
              {this.state.loadingSearch ? (
                <ActivityIndicator />
              ) : (
                <Text style={{color: '#ffffff'}}>Search</Text>
              )}
            </TouchableOpacity>
          </View>
          {this.state.shops.map((shop) => (
            <View style={styles.card}>
              <Text style={{fontSize: 20}}>{shop.bname}</Text>
              <Text></Text>

              <TouchableOpacity
                style={{
                  height: 35,
                  width: 200,
                  opacity: 1,
                  borderRadius: 4,
                  borderStyle: 'solid',
                  borderColor: '#000',
                  borderWidth: 2,
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: shop.stripeAccountId === 'temporary' ? 0.4 : 1,
                }}
                disabled={shop.stripeAccountId === 'temporary' ? true : false}
                onPress={() => {
                  Linking.openURL(
                    `https://localmainstreet.com/Buy?bname=${shop.bname}&description=${shop.description}&phoneNumber=${shop.phoneNumber}&stripeId=${shop.stripeAccountId}&address=${shop.address}&email=${shop.emailb}`,
                  );
                }}>
                <Text>Buy Gift Cards</Text>
              </TouchableOpacity>
              <Text></Text>
              {shop.website === ' ' ? null : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    Linking.openURL(shop.website);
                  }}>
                  <Text>Website</Text>
                </TouchableOpacity>
              )}
              <Text></Text>
              <Text
                style={{
                  textAlign: 'center',
                }}>
                {shop.address}
              </Text>
              <Text></Text>
              <Text
                style={{
                  textAlign: 'center',
                }}>
                {shop.phoneNumber}
              </Text>
            </View>
          ))}
          <ActivityIndicator
            style={{display: this.state.paginationLoading, marginBottom: 50}}
          />
        </ScrollView>
        <View
          style={{
            display: this.state.loading,
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  card: {
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 2,
    padding: 50,
    marginBottom: 7.5,
    width: '95%',
    marginTop: 7.5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 3,
  },
  button: {
    height: 35,
    width: 200,
    opacity: 1,
    borderRadius: 4,
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button2: {
    margin: 15,
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    color: '#000000',
    backgroundColor: '#000000',
    width: '95%',
    borderRadius: 4,
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    color: '#000000',
    width: '95%',
    borderRadius: 4,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
  },
  search: {},
});

export default ShopScreen;
