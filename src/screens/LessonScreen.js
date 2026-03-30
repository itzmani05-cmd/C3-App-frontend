import React from 'react';
import {View, Text, TouchableOpacity, ScrollView,Image} from 'react-native';
export default function LessonScreen({navigation}) {
  return (
    <View style={{flex:1, backgroundColor:'#F9FAFB'}}>
      <ScrollView>
        <View style={{ height:240, width:'100%' }}>
            <View style={{position:'absolute',width:'100%',height:'100%',backgroundColor:'#999999',justifyContent:'center',alignItems:'center'
            }}>
                <View style={{backgroundColor:'#4F46E5',width:42,height:42,padding:6,borderRadius:60,justifyContent:'center',alignItems:'center'}}>
                    <Image 
                        style={{width:12,height:16}} 
                        source={require('../assests/PlayButtonIcon.png')} 
                    />
                </View>
            </View>

            <TouchableOpacity
                style={{position:'absolute',top:60,left:16,width:30,height:30,borderRadius:30,backgroundColor:'#FFFFFF',justifyContent:'center',alignItems:'center'}}
            >
                <Image
                    source={require('../assests/ArrowLeftBlack.png')}
                    style={{width:16,height:8}}
                />
            </TouchableOpacity>

        </View>

        <View style={{padding:16}}>
          <Text style={{color:'#4F46E5', fontSize:12}}>
            Module 1 • Lesson 2
          </Text>

          <Text style={{
            fontSize:16,
            fontFamily:'ManropeBold',
            marginTop:6,
            color:'#4D4D4D'
          }}>
            Design Thinking Process
          </Text>
          <Text style={{
            fontSize:14,
            color:'#666666',
            marginTop:6,
            lineHeight:20,
            fontFamily:'ManropeRegular'
          }}>
            Learn the five stages of design thinking: Empathize, Define,
            Ideate, Prototype, and Test. This methodology will transform how you approach design challenges.
          </Text>
          <View style={{
            marginTop:16,
            padding:10,
            borderRadius:6,
            borderWidth:1,
            borderColor:'#F0F0F0'
          }}>
            <View style={{
              flexDirection:'row',
              justifyContent:'space-between'
            }}>
              <Text style={{fontSize:12,fontFamily:'ManropeBold',color:'#4D4D4D'}}>Lesson Progress</Text>
              <Text style={{fontSize:12,fontFamily:'ManropeMedium', color:'#4F46E5'}}>65%</Text>
            </View>

            <View style={{
              height:6,
              backgroundColor:'#E5E7EB',
              borderRadius:10,
              marginTop:6
            }}>
              <View style={{
                width:'65%',
                height:6,
                backgroundColor:'#4F46E5',
                borderRadius:10
              }} />
            </View>
          </View>
          <TouchableOpacity style={{
            marginTop:16,
            height:50,
            borderRadius:6,
            borderWidth:1,
            borderColor:'#E5E5E5',
            justifyContent:'center',
            alignItems:'center',
            flexDirection:'row'
          }}>
            <Image style={{width:24,height:24}} source={require('../assests/GreenTick.png')} />
            <Text style={{marginLeft:8,fontFamily:'ManropeMedium',fontSize:16,color:'#1A1A1A'}}>Mark Complete</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{
            marginTop:12,
            height:50,
            borderRadius:6,
            backgroundColor:'#4F46E5',
            justifyContent:'center',
            alignItems:'center',
            flexDirection:'row'
          }}>
             <Image style={{width:24,height:24}} source={require('../assests/ForwardStep.png')} />
            <Text style={{
              color:'#FFFFFF',
              marginLeft:8,
              fontSize:16,
              fontFamily:'ManropeMedium'
            }}>
              Next Lesson
            </Text>
          </TouchableOpacity>

          <Text style={{
            marginTop:16,
            fontSize:14,
            color:'#4D4D4D',
            fontFamily:'ManropeBold'
          }}>
            All Lessons
          </Text>

          
          {[1,2,3].map((item,index)=>(
            <View key={index} style={{
              marginTop:10,
              padding:12,
              borderRadius:6,
              borderWidth:1,
              borderColor:'#F0F0F0',
              flexDirection:'row',
              alignItems:'center'
            }}>
              <View style={{
                width:30,
                height:30,
                borderRadius:15,
                backgroundColor:index < 2 ? '#E7F9EB' : '#F3F4F6',
                justifyContent:'center',
                alignItems:'center',
                marginRight:10
              }}>
                 <Image style={{width:19,height:19}} source={require('../assests/GreenTick.png')} />
              </View>
              <View>
                <Text style={{fontSize:14,fontFamily:'ManropeMedium',color:'#4D4D4D'}}>
                  {index === 0
                    ? 'Introduction to UI/UX'
                    : index === 1
                    ? 'Design Thinking Process'
                    : 'User Research Methods'}
                </Text>
                <Text style={{fontSize:12, color:'#808080',fontFamily:'ManropeRegular',}}>
                  12:30
                </Text>
              </View>

            </View>
          ))}

        </View>

      </ScrollView>
    </View>
  )
}