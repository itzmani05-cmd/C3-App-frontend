import React from 'react'
import {View, Text} from 'react-native';

export default function Section ({title, children}){
  return (
    <View style={{marginBottom:20,paddingHorizontal:16}} >
        <Text style={{fontFamily:'ManropeBold',fontSize:14,color:'#4D4D4D',marginBottom:6}}>
            {title}
        </Text>
        <View style={{backgroundColor:'#FFFFFF',borderColor:'#F0F0F0',borderRadius:10,overflow:'hidden'}}>
            {children}
        </View>
    </View>
  )
}
