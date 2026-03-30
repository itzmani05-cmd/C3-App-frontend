import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';

export default function SplashScreen({navigation}) {

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding1'); 
    },2000);
    return()=>clearTimeout(timer);
  }, []);

  return (
    <View style={{flex:1,alignItems:'center',justifyContent:'center',marginBottom:30}}>
      <Image source={require('../assests/logo.png')} 
        style={{width:244,height:66.25,resizeMode:'contain'}} 
      />
      <Text style={{color:'#1A1A1A',fontFamily:'ManropeRegular',fontSize:12,marginTop:5}}>
        Learn Skills. Grow Daily.
      </Text>
   </View>
  );
}