import React,{useState} from 'react'
import {View,TouchableOpacity,TextInput,Text,Image,Alert,ActivityIndicator} from 'react-native';
import axios from 'axios';
import { Lock, Eye, EyeOff } from 'lucide-react-native';
import { API_BASE_URL } from '../config/api';

export default function ResetPasswordScreen({navigation}) {
    const [showOldPassword,setShowOldPassword]=useState(false);
    const [showPassword,setShowPassword]=useState(false);
    const [showConfirm,setShowConfirm]=useState(false);
    const [oldPassword,setOldPassword]=useState('');
    const [newPassword,setNewPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
    const [loading,setLoading]=useState(false);

    const userId = global.userId || global.user?.userId;

    const handleResetPassword = async () => {
        if(!oldPassword||!newPassword||!confirmPassword){
            Alert.alert('Error','Please fill in all fields');
            return;
        }

        if(newPassword!==confirmPassword){
            Alert.alert('Error','New password and confirm password do not match');
            return;
        }

        if(newPassword.length<6){
            Alert.alert('Error','Password must be at least 6 characters long');
            return;
        }

        if(!userId){
            Alert.alert('Error','User not authenticated');
            return;
        }

        setLoading(true);
        try{
            const response=await axios.post(
                `${API_BASE_URL}/api/auth/change-password`,
                {oldPassword,newPassword},
                {headers:{userid:userId}}
            );
            Alert.alert('Success',response.data?.message||'Password changed successfully',[
                {text:'OK',onPress:()=>navigation.goBack()}
            ]);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }catch(err){
            const message=err.response?.data?.message||'Failed to change password';
            Alert.alert('Error',message);
        }finally{
            setLoading(false);
        }
    };

  return (
    <View style={{flex:1,padding:20,backgroundColor:'#F5F5F5'}}>
        <View style={{flex:1,alignItems:'center',justifyContent:'center',marginBottom:10}}>
            <Image source={require('../assests/C3AppLogo.png')} 
                style={{width:244,height:160, resizeMode:'contain',color:'#2563EB'}} 
            />
            <Text style={{color:'#6B7280',fontFamily:'ManropeRegular',fontSize:12,marginTop:5}}>
                Empowering Civil Engineers.
            </Text>
        </View>
        <View style={{marginTop:10,flex:1}}>
            <Text style={{color:'#000000',fontFamily:'ManropeBold',fontSize:20}}>
                Reset Password
            </Text>
            <Text style={{color:'#6B7280',fontFamily:'ManropeRegular',marginTop:5,fontSize:14}}>
                At least 6 characters.
            </Text>
            
            <View>
                <View>
                    <View style={{
                        flexDirection:'row',
                        alignItems:'center',
                        borderWidth:1,
                        borderColor:'#D1D5DB',
                        borderRadius:8,
                        height:50,
                        paddingRight:16,                                
                        paddingLeft:16,
                        marginBottom:10,
                        backgroundColor:'#FFFFFF',
                        marginTop:30
                        }}
                    >
                        <Lock size={20} color="#6B7280" />
                        <TextInput
                            placeholder='Old Password'
                            placeholderTextColor='#9CA3AF'
                            style={{flex:1, padding:12, color:'#000000',fontFamily:'ManropeRegular'}}
                            secureTextEntry={!showOldPassword}
                            value={oldPassword}
                            onChangeText={setOldPassword}
                        />
                        <TouchableOpacity
                            onPress={()=>setShowOldPassword(!showOldPassword)}
                        >
                            {showOldPassword
                                ? <EyeOff size={20} color="#6B7280" />
                                : <Eye size={20} color="#6B7280" />
                            }
                        </TouchableOpacity>
                    </View>
                     <View style={{
                        flexDirection:'row',
                        alignItems:'center',
                        borderWidth:1,
                        borderColor:'#D1D5DB',
                        borderRadius:8,
                        height:50,
                        paddingRight:16,                                
                        paddingLeft:16,
                        marginBottom:10,
                        backgroundColor:'#FFFFFF'
                        }}
                    >
                        <Lock size={20} color="#6B7280" />
                        <TextInput
                            placeholder='New Password'
                            placeholderTextColor='#9CA3AF'
                            style={{flex:1, padding:12, color:'#000000',fontFamily:'ManropeRegular'}}
                            secureTextEntry={!showPassword}
                            value={newPassword}
                            onChangeText={setNewPassword}
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
                    <View style={{
                            flexDirection:'row',
                            alignItems:'center',
                            borderWidth:1,
                            borderColor:'#D1D5DB',
                            borderRadius:8,
                            height:50,
                            paddingRight:16,
                            paddingLeft:16,
                            marginBottom:15,
                            backgroundColor:'#FFFFFF'
                        }}
                    >
                        <Lock size={20} color="#6B7280" />
                        <TextInput
                            placeholder='Confirm Password'
                            placeholderTextColor='#9CA3AF'
                            style={{flex:1, padding:12, color:'#000000',fontFamily:'ManropeRegular'}}
                            secureTextEntry={!showConfirm}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        <TouchableOpacity
                            onPress={()=>setShowConfirm(!showConfirm)}
                        >
                            {showConfirm
                                ? <EyeOff size={20} color="#6B7280" />
                                : <Eye size={20} color="#6B7280" />
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity 
                    style={{backgroundColor:'#2563EB',height:52,borderRadius:6,marginTop:15,alignItems:'center',justifyContent:'center',}}
                    onPress={handleResetPassword}
                    disabled={loading}
                >
                    {loading?(
                        <ActivityIndicator color="#FFFFFF"/>
                    ):(
                        <Text style={{color:'#FFFFFF',fontSize:16,fontFamily:'ManropeMedium'}}>Reset Password</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    </View>
  )
}

