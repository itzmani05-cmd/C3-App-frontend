import { StatusBar } from 'expo-status-bar';
import {Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {useFonts} from 'expo-font';

import Onboarding1 from './src/screens/Onboarding1';
import Onboarding2 from './src/screens/Onboarding2';
import Onboarding3 from './src/screens/Onboarding3';
import LoginScreen from './src/screens/LoginScreen';
import SIgnUpScreen from './src/screens/SIgnUpScreen';

const Stack=createNativeStackNavigator();

export default function App() {
  const [loaded]=useFonts({
    ManropeRegular: require('./src/assests/fonts/Manrope-Regular.ttf'),
    ManropeMedium: require('./src/assests/fonts/Manrope-Medium.ttf'),
    ManropeSemiBold: require('./src/assests/fonts/Manrope-SemiBold.ttf'),
    ManropeBold: require('./src/assests/fonts/Manrope-Bold.ttf'),
    ManropeExtraBold: require('./src/assests/fonts/Manrope-ExtraBold.ttf'),
  });
  
  if(!loaded){
    return <Text>Loading...</Text>
  }
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding1" screenOptions={{headerShown:false}}>
        <Stack.Screen name='Onboarding1' component={Onboarding1}/>
        <Stack.Screen name='Onboarding2' component={Onboarding2}/>
        <Stack.Screen name='Onboarding3' component={Onboarding3}/>
        <Stack.Screen name='Login' component={LoginScreen}/>
        <Stack.Screen name='SIgnUp' component={SIgnUpScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  ) 
}

