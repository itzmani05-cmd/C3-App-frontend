import React from 'react'
import {View,Text} from 'react-native';

export default function ReviewCard ({section}) {
  return (
    <View style={{marginBottom:16,padding:16,backgroundColor:'#FFFFFF',borderRadius:6,borderColor:'#F0F0F0',borderWidth:1}}>
      <View style={{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'flex-start', 
        marginBottom:8
      }}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <View style={{
            width:32,height:32,borderRadius:16,backgroundColor:'#4F46E5',justifyContent:'center',alignItems:'center',marginRight:12
          }}>
            <Text style={{
              fontFamily:'ManropeMedium',
              fontSize:14,
              color:'#FFFFFF'
            }}>
              {section.name[0]}
            </Text>
          </View>

          <View>
            <Text style={{
              fontFamily:'ManropeBold',fontSize:14,color:'#4D4D4D'
            }}>
              {section.name}
            </Text>

            <Text style={{
              fontFamily:'ManropeRegular',fontSize:12,color:'#808080',marginTop:2
            }}>
              {section.time}
            </Text>
          </View>

        </View>
        <Text style={{
          color:'#F59E0B',
          fontSize:14
        }}>
          {'★'.repeat(section.rating)}
          {'☆'.repeat(5 - section.rating)}
        </Text>

      </View>

      <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#666666',lineHeight:20}}>
          {section.comment}   
        </Text>

    </View>
  )
}