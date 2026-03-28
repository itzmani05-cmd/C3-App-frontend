import React from 'react';
import {View, Image, Text,TouchableOpacity} from 'react-native';
import {useState} from 'react';

export default function CurriculumCard({section}) {
    const [expanded,setExpanded]=useState(section.open);
  return (
    <View style={{}}>
        <TouchableOpacity
            style={{borderColor:'#E6E6E6',borderWidth:1,padding:10,alignItems:'center',justifyContent:'center',flexDirection:'row',}} onPress={()=>setExpanded(!expanded)}
        >            
            <View style={{flex:1}}>
                <Text style={{color:'#4D4D4D',fontFamily:'ManropeBold',fontSize:14}}>
                    {section.title}
                </Text>
                <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#808080'}}>
                    {section.lessons.length} lessons
                </Text>
            </View>
            <Image style={{width:19,height:19,marginRight:15}} source={require('../assests/ArrowRight.png')}/>
        </TouchableOpacity>
        {expanded&&
            section.lessons.map((lesson,index)=>(
                <View key={index}>
                    <View style={{height:1,backgroundColor:'#E6E6E6',marginHorizontal:8}}/>
                    <View style={{flexDirection:'row',alignItems:'center',padding:14}}>
                        <View style={{width:38,height:38,borderRadius:60,backgroundColor:'#FFFFFF',alignItems:'center',justifyContent:'center',marginRight:5,backgroundColor:lesson.completed?'#E7F9EB':'#F3F4F6'}}>
                            <Image style={{width:19,height:19}} 
                                source={lesson.completed?require('../assests/GreenTick.png'):require('../assests/PlayButtonIcon.png')}
                            />
                        </View>
                        <View>
                            <Text style={{fontFamily:'ManropeMedium',fontSize:14,color:'#4D4D4D'}}>
                                {lesson.title}
                             </Text>
                            <Text style={{fontFamily:'ManropeMedium',fontSize:14,color:'#808080'}}>
                                {lesson.duration}
                            </Text>
                        </View>
                    </View>                
                </View>
            ))
        }
    </View>
  )
}
