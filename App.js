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
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import VerifyAccountScreen from './src/screens/VerifyYourAccount';
import CertificatesScreen from './src/screens/MyCertificates';
import TabNavigation from './src/navigation/TabNavigation';
import PaymentHistoryScreen from './src/screens/PaymentHistory';
import SettingsScreen from './src/screens/SettingScreen';
import MyCourseOverview from './src/screens/MyCourseOverview';
import PaymentNotification from './src/screens/PaymentNotification';
import PaymentScreen from './src/screens/PaymentScreen';
import MyCourse from './src/screens/MyCourse';
import LessonScreen from './src/screens/LessonScreen';
import SplashScreen from './src/screens/SplashScreen';

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
    return <Text>Loading...</Text>;
  }
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{headerShown:false}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name='Onboarding1' component={Onboarding1}/>
        <Stack.Screen name='Onboarding2' component={Onboarding2}/>
        <Stack.Screen name='Onboarding3' component={Onboarding3}/>
        <Stack.Screen name='Login' component={LoginScreen}/>
        <Stack.Screen name='SIgnUp' component={SIgnUpScreen}/>
        <Stack.Screen name='ResetPassword' component={ResetPasswordScreen}/>
        <Stack.Screen name='VerifyAccount' component={VerifyAccountScreen}/>
        <Stack.Screen name='MainApp' component={TabNavigation}/>
        <Stack.Screen name="Certificates" component={CertificatesScreen} />
        <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="MyCourseOverview" component={MyCourseOverview} />
        <Stack.Screen name="PaymentNotification" component={PaymentNotification} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        <Stack.Screen name="MyCourse" component={MyCourse} />
        <Stack.Screen name="LessonScreen" component={LessonScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  ) 
}

