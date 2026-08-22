import React from 'react'
import { View,TouchableOpacity } from 'react-native'
import { ArrowRight } from 'lucide-react-native'
import AppText from './AppText'

export default function BottomNav  ({onSkip,onNext})  {
  return (
    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:10}}>
        <TouchableOpacity onPress={onSkip} activeOpacity={0.7} hitSlop={{top:10,bottom:10,left:10,right:10}}>
            <AppText variant="semiBold" style={{color:'#FFFFFF',fontSize:14}}>
                Skip
            </AppText>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNext}
            activeOpacity={0.85}
            style={{
                borderRadius:60,
                width:48,
                height:48,
                padding:12,
                backgroundColor:'#2563EB',
                alignItems:'center',
                justifyContent:'center',
                shadowColor:'#2563EB',
                shadowOffset:{width:0,height:4},
                shadowOpacity:0.3,
                shadowRadius:8,
                elevation:5,
            }}
        >
            <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
    </View>
  )
}

