import React,{useState} from 'react'
import {View, Text, Image,ScrollView, TouchableOpacity} from 'react-native';

export default function Category() {
    const [active, setActive]=useState('All');
    const categories=['All','Design','Programming','Marketing'];
  
    return (
        <View style={{marginTop:20}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10,paddingHorizontal:20,paddingLeft:15}}>
                <Text style={{color:'#4D4D4D',fontFamily:'ManropeBold',fontSize:14}}>
                    Categories
                </Text>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={{color:'#4F46E5',fontFamily:'ManropeRegular',fontSize:12,marginRight:4}}>
                        See all
                    </Text>
                    <Image 
                        source={require('../assests/ArrowRightBlue.png')}
                        style={{width:10,height:5}}
                    />
                </View>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal:16}}
            >
                {categories.map((item)=>{
                    const isActive=active===item;
                    return(
                        <TouchableOpacity
                            key={item}
                            onPress={()=>setActive(item)}
                            style={{borderColor:'#F0F0F0',marginRight:10,borderWidth:isActive?0:1,borderRadius:4,backgroundColor:isActive?'#4F46E5':'#FFFFFF',paddingVertical:8,paddingHorizontal:16,}}
                        >
                            <Text style={{color:isActive?'#FFFFFF':'#4D4D4D',fontFamily:'ManropeRegular',fontSize:14}}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>
    )
}
