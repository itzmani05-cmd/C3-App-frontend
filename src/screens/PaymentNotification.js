import React from 'react'
import {View, Text,Image, ScrollView} from 'react-native';
import {notifications} from '../data/PHNotificationData';
import Header from '../components/Header';

export default function PaymentNotification () {
  return (
    <View >
        <Header 
            title="Notifications"
            showBack={true}
        />
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{paddingHorizontal:20,marginTop:16}}
        >
            <Text style={{color:"#4D4D4D",fontFamily:'ManropeBold',fontSize:14,marginBottom:18}}>
                Transaction History
            </Text>
            {notifications.map((item,index)=>(
                <View
                    key={index}
                    style={{
                        flexDirection:'row',
                        padding:14,
                        alignItems:'center',
                        height:82,
                        borderWidth:1,
                        backgroundColor:'#FFFFFF',
                        borderColor:'#F0F0F0',
                        borderRadius:10,

                    }}
                >
                    <Image source={item.icon} style={{width:16,height:16,marginRight:12,marginTop:4}}/>
                    <View style={{flex:1}}>
                        <Text style={{color:'#4D4D4D',fontFamily:'ManropeBold',fontSize:14,}}>
                            {item.title}
                        </Text>
                        <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#4D4D4D'}}>
                            {item.message}
                        </Text>
                        <Text style={{fontFamily:'ManropeRegular',fontSize:10,}}>
                            {item.time}
                        </Text>
                    </View>
                    <Image source={require('../assests/Dot.png')} 
                        style={{width:8,height:8,marginTop:-30,marginLeft:8}}
                    />
                </View>
            ))}
            
        </ScrollView>
    </View>
  )
}
