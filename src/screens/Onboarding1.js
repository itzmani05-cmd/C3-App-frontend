import React from 'react'
import {View, Text, ImageBackground, TouchableOpacity} from 'react-native';
import ProgressBar from '../constants/ProgressBar';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNav from '../components/BottomNav';

export default function Onboarding1({navigation}) {
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
                        <View style={{marginBottom:10,width:264}}>
                            <Text style={{color:'#FFFFFF',fontFamily:'ManropeExtraBold',fontSize:44,lineHeight: 50}}>
                                Explore
                            </Text>
                            <Text style={{color:'#7F79EC',fontFamily:'ManropeExtraBold',fontSize:44,lineHeight: 50}}>
                                Thousands
                            </Text>
                            <Text style={{color:'#FFFFFF',fontFamily:'ManropeExtraBold',fontSize:44,lineHeight: 50}}>
                                of Courses
                            </Text>
                            <Text style={{color:'#FFFFFF',fontFamily:'ManropeRegular',fontSize:14,marginTop:10,lineHeight:20}}>
                                Find courses from experts across{"\n"}multiple industries.
                            </Text>
                        </View>
                       
                         <BottomNav onSkip={()=>navigation.replace("Login")}
                            onNext={()=>navigation.navigate("Onboarding2")}
                        />
                        
                    </View>
                </LinearGradient>
            </View>
        </ImageBackground>
  )
}
