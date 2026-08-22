import React from 'react'
import {View, TouchableOpacity,} from 'react-native';
import { Search } from 'lucide-react-native';
import AppTextInput from './AppTextInput';

export default function SearchBar ({ value, onChangeText, placeholder }) {
  return (
    <View
        style={{height:48,marginTop:16,flexDirection:'row',paddingHorizontal:16,alignItems:'center',justifyContent:'space-between'}}
    >
        <View
            style={{flex:1,backgroundColor:'#FFFFFF',height:48,flexDirection:'row',borderRadius:12,alignItems:'center',paddingHorizontal:12,borderColor:'#E5E7EB',borderWidth:1,marginRight:10,
                shadowColor:'#0F172A',shadowOffset:{width:0,height:2},shadowOpacity:0.04,shadowRadius:6,elevation:1}}
        >
            <Search size={16} color="#9CA3AF" />
            <AppTextInput
                placeholder={placeholder || 'Search...'}
                style={{flex:1,color:'#000000',fontSize:14,marginLeft:10}}
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="none"
                autoCorrect={false}
            />
        </View>
    </View>
  )
}
