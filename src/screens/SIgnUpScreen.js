import React,{useState} from 'react'
import {View, Text, TextInput, TouchableOpacity,Image} from 'react-native'

export default function SIgnUpScreen ({navigation}) {
    const [agree, setAgree] =useState(false);
    const [showPassword, setShowPassword]=useState(false);
  return (
    <View style={{flex:1,padding:20,justifyContent:'center',backgroundColor:'#F5F5F5'}}>
        <View style={{width:'100%',height:183,alignItems:'center',justifyContent:'center',marginBottom:30}}>
            <Image source={require('../assests/logo.png')} 
                style={{width:244,height:66.25,resizeMode:'contain'}} 
            />
            <Text style={{color:'#1A1A1A',fontFamily:'ManropeRegular',fontSize:12,marginTop:5}}>
                Learn Skills. Grow Daily.
            </Text>
        </View>
        <Text style={{fontFamily:'ManropeBold',fontSize:20,fontWeight:700}}>
            Sign Up
        </Text>
        <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#4D4D4D',marginBottom:20}}>
            Sign up to start learning
        </Text>
        <View>
            <View style={{
                flexDirection:'row',
                    alignItems:'center',
                    borderWidth:1,
                    borderColor:'#ddd',
                    borderRadius:0,
                    height:50,
                    paddingRight:16,
                    paddingLeft:16,
                    marginBottom:15,
                    backgroundColor:'#fff'
            }}>
                <Image
                    source={require('../assests/userIcon.png')}
                    style={{width:20,height:20}}
                />
                <TextInput
                    placeholder='Full name'
                    style={{ flex:1,padding:12, color:'#B3B3B3'}}
                />
            </View>
            <View style={{
                flexDirection:'row',
                    alignItems:'center',
                    borderWidth:1,
                    borderColor:'#ddd',
                    borderRadius:0,
                    height:50,
                    paddingRight:16,
                    paddingLeft:16,
                    marginBottom:15,
                    backgroundColor:'#fff'
            }}>
                <Image
                    source={require('../assests/EmailIcon.png')}
                    style={{width:20,height:20}}
                />
                <TextInput
                    placeholder='Email'
                    style={{padding:12, color:'#B3B3B3'}}
                />
            </View>
            <View style={{
                flexDirection:'row',
                    alignItems:'center',
                    borderWidth:1,
                    borderColor:'#ddd',
                    borderRadius:0,
                    height:50,
                    paddingRight:16,
                    paddingLeft:16,
                    marginBottom:15,
                    backgroundColor:'#fff'
            }}>
                <Image
                    source={require('../assests/PhoneIcon.png')}
                    style={{width:20,height:20}}
                />
                <TextInput
                    placeholder='Phone number'
                    style={{padding:12, color:'#B3B3B3'}}
                />
            </View>
            <View style={{
                    flexDirection:'row',
                    alignItems:'center',
                    borderWidth:1,
                    borderColor:'#ddd',
                    borderRadius:0,
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
                    borderRadius:0,
                    height:50,
                    paddingRight:16,
                    paddingLeft:16,
                    marginBottom:15,
                    backgroundColor:'#fff'
                }}
            >
                <Image source={require('../assests/PasswordKey.png')}  
                    style={{width:20,height:20,marginRight:10}}
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
        <TouchableOpacity
            onPress={()=>setAgree(!agree)}
            style={{flexDirection:'row',alignItems:'center',marginBottom:20}}
        >
            <Image 
                source={agree?require('../assests/CheckBoxOpen.png'):require('../assests/CheckBoxClosed.png')}
                style={{width:24,height:24,marginRight:8}}
            />
            <Text style={{fontFamily:'ManropeRegular',fontSize:14}}>
                Accept Terms & Conditions
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={{backgroundColor:'#4F46E5',height:50,borderRadius:10,justifyContent:'center',alignItems:'center'}}
        >
            <Text style={{color:'#FDFDFD',fontSize:16,fontFamily:'ManropeMedium'}}>
                Create Account
            </Text>
        </TouchableOpacity>
        <View
            style={{flexDirection:'row',justifyContent:'center',marginTop:20}}
        >
            <Text style={{fontSize:14,color:'#000', fontFamily:'ManropeRegular'}}>Already have an account? </Text>
            <TouchableOpacity onPress={()=>navigation.navigate('Login')}>
                <Text style={{color:'#4F46E5',fontSize:14,color:'#4F46E5',fontFamily:'ManropeSemiBold' }}>Login</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}
