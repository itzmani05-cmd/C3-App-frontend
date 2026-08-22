import React from 'react';
import { View, Text, Image } from 'react-native';

export default function SplashScreen({navigation}) {

  return (
    <View style={{flex:1,alignItems:'center',justifyContent:'center',marginBottom:30}}>
      <Image source={require('../assests/C3AppLogo.png')} 
        style={{width:244,height:66.25,resizeMode:'contain'}} 
      />
      <Text style={{color:'#000000',fontFamily:'ManropeRegular',fontSize:12,marginTop:5}}>
        Learn Skills. Grow Daily.
      </Text>
   </View>
  );
}
