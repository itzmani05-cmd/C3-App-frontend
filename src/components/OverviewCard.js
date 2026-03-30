import React from 'react'

import {View, Text,Image} from 'react-native';
export default function OverviewCard() {
  return (
    <View style={{padding:16,}}>
                        <Text style={{fontFamily:'ManropeBold',fontSize:14,color:'#4D4D4D'}}>
                            About This Course
                        </Text>
                        <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#666666',marginTop:6}}>
                            Master the complete UI/UX design process from research to prototyping. Learn industry-standard tools and methodologies used by top designers.
                        </Text>
                        <Text style={{fontFamily:'ManropeBold',fontSize:14,color:'#4D4D4D',marginTop:14}}>
                            What You'll Learn
                        </Text>
                        {[
                            'Design thinking & user research',
                            'Wireframing & prototyping',
                            'Visual design principles',
                            'Usability testing',
                            'Design systems & components',
                        ].map((item,index)=>(
                            <View key={index} style={{flexDirection:'row',alignItems:'center',marginTop:8}}>
                                <Image source={require('../assests/GreenTick.png')} />
                                <Text style={{marginLeft:8,fontFamily:'ManropeRegular',fontSize:14,color:'#666666'}}>{item}</Text>
                            </View>
                        ))}
                    </View> 
  )
}
