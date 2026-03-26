import React from 'react';
import {View, Text, Image,TouchableOpacity} from 'react-native';

const Header=({title, showBack})=>{
    return (
        <View 
            style={{height:80,flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:'#FFFFFF',borderColor:'#E6E6E6',padding:10}}
        >
            {showBack?(
                <TouchableOpacity style={{position:'absolute',left:20}}>
                    <Image source={require('../assests/ArrowLeftBlack.png')} 
                        style={{width:16,height:8}}
                    />
                </TouchableOpacity>
            ):(
                <View><Text>back</Text></View>
            )}
            
            <Text style={{fontFamily:'ManropeExtraBold',fontSize:16,olor:'#1A1A1A'}}>
                {title}
            </Text>
        </View>
    )
}

export default Header;