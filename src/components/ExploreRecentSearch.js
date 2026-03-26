import React from 'react'
import {View, Text, Image,} from 'react-native';

export default function ExploreRecentSearch({courses}) {
  return (
    <View
        style={{marginTop:10,paddingHorizontal:16}}
    >
        {courses.map((item)=>(
            <View
                key={item.id}
                style={{
                    flexDirection:'row',
                    backgroundColor:'#FFFFFF',
                    borderColor:'#F0F0F0',
                    borderWidth:1,
                    borderRadius:6,
                    marginBottom:12,
                    alignItems:'center',
                    elevation:2
                }}
            >
                <Image source={item.image} 
                    style={{width:109,height:107,borderRadius:6}}
                />
                <View style={{flex:1,marginLeft:10}}>
                    <Text style={{fontFamily:'ManropeBold',fontSize:14,color:'#4D4D4D'}}>
                        {item.title}
                    </Text>
                    <Text style={{fontFamily:'ManropeRegular',fontSize:12,color:'#4D4D4D'}}>
                        {item.author}
                    </Text>
                
                <View style={{flexDirection:'row',marginTop:6,alignItems:'center'}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={require('../assests/StarIcon.png')}
                            style={{ width: 14, height: 14, marginRight: 4 }}
                        />

                        <Text style={{ color: '#666666', fontSize: 12 }}>
                            {item.rating}
                        </Text>

                        </View>
                    <Text style={{color:'#666666',fontFamily:'ManropeRegular',fontSize:12}}>
                        {' • '}
                        {item.duration}
                    </Text>
                    <Text style={{color:'#666666',fontFamily:'ManropeRegular',fontSize:12}}>
                        {' • '}
                        {item.students} students
                    </Text>
                </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:6}}>
                        <Text style={{color:'#4F46E5',fontFamily:'ManropeBold',fontSize:14,}}>
                            ${item.price}
                        </Text>
                        <Image 
                            style={{width:11,height:15,marginRight:10}}
                            source={require('../assests/RedSaveIcon.png')} 
                        />

                    </View>
                </View>
            </View>
        ))}
    </View>
  )
}
