import { StatusBar } from 'expo-status-bar';
import {Text} from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import {useFonts} from 'expo-font';

export default function App() {
  const [loaded]=useFonts({
    ManropeRegular: require('./src/assests/fonts/Manrope-Regular.ttf'),
    ManropeMedium: require('./src/assests/fonts/Manrope-Medium.ttf'),
    ManropeSemiBold: require('./src/assests/fonts/Manrope-SemiBold.ttf'),
    ManropeBold: require('./src/assests/fonts/Manrope-Bold.ttf'),
  });
  if(!loaded){
    return <Text>Loading...</Text>
  }
  return <LoginScreen/>;
}

