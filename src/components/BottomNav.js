import React from 'react'
import { View,Image,Text,TouchableOpacity } from 'react-native'

export default function BottomNav  ({onSkip,onNext})  {
  return (
    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:10}}>
        <TouchableOpacity onPress={()=>console.log('skip1')}>
            <Text style={{color:'#FFFFFF',fontFamily:'ManropeRegular',fontSize:14}}>
                Skip
            </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>console.log('skip1')}
            style={{borderRadius:60,width:48,height:48,padding:12,backgroundColor:'#4F46E5',alignItems:'center',justifyContent:'center'}}    
        >
            <Image source={require('../assests/ArrowRight.png')} style={{color:'#FDFDFD',width:16,height:8}}/>
        </TouchableOpacity>
    </View>
  )
}
