import React from 'react'
import {View, Text, Image, TouchableOpacity} from 'react-native';

export const CourseCard = ({item,navigation}) => {
  return (
    <TouchableOpacity
        activeOpacity={0.7}
        onPress={()=>navigation.navigate('MyCourseOverview')}
        style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 10,
            paddingHorizontal: 12,
            marginBottom: 14,
            borderWidth: 1,
            borderColor: '#F0F0F0',
            overflow:'hidden'
        }}
    >
        <View>
            <Image source={require('../assests/courses/MyCoursePic.jpg')}
                style={{width:'100%',height:104,borderRadius:4}}
            />
            <Image source={require('../assests/RedSaveIcon.png')}
                style={{width:16,height:16,position:'absolute',top:10,right:10}}
            />
        </View>
        <View style={{padding:12,marginTop:1}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'}}>
                <View>
                    <Text style={{fontFamily:'ManropeBold',fontSize:14,color:'#4D4D4D',}}>
                        {item.title}
                    </Text>
                    <Text style={{fontFamily:'ManropeRegular',fontSize:12,color:'#4D4D4D',marginTop:2}}>
                        {item.author}
                    </Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',marginTop:4}}>
                    <Text style={{color:'#F59E0B'}}>⭐</Text>
                    <Text style={{color:'#4D4D4D',fontFamily:'ManropeRegular',fontSize:12,marginRight:4,marginLeft:2}}>
                        {item.rating}
                    </Text>
                    <Text style={{color:'#4D4D4D',fontFamily:'ManropeRegular',fontSize:12}}>
                        • {item.time}
                    </Text>
                </View>
            </View>
            <View
                style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
            
                marginTop: 8,
                }}
            >
                <Text style={{ fontSize: 12, color: '#6B7280' }}>
                    {item.lessons}/{item.totalLessons} lessons
                </Text>

                <Text style={{ fontSize: 12, color: '#4F46E5' }}>
                    {item.progress}%
                </Text>
            </View>
            <View
                style={{
                    height:5,
                    marginTop:4,
                    borderRadius:60,
                    backgroundColor:'#E5E7EB'
                }}
            >
                <View 
                    style={{
                        width:`${item.progress}%`,
                        height:5,
                        backgroundColor:'#4F46E5',
                        borderRadius:3
                    }}
                />
            </View>
                <TouchableOpacity style={{backgroundColor:'#D4D2F9',height:52,borderRadius:6,marginTop:12,alignItems:'center',justifyContent:'center'}}>
                    <Text style={{color:'#4F46E5',fontFamily:'ManropeMedium',fontSize:16}}>
                        Continue Learning
                    </Text>
                </TouchableOpacity>
        </View>
        
    </TouchableOpacity>
  )
}
