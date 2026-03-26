import React from 'react'
import {View, Text, ImageBackground, TouchableOpacity} from 'react-native';
import ProgressBar from '../constants/ProgressBar';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNav from '../components/BottomNav';

export default function Onboarding2 ({navigation}) {
  return (
        <ImageBackground
            source={require('../assests/onBoardScreenPics/onBoardScreen2.jpg')}
            style={{flex:1,width:'100%',height:'100%'}}
            resizeMode='cover'
        >
            <ProgressBar step={2}/>
            <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)'}}>
                <LinearGradient 
                    style={{flex:1,justifyContent:'flex-end'}}
                    colors={['transparent','#000']}
                    locations={[0.55,1]}
                >
                    <View style={{padding:20}}>
                        <View style={{marginBottom:10,width:264}}>
                            <Text style={{color:'#FFFFFF',fontFamily:'ManropeExtraBold',fontSize:44,lineHeight: 50}}>
                                Learn at
                            </Text>
                            <Text style={{color:'#7F79EC',fontFamily:'ManropeExtraBold',fontSize:44,lineHeight: 50}}>
                                Your Own
                            </Text>
                            <Text style={{color:'#7F79EC',fontFamily:'ManropeExtraBold',fontSize:44,lineHeight: 50}}>
                                Pace
                            </Text>
                            <Text style={{color:'#FFFFFF',fontFamily:'ManropeRegular',fontSize:14,marginTop:10,lineHeight:20}}>
                                Access lessons anytime and track{"\n"}your progress.
                            </Text>
                        </View>
                       
                         <BottomNav onSkip={()=>console.log("Skip1")}
                            onNext={()=>console.log('next1')}
                        />
                        
                    </View>
                </LinearGradient>
            </View>
        </ImageBackground>
  )
}
