import React from 'react'
import {View,Image,Text,TextInput, TouchableOpacity,} from 'react-native';

export default function SearchBar () {
  return (
    <View
        style={{height:48,width:358,marginTop:16,flexDirection:'row',marginHorizontal:16}}
    >
        <View
            style={{flex:1,backgroundColor:'#FFFFFF',height:48,flexDirection:'row',borderRadius:6,width:300,alignItems:'center',paddingLeft:10,borderColor:'#CCCCCC',borderWidth:1}}
        >
            <Image source={require('../assests/SearchIcon.png')}
                style={{width:16,height:16,}}
            />
            <TextInput
                placeholder='Search...'
                style={{flex:1,color:'4D4D4D',fontFamily:'ManropeRegular',fontSize:14,marginLeft:10}}

            />
        </View>
        <TouchableOpacity
            style={{width:48,height:48,borderRadius:6,backgroundColor:'#4F46E5',alignItems:'center',justifyContent:'center'}}
        >
            <Image 
                source={require('../assests/FilterIcon.png')}
                style={{width:18,height:16}}
            />
        </TouchableOpacity>
    </View>
  )
}
