import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import axios from 'axios';
import { Mail, Lock } from 'lucide-react-native';
import { API_BASE_URL } from '../config/api';

export default function AddStudentScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCreate = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Error", "Please enter email and password");
        return;
      }

      const res = await axios.post(
        `${API_BASE_URL}/api/admin/create-student`,
        { email, password, role: 'student' }
      );

      Alert.alert(
        "Success!",
        `Email: ${res.data.email}\nPassword: ${res.data.password}`
      );

      setEmail('');
      setPassword('');

    } catch (err) {
      console.log(err);
      Alert.alert(
        "Error",
        err.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#D1D5DB',
            borderRadius: 6,
            height: 50,
            paddingHorizontal: 16,
            marginBottom: 10,
            marginTop:50,
            backgroundColor: '#FFFFFF'
          }}>
            <Mail size={20} color="#6B7280" />
            <TextInput
              placeholder='Email'
              placeholderTextColor='#9CA3AF'
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={{
                flex: 1,
                padding: 12,
                color: '#000000',
                fontFamily: 'ManropeRegular'
              }}
            />
          </View>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#D1D5DB',
            borderRadius: 6,
            height: 50,
            paddingHorizontal: 16,
            marginBottom: 20,
            backgroundColor: '#FFFFFF'
          }}>
            <Lock size={20} color="#6B7280" />
            <TextInput
              placeholder='Password'
              placeholderTextColor='#9CA3AF'
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              style={{
                flex: 1,
                padding: 12,
                color: '#000000',
                fontFamily: 'ManropeRegular'
              }}
            />
          </View>

          <TouchableOpacity
            onPress={handleCreate}
            style={{
              backgroundColor: '#2563EB',
              height: 52,
              borderRadius: 6,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text style={{
              color: '#FFFFFF',
              fontFamily: 'ManropeMedium',
              fontSize: 16
            }}>
              Create Student
            </Text>
          </TouchableOpacity>
        </View>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}