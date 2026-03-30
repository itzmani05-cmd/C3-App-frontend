import React from 'react'
import {View, Text, Switch, Image, TouchableOpacity} from 'react-native';

export default function Row({icon, title, subtitle, onPress,isSwitch, value, onValueChange,isLast,}) {
  return (
    <TouchableOpacity 
        onPress={isSwitch?null:onPress}
        activeOpacity={0.7}
        style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:16,borderBottomWidth:isLast?0:0.5,gap:10,borderColor:'#E5E5E5'}}
    >
        <View style={{flexDirection:'row',alignItems:'center'}}>
            <Image style={{width:14,height:16}} source={icon} />
            <View style={{marginLeft:10,}}>
                <Text style={{fontFamily:'ManropeBold',fontSize:14,color:'#4D4D4D',marginBottom:2}}>{title}</Text>
                {subtitle&& <Text style={{color:'#4D4D4D',fontFamily:'ManropeRegular',fontSize:12}}>{subtitle}</Text>}
            </View>
        </View>
        {isSwitch
            ?<Switch value={value} onValueChange={onValueChange} />
            :<Image style={{width:20,height:20,}} source={require('../assests/ArrowRightBlack.png')}/>
        }
    </TouchableOpacity>
  )
}
