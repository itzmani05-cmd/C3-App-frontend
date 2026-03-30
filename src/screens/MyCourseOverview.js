

import React,{useState} from 'react'
import {View,Text, Image,TouchableOpacity,ScrollView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import OverViewCard from '../components/OverviewCard';
import CurriculumCard from '../components/CurriculumCard';
import { curriculumData } from '../data/curriculumData';
import ReviewCard from '../components/ReviewCard';
import { reviews } from '../data/curriculumData';

export default function MyCourseOverview({navigation}) {

    const [activeTab,setActiveTab]=useState('Overview');
  return (
    <View style={{flex:1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
            <View >
                <View style={{ height:240, width:'100%' }}>
                    <Image
                        source={require('../assests/UIUXDesignPic.jpg')}
                        style={{ width:'100%', height:'100%', position:'absolute' }}
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(79,70,229,0.9)']}
                        locations={[0.5, 1]}
                        style={{
                        flex:1,
                        paddingTop:60,
                        paddingHorizontal:16,
                        paddingBottom:16,
                        justifyContent:'space-between'
                        }}
                    >
                        <TouchableOpacity
                        style={{
                            width:30,
                            height:30,
                            borderRadius:60,
                            padding:2,
                            backgroundColor:'rgba(255,255,255,0.5)',
                            justifyContent:'center',
                            alignItems:'center'
                        }}
                        >
                        <Image
                            source={require('../assests/ArrowRight.png')}
                            style={{ width:24, height:24, transform:[{rotate:'180deg'}] }}
                        />
                    </TouchableOpacity>

                        <View style={{ width:'100%', justifyContent:'space-between' }}>
                        <View style={{
                            paddingVertical:4,
                            paddingHorizontal:10,
                            borderRadius:60,
                            backgroundColor:'#4F46E5',
                            alignSelf:'flex-start'
                        }}>
                            <Text style={{
                                color:'#FFFFFF',
                                fontSize:12,
                                fontFamily:'ManropeRegular'
                            }}>
                                 Design
                            </Text>
                        </View>
                        <View style={{ width:220, gap:4,marginTop:12 }}>

                            <Text style={{
                                fontFamily:'ManropeExtraBold',
                                fontSize:18,
                                lineHeight:24,
                                color:'#FFFFFF'
                            }}>
                                Complete UI/UX Design Masterclass
                            </Text>

                            <Text style={{
                                fontFamily:'ManropeRegular',
                                fontSize:14,
                                color:'#FFFFFF'
                            }}>
                                By Sarah Johnson
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>
                <View style={{paddinLeft:2,flexDirection:'row',justifyContent:'space-around',borderColor:'#E6E6E6',borderWidth:1,backgroundColor:'#FFFFFF',height:48,alignItems:'center',paddingLeft:12,paddingRight:2}}>
                    <View style={{marginLeft:10,flexDirection:'row',alignItems:'center'}}>
                        <Image source={require('../assests/StarIconFull.png')}/>
                        <Text style={{paddingLeft:4,fontFamily:'ManropeRegular',fontSize:12,color:'#4D4D4D'}}>
                            4.8
                        </Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image style={{width:16,height:16}} source={require('../assests/DoubleUser.png')}/>
                        <Text style={{paddingLeft:4,fontFamily:'ManropeRegular',fontSize:12,color:'#4D4D4D'}}>
                            12.4k students
                        </Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image source={require('../assests/ClockIcon.png')}/>
                        <Text style={{paddingLeft:4,fontFamily:'ManropeRegular',fontSize:12,color:'#4D4D4D'}}>
                            23h 30m
                        </Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image source={require('../assests/BookIconBlack.png')}/>
                        <Text style={{paddingLeft:4,fontFamily:'ManropeRegular',fontSize:12,color:'#4D4D4D'}}>
                            42 lessons
                        </Text>
                    </View>
                    
                </View>
                <View style={{height:48,borderColor:'#E6E6E6',backgroundColor:'#FFFFFF',flexDirection:'row',justifyContent:'space-between',paddingHorizontal:16,alignItems:'center',}}>
                    {['Overview','Curriculum','Reviews'].map(tab=>(
                        <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={{alignItems:'center',justifyContent:'center',flex:1}}>
                            <Text style={{fontFamily:activeTab===tab?'ManropeBold':'ManropeRegular',fontSize:14,color:activeTab===tab?'#4F46E5':'#4D4D4D'}}>
                                {tab}
                            </Text>
                            {activeTab===tab&&(
                                <View style={{marginTop:6,height:2,width:'60%',backgroundColor:'#4F46E5',borderRadius:2}} />
                            )}
                        </TouchableOpacity>
                    ))}   
                </View>
                <View style={{backgroundColor:'#FBFBFB'}}>
                    {activeTab==="Overview"&& <OverViewCard/>}
                    {activeTab==="Curriculum"&&
                        curriculumData.map((section,index)=>(
                            <CurriculumCard key={index} section={section} />
                        ))
                    }
                    {activeTab==="Reviews"&&
                        reviews.map((section,index)=>(
                            <ReviewCard key={index} section={section} />
                        ))
                    }
                </View>
                
            </View>
        </ScrollView> 
        <View style={{
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
            padding:16,
            backgroundColor:'#FFFFFF',
            borderTopWidth:1,
            borderColor:'#E6E6E6'
        }}>
            <View>
                <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#4D4D4D'}}>Price</Text>
                <Text style={{fontFamily:'ManropeExtraBold',fontSize:20,color:'#1A1A1A'}}>$ 49.99</Text>
            </View>
            <TouchableOpacity 
                onPress={()=>navigation.navigate('LessonScreen')}
                style={{
                    backgroundColor:'#4F46E5',
                    height:52,
                    borderRadius:6,
                    paddingVertical:14,
                    paddingHorizontal:32,
                    alignItems:'center'
                }}
            >
                <Text style={{color:'#FFFFFF',fontSize:16,fontFamily:'ManropeMedium',}}>
                    Enroll Now
                </Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}
