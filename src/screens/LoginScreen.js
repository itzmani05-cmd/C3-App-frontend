import React,{useState} from 'react'
import {KeyboardAvoidingView,Platform,View, Image,Text, TextInput, TouchableOpacity,Alert,ScrollView, TouchableWithoutFeedback,Keyboard} from 'react-native';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { API_BASE_URL } from '../config/api';
import { saveSession } from '../utils/authStorage';
import { registerForDailyChallengePushNotifications } from '../utils/pushNotifications';

export default function LoginScreen({navigation}){
    const [showPassword, setShowPassword]=useState(false);
    const [submitting, setSubmitting]=useState(false);

    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    const handleLogin=async()=>{
        const normalizedEmail=email.trim().toLowerCase();
        const normalizedPassword=password.trim();

        if(!normalizedEmail || !normalizedPassword){
            Alert.alert("Login Failed","Enter both email and password");
            return;
        }

        setSubmitting(true);

        try{
            const res=await axios.post(`${API_BASE_URL}/api/auth/login`,{
                email: normalizedEmail,
                password: normalizedPassword
            });
            global.user=res.data;
            global.userId=res.data.userId;
            await saveSession(res.data);
            registerForDailyChallengePushNotifications(res.data.userId);
            navigation.replace('MainApp');
        }
        catch(err){
            console.log(err);
            Alert.alert(
                "Login Failed",
                err.response?.data?.message || "Unable to log in right now"
            );
        }
        finally{
            setSubmitting(false);
        }
    };

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: 20,
                    paddingTop: 40,
                    backgroundColor: '#F5F5F5'
                }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{backgroundColor:'#F5F5F5',flex:1,paddingTop:30}}>
                    <View style={{width: '100%',height: 245,alignItems: 'center',justifyContent: 'center',marginBottom: 50,marginTop:40}}>
                        <Image source={require('../assests/C3AppLogo.png')} 
                            style={{width:244,height:160, resizeMode:'contain',color:'#2563EB'}}
                        />
                        <Text style={{color:'#6B7280',fontFamily:'ManropeRegular',fontSize:12,marginTop:2}}>
                            Empowering Civil Engineers.
                        </Text>
                    </View>


                    <Text style={{fontFamily:'ManropeBold',fontSize:20,marginBottom:3,marginTop:50}}>
                        Welcome back!
                    </Text>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start',marginBottom:15}}>
                        <Text style={{color:'#6B7280', fontSize:14, fontFamily:'ManropeRegular'}}>
                            Student Login
                        </Text>
                    </View>

                    <View style={{
                            flexDirection:'row',
                            alignItems:'center',
                            borderWidth:1,
                            borderColor:'#D1D5DB',
                            borderRadius:6,
                            height:50,
                            paddingRight:16,
                            paddingLeft:16,
                            marginBottom:10,
                            backgroundColor:'#FFFFFF'
                        }}
                    >
                        <Mail size={20} color="#6B7280" style={{marginRight:1}} />
                        <TextInput 
                            placeholder='Email'
                            placeholderTextColor='#9CA3AF'
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize='none'
                            keyboardType='email-address'
                            style={{flex:1, padding:12,color:'#000000',fontFamily:'ManropeRegular'}}
                        /> 
                    </View>
                    
                    <View style={{
                            flexDirection:'row',
                            alignItems:'center',
                            borderWidth:1,
                            borderColor:'#D1D5DB',
                            borderRadius:6,
                            height:50,
                            paddingRight:16,
                            paddingLeft:16,
                            marginBottom:15,
                            backgroundColor:'#FFFFFF'
                        }}
                    >
                        <Lock size={20} color="#6B7280" style={{marginRight:1}} />
                        <TextInput
                            placeholder='Password'
                            placeholderTextColor='#9CA3AF'
                            value={password}
                            onChangeText={setPassword}
                            style={{flex:1, padding:12, color:'#000000',fontFamily:'ManropeRegular'}}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                            onPress={()=>setShowPassword(!showPassword)}
                        >
                            {showPassword
                                ? <EyeOff size={20} color="#6B7280" />
                                : <Eye size={20} color="#6B7280" />
                            }
                        </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity 
                        disabled={submitting}
                        onPress={handleLogin}
                        style={{
                            backgroundColor: submitting ? '#93C5FD' : '#2563EB',
                            paddingRight:32,
                            height:52,
                            paddingLeft:32,
                            borderRadius:6,
                            justifyContent:'center',
                            alignItems:'center',
                            marginTop:15,
                            marginBottom:15
                        }}
                    >
                        <Text style={{color:'#FFFFFF', textAlign:'center',lineHeight:24,letterSpacing:0, fontFamily:'ManropeMedium',fontSize:16,}}>
                            {submitting ? 'Logging in...' : 'Login'}
                        </Text>
                    </TouchableOpacity>
                
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    
  )
}
