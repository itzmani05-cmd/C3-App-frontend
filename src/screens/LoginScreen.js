import React,{useState} from 'react'
import {View, Image,Text, TextInput, TouchableOpacity} from 'react-native';

export default function LoginScreen({navigation}){
    const [showPassword, setShowPassword]=useState(false);
    const [remember, setRemember]=useState(false);
  return (
    <View
        style={{paddingHorizontal:20,paddingTop:60,backgroundColor:'#F5F5F5',flex:1,}}
    >
        <View style={{width: '100%',height: 245,alignItems: 'center',justifyContent: 'center',marginBottom: 30}}>
            <Image source={require('../assests/logo.png')} 
                style={{width:244,height:48, resizeMode:'contain',color:'#4F46E5'}}
            />
            <Text style={{color:'#1A1A1A',fontFamily:'ManropeRegular',fontSize:12,marginTop:5}}>
                Learn Skills. Grow Daily.
            </Text>
        </View>

        <Text style={{fontSize:22,fontWeight:'bold',fontFamily:'ManropeBold',fontSize:20}}>
            Welcome back!
        </Text>
        <Text style={{color:'#4D4D4D', marginBottom:20, fontSize:14, fontFamily:'ManropeRegular'}}>
            Sign in to continue learning
        </Text>  
        <View style={{
                flexDirection:'row',
                alignItems:'center',
                borderWidth:1,
                borderColor:'#ddd',
                borderRadius:6,
                height:50,
                paddingRight:16,
                paddingLeft:16,
                marginBottom:15,
                backgroundColor:'#fff'
            }}
        >
            <Image 
                source={require('../assests/EmailIcon.png')} 
                style={{width:20,height:20,marginRight:10}}
            />
            <TextInput 
                placeholder='Email ID / Phone No'
                style={{
                    flex:1, padding:12, color:'#B3B3B3'
                }}
            /> 
        </View>
         
        <View style={{
                flexDirection:'row',
                alignItems:'center',
                borderWidth:1,
                borderColor:'#ddd',
                borderRadius:6,
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
                    style={{width:20, height:20,marginRight:10}}
                
                />
            </TouchableOpacity>
        </View>
        <View  
            style={{flexDirection:'row',justifyContent:'space-between', marginBottom:20}}
        >
            <TouchableOpacity onPress={()=>setRemember(!remember)}
                style={{flexDirection:'row',alignItems:'center',gap:10}}
            >
                <Image 
                    source={remember
                        ?require('../assests/CheckBoxOpen.png')
                        :require('../assests/CheckBoxClosed.png')
                    } 
                    style={{width:24, height:24}}    
                />
                <Text style={{fontFamily:'ManropeRegular',fontSize:14,lineHeight:20}}>
                    Remember Me
                </Text>
            </TouchableOpacity>
            <Text style={{color:'#4F46E5', fontFamily:'ManropeRegular',fontSize:14,lineHeight:20}}>
                Forgot password?
            </Text>
        </View>
        <TouchableOpacity
            style={{backgroundColor:'#4F46E5', paddingRight:32, height:52, paddingLeft:32,  borderRadius:6,justifyContent:'center', alignItems:'center'}}
        >
            <Text style={{color:'#fff', textAlign:'center',lineHeight:24,letterSpacing:0, fontFamily:'ManropeMedium',fontSize:16}}>
                Login
            </Text>
        </TouchableOpacity>
        <View
            style={{flexDirection:'row', alignItems:'center',marginVertical:20}}
        >
            <View style={{flex:1, height:1,backgroundColor:'#ddd'}} />
            <Text style={{color:'#777',marginHorizontal:10}}>or</Text>
            <View style={{flex:1,height:1,backgroundColor:'#ddd'}}/>
        </View>
        <View 
            style={{flexDirection:'row',justifyContent:'center',gap:20}}
        >
            <Image source={require('../assests/socialMediaLogos/GoogleIcon.png')} style={{width:50, height:50}}/>
            <Image source={require('../assests/socialMediaLogos/AppleIcon.png')} style={{width:50, height:50}}/>
            <Image source={require('../assests/socialMediaLogos/MailIcon.png')} style={{width:50, height:50}}/>
        </View>
        <View
            style={{flexDirection:'row',justifyContent:'center',marginTop:20}}
        >
            <Text style={{fontSize:14,color:'#000', fontFamily:'ManropeRegular'}}>Don't have an account? </Text>
            <TouchableOpacity onPress={()=>navigation.navigate('SIgnUp')}>
                <Text style={{color:'#4F46E5',fontSize:14,color:'#4F46E5',fontFamily:'ManropeSemiBold' }}>{' '}Sign up</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}
