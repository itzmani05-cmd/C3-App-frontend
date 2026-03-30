import React,{useState} from 'react'
import {View,TouchableOpacity,TextInput,Text,Image} from 'react-native';

export default function ResetPasswordScreen({navigation}) {
    const [showPassword,setShowPassword]=useState(false);
    const [showConfirm,setShowConfirm]=useState(false);

  return (
    <View style={{flex:1,padding:20,backgroundColor:'#f5f5f5'}}>
        <View style={{flex:1,alignItems:'center',justifyContent:'center',marginBottom:60}}>
            <Image source={require('../assests/logo.png')} 
                style={{width:244,height:89,resizeMode:'contain'}} 
            />
            <Text style={{color:'#1A1A1A',fontFamily:'ManropeRegular',fontSize:12,marginTop:5}}>
                Learn Skills. Grow Daily.
            </Text>
        </View>
        <View style={{marginTop:40,flex:1}}>
            <Text style={{color:'#1A1A1A',fontFamily:'ManropeBold',fontSize:20}}>
                Reset Password
            </Text>
            <Text style={{color:'#4D4D4D',fontFamily:'ManropeRegular',marginTop:5,fontSize:14}}>
                At least 9 characters with uppercase and lowercase letters
            </Text>
            
            <View>
                <View>
                     <View style={{
                        flexDirection:'row',
                        alignItems:'center',
                        borderWidth:1,
                        borderColor:'#ddd',
                        borderRadius:8,
                        height:50,
                        paddingRight:16,                                
                        paddingLeft:16,
                        marginBottom:10,
                        backgroundColor:'#fff',
                        marginTop:30
                        }}
                    >
                        <Image source={require('../assests/PasswordKey.png')}  
                            style={{width:20,height:20}}
                        />
                        <TextInput 
                            placeholder='Password'
                            style={{flex:1, padding:12, color:'#B3B3B3'}}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                            onPress={()=>setShowPassword(!showPassword)}
                        >
                            <Image source={showPassword
                                    ?require('../assests/PasswordKey.png')
                                    :require('../assests/PasswordSecretIcon.png')
                                }
                                style={{width:20, height:20}}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{
                            flexDirection:'row',
                            alignItems:'center',
                            borderWidth:1,
                            borderColor:'#ddd',
                            borderRadius:8,
                            height:50,
                            paddingRight:16,
                            paddingLeft:16,
                            marginBottom:15,
                            backgroundColor:'#fff'
                        }}
                    >
                        <Image source={require('../assests/PasswordKey.png')}  
                            style={{width:20,height:20}}
                        />
                        <TextInput 
                            placeholder='Confirm Password'
                            style={{flex:1, padding:12, color:'#B3B3B3'}}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                            onPress={()=>setShowPassword(!showPassword)}
                        >
                            <Image source={showPassword
                                    ?require('../assests/PasswordKey.png')
                                    :require('../assests/PasswordSecretIcon.png')
                                }
                                style={{width:20, height:20}}
                            />
                        </TouchableOpacity>         
                    </View>
                </View>
                <TouchableOpacity style={{backgroundColor:'#4F46E5',height:52,borderRadius:6,marginTop:15,alignItems:'center',justifyContent:'center',}}>
                    <Text style={{color:'#FDFDFD',fontSize:16,fontFamily:'ManropeMedium'}}>Reset Password</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  )
}
