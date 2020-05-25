import * as React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './components/LoginScreen';
import ScanScreen from './components/ScanScreen';

const Stack = createStackNavigator();

class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Scan A Gift Card"
            component={ScanScreen}
            options={{title: 'Scan A Gift Card'}}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{title: 'Login'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
