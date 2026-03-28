import React from 'react'
import {View,Text,Image,} from 'react-native';

export default function ReviewCard ({section}) {
  return (
    <View style={{marginBottom:16,padding:16,backgroundColor:'#FFFFFF',borderRadius:6,borderColor:'#F0F0F0',borderWidth:1}}>
        <View style={{flexDirection:'row',alignItems:'center',marginBottom:8}}>
            <View style={{width:30,height:30,borderRadius:60,backgroundColor:'#4F46E5',justifyContent:'center',alignItems:'center',marginRight:12}}>
                <Text style={{fontFamily:'ManropeMedium',fontSize:14,color:'#FFFFFF'}}>{section.name[0]}</Text>
            </View>
            <View>
                <View>
                    <Text style={{fontFamily:'ManropeBold',fontSize:16,color:'#4D4D4D'}}>
                        {section.name}
                    </Text>
                    <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#808080'}}>
                        {section.date}
                    </Text>
                </View>
                <Text>{'⭐'.repeat(section.rating)}</Text>
            </View>
        </View>
        <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#666666'}}>
            {section.comment}
        </Text>
    </View>
  )
}
