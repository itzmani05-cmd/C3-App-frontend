import React from 'react'
import { TouchableOpacity } from 'react-native';
import {Text,View,Image} from 'react-native';

export default function WishlistCard({item}) {
  return (
    <View style={{
      backgroundColor:'#FFFFFF',
      borderRadius:6,
      borderColor:'#F0F0F0',
      borderWidth:1,
      overflow:'hidden',
      
      marginHorizontal:16,marginTop:14
    }}>
        <Image  
          source={require('../assests/courses/DigitalMarketingPic.jpg')}
          style={{width:'100%',height:104}}  
        />
        <View>
          <View>
            <View style={{padding:14}}>
              <Text style={{fontFamily:'ManropeBold',fontSize:14,color:'#4D4D4D'}}>
                {item.title}
              </Text>
              <Text style={{fontFamily:'ManropeRegular',fontSize:12,color:'#4D4D4D'}}>
                {item.author}
              </Text>
            </View>

            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:12}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={{fontFamily:'ManropeRegular',fontSize:12,color:'#4D4D4D',marginRight:8}}>
                  ⭐ {item.rating}
                </Text>
                <Text style={{fontFamily:'ManropeRegular',fontSize:12,color:'#4D4D4D'}}>
                  {item.time}
                </Text>
              </View>
              <Text style={{fontFamily:'ManropeBold',fontSize:14,color:'#4F46E5'}}>
                $ {item.price}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor:'#4F46E5',
              marginHorizontal:14,
              borderRadius:6,
              marginTop:14,
              marginBottom:12,
              alignItems:'center',
              paddingVertical:10
            }}
          >
            <Text style={{fontFamily:'ManropeMedium',fontSize:16,color:'#FFFFFF'}}>
              Enroll Now
            </Text>
          </TouchableOpacity>
        </View>
    </View> 
  )
}
