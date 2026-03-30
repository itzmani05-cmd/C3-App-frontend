import React,{useState} from 'react'
import {View, TextInput, TouchableOpacity, Image, Text} from 'react-native'

export default function VerifyYourAccount ({navigation}) {
    const [otp,setOtp]=useState(['0','0','0','0','0']);
  return (
    <View
        style={{flex:1,backgroundColor:'#F5F5F5',padding:20}}
    >
        <View style={{width:'100%',height:406,alignItems:'center',justifyContent:'center'}}>
            <Image source={require('../assests/logo.png')} 
                style={{width:244,height:66.25, resizeMode:'contain'}}
            />
            <Text style={{color:'#1A1A1A',fontFamily:'ManropeRegular',fontSize:12,marginTop:5}}>
                Learn Skills. Grow Daily.
                </Text>
            </View>
        <View  style={{marginTop:30}}>
            <View style={{marginTop:20}}>
                <Text style={{fontFamily:'ManropeBold',fontSize:20,color:'#1A1A1A'}}>
                    Verify Your Account
                </Text>
                <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#4D4D4D',marginTop:5}}>
                    Enter the verification code sent to 
                </Text>
                <View style={{flexDirection:'row',marginTop:5,}}>
                    <Text style={{color:'#4D4D4D',fontFamily:'ManropeRegular',fontSize:14,marginRight:8}}>
                        +91 9876543219 
                    </Text>
                    <Image 
                        source={require('../assests/EditIcon.png')}
                        style={{width:16,height:16,color:'#4F46E5'}}
                    />
                </View>
            </View>
            <View style={{marginTop:30}}>
                <View
                    style={{flexDirection:'row',gap:12}}
                >
                    {otp.map((digit,index)=>(
                        <TextInput 
                            key={index}
                            maxLength={1}
                            value={digit}
                            keyboardType='numeric'
                            style={{
                                width:41,
                                height:57,
                                color:'#FFFFFF',
                                borderRadius:8,
                                borderWidth:1,
                                textAlign:'center',
                                fontSize:14,
                                backgroundColor:'#FFFFFF',
                                borderColor:'#CCCCCC',
                                color:'#B3B3B3'
                            }}
                        />
                    ))}
                </View>
                <TouchableOpacity onPress={()=>navigation.replace('MainApp')} style={{backgroundColor:'#4F46E5', height:52,justifyContent:'center',alignItems:'center',borderRadius:10,width:'100%',marginTop:16}}>
                    <Text style={{fontFamily:'ManropeMedium',fontSize:16,color:'#FDFDFD'}}>
                        Verify
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
        <View style={{alignItems:'center',gap:4, marginTop:20 }}>
            <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#1A1A1A'}}>
                Didn't receive code?
            </Text>
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#1A1A1A'}}>
                    Resend{' '}
                </Text>
                <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#4F46E5'}}>
                    - 00 : 23
                </Text>
            </View>
        </View>
    </View>
  )
}
