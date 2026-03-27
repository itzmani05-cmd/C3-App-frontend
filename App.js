import { StatusBar } from 'expo-status-bar';
import {Text} from 'react-native';
// import LoginScreen from './src/screens/LoginScreen';
// import SignUpScreen from './src/screens/SIgnUpScreen';
// import VerifyYourAccount from './src/screens/VerifyYourAccount';
// import ResetPassword from './src/screens/ResetPasswordScreen';

// import TabNavigation from './src/navigation/TabNavigation';
// import {NavigationContainer} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import PaymentNotification from './src/screens/PaymentScreen';

// import Onboarding1 from './src/screens/Onboarding1';

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
  return (
    <PaymentNotification/>
    // <NavigationContainer>
    //   <TabNavigation />
    // </NavigationContainer>
  )
}

