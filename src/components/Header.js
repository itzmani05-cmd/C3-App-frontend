import React from 'react';
import {View, Text, Image,TouchableOpacity} from 'react-native';

const Header=({title, showBack})=>{
    return (
        <View 
            style={{height:100,paddingTop:50,       
                paddingBottom:18,       
                paddingHorizontal:16,   
                backgroundColor:'#FFFFFF',
                borderBottomWidth:1,    
                borderColor:'#E6E6E6',
                justifyContent:'center',
                flexDirection:'row',
                alignItems:'center'
            }}
        >
            {showBack&&(
                <TouchableOpacity
                    style={{
                        position:'absolute',
                        left:16,  
                        width:30,
                        height:30,
                        bottom:20,
                        justifyContent:'center',
                        alignItems:'center'
                    }}
                >
                    <Image source={require('../assests/ArrowLeftBlack.png')} 
                        style={{width:16,height:8}}
                    />
                </TouchableOpacity>
            )}
            <Text style={{fontFamily:'ManropeExtraBold',fontSize:16,color:'#1A1A1A',textAlign:'center'}}>
                {title}
            </Text>    
        </View>
    )
}

export default Header;