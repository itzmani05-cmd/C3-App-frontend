import React from 'react'
import {View, Text, Image, ScrollView,TouchableOpacity} from 'react-native';
import Header from '../components/Header'

import {myCertificates} from '../data/myCertificates';

export default function MyCertificates () {
  return (
    <View style={{flex:1,backgroundColor:'#F0F0F0'}}>
        <Header
            title="My Certificates"
            showBack={true}
        />
        <View style={{
    height:112,
    marginLeft:16,
    marginRight:16,
    marginVertical:16,
    borderRadius:6,
    borderWidth:1,
    borderColor:'#F0F0F0',
    backgroundColor:'#FFFFFF',
    padding:10,
    flexDirection:'row',
    justifyContent:'space-between',
    
  }}>
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Image style={{width:28,height:26,marginBottom:5}} source={require('../assests/CupIcon.png')}/>
                <Text style={{color:'#4D4D4D',fontFamily:'ManropeBold',fontSize:14}}>2</Text>
                <Text style={{color:'#4D4D4D',fontFamily:'ManropeRegular',fontSize:14}}>
                    Certificates Earned
                </Text>
            </View>
            <View style={{
                width:1,
                backgroundColor:'#E5E7EB',
                marginVertical:10
            }}/>
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Image style={{width:28,height:26,marginBottom:5}} source={require('../assests/StarIcon.png')}/>
                <Text  style={{color:'#4D4D4D',fontFamily:'ManropeBold',fontSize:14}}>2</Text>
                <Text style={{color:'#4D4D4D',fontFamily:'ManropeRegular',fontSize:14}}>
                    Certificates Earned
                </Text>
            </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
            {myCertificates.map((item)=>(
                <View
                    key={item.id}
                    style={{
                        backgroundColor:'#FFFFFF',
                        marginBottom:14,
                        marginHorizontal:14,
                        borderRadius:6,
                        overflow:'hidden'
                    }}
                >
                    <Image
                        style={{width:'100%',height:104}} 
                        source={require('../assests/MyCertificatePic.jpg')}/>
                    <View style={{padding:10}}>
                        <View>
                            <View>
                                <Text style={{fontFamily:'ManropeBold',color:'#4D4D4D',fontSize:14}}>
                                    {item.title}
                                </Text>
                                <Text style={{fontFamily:'ManropeRegular',fontSize:12,color:'#4D4D4D',}}>
                                    Instructor: {item.instructor}
                                </Text>
                            </View>
                            <View style={{flexDirection:'row',alignItems:'center',marginVertical:5,gap:8}}>
                                <Image source={require('../assests/CalenderIcon.png')} />
                                <Text style={{fontFamily:'ManropeRegular',fontSize:12,color:'#4D4D4D'}}>
                                    {item.date}
                                </Text>
                                <Image style={{width:13,height:12}} source={require('../assests/StarIconFull.png')} />
                                <Text style={{fontFamily:'ManropeRegular',fontSize:12,color:'#4D4D4D',}}>
                                    Grade: {item.grade}
                                </Text>
                            </View>
                        </View>
                        <View style={{marginBottom:5}}>
                           
                            <View style={{flexDirection:'row',alignItems:'center',marginTop:4}}>
                                 <Text style={{fontFamily:'ManropeRegular',fontSize:12,color:'#4D4D4D',marginRight:8}}>
                                    Score:
                                </Text>
                                <View style={{flex:1,height: 6,backgroundColor: '#E5E7EB',borderRadius: 5,}}>
                                    <View style={{
                                        width: `${item.score}%`,
                                        height: '100%',
                                        backgroundColor: '#22C55E',
                                        borderRadius: 5
                                    }}
                                    />
                                </View>
                                <Text style={{marginLeft:8,fontFamily:'ManropeRegular',fontSize:12,color:'#4F46E5'}}>
                                    {item.score}%
                                </Text>
                            </View>
                        </View>
                        
                        <Text style={{fontFamily:'ManropeRegular',fontSize:12,color:'#4D4D4D',marginTop:2}}>
                            ID: {item.certificateId}
                        </Text>
                    </View>

                    <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:10,paddingVertical:10}}>
                        <TouchableOpacity style={{backgroundColor:'#4F46E5',height:52,flex:1,flexDirection:'row',padding:10,borderRadius:6,alignItems:'center',justifyContent:'center',marginRight:8}}>
                            <Image style={{width:24,height:24,marginRight:10}} source={require('../assests/DownloadPic.png')}/>
                            <Text style={{fontFamily:'ManropeMedium',fontSize:16,color:'#FFFFFF'}}>
                                Download 
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{borderColor:'#4F46E5',borderWidth:1,flex:1,flexDirection:'row',padding:10,borderRadius:6,alignItems:'center',justifyContent:'center',marginRight:8}}>
                            <Image style={{width:24,height:24,marginRight:10}} source={require('../assests/SharePic.png')}/>
                            <Text style={{fontFamily:'ManropeMedium',fontSize:16,color:'#4F46E5'}}>
                                Share
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </ScrollView>
    </View>
  )
}
