import React from 'react'
import {View, Text, ImageBackground, TouchableOpacity} from 'react-native';
import ProgressBar from '../constants/ProgressBar';
import { LinearGradient } from 'expo-linear-gradient';

export default function Onboarding3 ({navigation}) {
  return (
        <ImageBackground
            source={require('../assests/onBoardScreenPics/onBoardScreen1.jpg')}
            style={{flex:1,width:'100%',height:'100%'}}
            resizeMode='cover'
        >
            <ProgressBar step={1}/>
            <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)'}}>
                <LinearGradient 
                    style={{flex:1,justifyContent:'flex-end'}}
                    colors={['transparent','#000']}
                    locations={[0.55,1]}
                >
                    <View style={{padding:20}}>
                        <View style={{marginBottom:20,width:264}}>
                            <Text style={{color:'#FFFFFF',fontFamily:'ManropeExtraBold',fontSize:44,lineHeight: 50}}>
                                Earn
                            </Text>
                            <Text style={{color:'#7F79EC',fontFamily:'ManropeExtraBold',fontSize:44,lineHeight: 50}}>
                                Certificates
                            </Text>
                            <Text style={{color:'#FFFFFF',fontFamily:'ManropeRegular',fontSize:14,marginTop:10,lineHeight:20}}>
                                Complete courses and receive{"\n"}verified certificates.
                            </Text>
                        </View>
                        <View>
                            <TouchableOpacity
                                onPress={()=>console.log('login')}
                                style={{backgroundColor:'#4F46E5',height:52,borderRadius:6,alignItems:'center',justifyContent:'center',marginTop:20,width:'100%'}}
                            >
                                <Text style={{fontFamily:'ManropeMedium',fontSize:16,color:'#FDFDFD',}}>
                                    Get Started
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>
            </View>
        </ImageBackground>
  )
}
