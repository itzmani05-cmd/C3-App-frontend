

import React,{useState} from 'react'
import {View,Text, Image,TouchableOpacity,ScrollView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import OverViewCard from '../components/OverviewCard';
import CurriculumCard from '../components/CurriculumCard';
import { curriculumData } from '../data/curriculumData';
import ReviewCard from '../components/ReviewCard';
import { reviews } from '../data/curriculumData';

export default function MyCourseOverview() {
    const [activeTab,setActiveTab]=useState('Overview');
  return (
    <View style={{flex:1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
            <View >
                <Image
                    style={{height:294,width:'100%',}}
                 source={require('../assests/UIUXDesignPic.jpg')}/>
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 294 }}>

                   <LinearGradient colors={['rgba(79,70,229,0)', '#4F46E5']} locations={[0.6,0.8,1]} style={{position:'absolute',bottom:0,left:0,right:0,height:140}}>
                        <TouchableOpacity style={{position: 'absolute',
                            top: 40,
                            left: 16,
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: '#FFFFFF',
                            justifyContent: 'center',
                            alignItems: 'center',zIndex:10}}>
                            <Image style={{width:16,height:8 ,transform: [{ rotate: '180deg' }],}} source={require('../assests/ArrowRight.png')} />
                        </TouchableOpacity>
                        
                        <View style={{position:'absolute',bottom:70,left:16,paddingHorizontal:10,paddingVertical:4,borderRadius:60,backgroundColor:'#4F46E5',height:24,zIndex:5}}>
                            <Text style={{fontFamily:'ManropeRegular',fontSize:12,color:'#FFFFFF'}}>
                                Design
                            </Text>
                        </View>
                        <View style={{position:'absolute',bottom:20,left:16}}>
                            <Text style={{fontFamily:'ManropeExtraBold',fontSize:18,color:'#FFFFFF'}}>
                                Complete UI/UX Design Masterclass
                            </Text>
                            <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#FFFFFF'}}>
                                By Sarah Johnson
                            </Text>
                        </View>
                    </LinearGradient>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-around',borderColor:'#E6E6E6',borderWidth:1,backgroundColor:'#FFFFFF',height:48,alignItems:'center'}}>
                    <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#4D4D4D'}}>
                        4.8
                    </Text>
                    <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#4D4D4D'}}>
                        12.4k students
                    </Text>
                    <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#4D4D4D'}}>
                        24h 30m
                    </Text>
                    <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#4D4D4D'}}>
                        42 lessons
                    </Text>
                </View>
                <View style={{height:39,borderColor:'#E6E6E6',backgroundColor:'#FFFFFF',flexDirection:'row',justifyContent:'space-around',alignItems:'center',borderWidth:1}}>
                    {['Overview','Curriculum','Reviews'].map(tab=>(
                        <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
                            <Text style={{fontFamily:activeTab===tab?'ManropeBold':'ManropeRegular',fontSize:14,color:activeTab===tab?'#4F46E5':'#4D4D4D',borderBottomWidth:activeTab===tab?2:0,borderColor:'#4F46E5'}}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}   
                </View>
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
                style={{
                    backgroundColor:'#4F46E5',
                    height:52,
                    borderRadius:6,
                    paddingVertical:12,
                    paddingHorizontal:24,
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
