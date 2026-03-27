import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import Header from '../components/Header';
import {courses} from '../data/ExploreData';
import {CourseCard} from '../components/CourseCard';

export default function MyCourse(){
    const [activeTab,setActiveTab]=useState('All');

    const filteredCourses=activeTab==="All"?courses:courses.filter((c)=>c.status===activeTab);
    return(
        <View style={{flex:1}}>
            <Header 
                title="My Courses"
                showBack={true}
            />
            <View style={{flexDirection:'row',padding:16}}>
                {[
                    { label: 'All', count:0},
                    { label: 'In Progress', count: 0 },
                    { label: 'Completed', count: 0},
                ].map((tab)=>{
                    const isActive=activeTab===tab.label;
                    return(
                        <TouchableOpacity
                            key={tab.label}
                            onPress={()=>setActiveTab(tab.label)}
                            style={{
                                borderRadius:4,
                                height:32,
                                marginRight:10,
                                paddingVertical:8,
                                paddingHorizontal:16,
                                borderColor:'#E5E7EB',
                                backgroundColor:isActive?'#4F46E5':'#FFFFFF'
                            }}
                        >
                            <Text style={{color:isActive?'#FFFFFF':'#4D4D4D'}}>
                                {tab.label} ({tab.count})
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
            {filteredCourses.length===0?(
                <View style={{flex:1,justifyContent:'center',alignItems:'center',paddingHorizontal:40}}>
                    <Image 
                        style={{width:64,height:64,marginBottom:16}}
                        source={require('../assests/CourseIcon.png')}
                    />
                    <Text style={{fontFamily:'ManropeBold',fontSize:16,color:'#4D4D4D'}}>
                        No courses found
                    </Text>
                    <Text style={{fontSize:14,fontFamily:'ManropeRegular',color:'#4D4D4D',marginTop:6}}>
                        You don't have any courses in progress
                    </Text>
                    <TouchableOpacity
                        style={{backgroundColor:'#4F46E5',height:52,borderRadius:6,paddingHorizontal:24,paddingVertical:12,marginTop:20}}
                    >
                        <Text style={{fontFamily:'ManropeMedium',fontSize:16,color:'#FFFFFF'}}>
                            Browse Courses
                        </Text>
                    </TouchableOpacity>
                </View>
            ):(
                <ScrollView>
                    {filteredCourses.map((item,index)=>(
                        <CourseCard key={index} item={item} />
                    ))}
                </ScrollView>
            )}
        </View>
    )
}