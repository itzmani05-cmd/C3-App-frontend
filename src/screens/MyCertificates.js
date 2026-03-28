import React from 'react'
import {View, Text, Image, ScrollView,TouchableOpacity} from 'react-native';
import Header from '../components/Header'

export default function MyCertificates () {
  return (
    <View style={{flex:1,backgroundColor:'#F0F0F0'}}>
        <Header
            title="My Certificates"
            showBack={true}
        />
        <View style={{flexDirection:'row',justifyContent:'space-around',paddingVertical:20,margin:12}}>
            <View style={{flex:1,alignItems:'center',borderRadius:12,padding:15,backgroundColor:'#FFFFFF',borderColor:'#F0F0F0',}}>
                <Image style={{width:28,height:26,marginBottom:5}} source={require('../assests/CupIcon.png')}/>
                <Text style={{color:'#4D4D4D',fontFamily:'ManropeBold',fontSize:14}}>2</Text>
                <Text style={{color:'#4D4D4D',fontFamily:'ManropeRegular',fontSize:14}}>
                    Certificates Earned
                </Text>
            </View>
            <View style={{flex:1,alignItems:'center',borderRadius:12,padding:15,backgroundColor:'#FFFFFF',borderColor:'#F0F0F0',}}>
                <Image style={{width:28,height:26,marginBottom:5}} source={require('../assests/StarIcon.png')}/>
                <Text  style={{color:'#4D4D4D',fontFamily:'ManropeBold',fontSize:14}}>2</Text>
                <Text style={{color:'#4D4D4D',fontFamily:'ManropeRegular',fontSize:14}}>
                    Certificates Earned
                </Text>
            </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
            <View
                style={{
                    backgroundColor:'#FFFFFF',
                    margin:12,
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
                                Complete UI/UX Design Course
                            </Text>
                            <Text style={{fontFamily:'ManropeRegular',fontSize:12,color:'#4D4D4D',}}>
                                Instructor: Sarah Johnson
                            </Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',marginVertical:5,gap:8}}>
                            <Image source={require('../assests/CalenderIcon.png')} />
                            <Text style={{fontFamily:'ManropeRegular',fontSize:12,color:'#4D4D4D'}}>
                                Feb 15, 2025
                            </Text>
                            <Image style={{width:13,height:12}} source={require('../assests/StarIconFull.png')} />
                            <Text style={{fontFamily:'ManropeRegular',fontSize:12,color:'#4D4D4D',}}>
                                Grade: A
                            </Text>
                        </View>
                    </View>
                    <View style={{marginVertical:5,}}>
                        <Text style={{fontFamily:'ManropeRegular',fontSize:12,color:'#4D4D4D'}}>
                            Score
                        </Text>
                        <View style={{flexDirection:'row',alignItems:'center',marginTop:4}}>
                            <View style={{flex:1,height: 6,backgroundColor: '#E5E7EB',borderRadius: 5,}}>
                                <View style={{
                                        width: '100%',
                                        height: '80%',
                                        backgroundColor: '#22C55E',
                                        borderRadius: 5,}}
                                />
                            </View>
                            <Text style={{marginLeft:8,fontFamily:'ManropeRegular',fontSize:12,color:'#4F46E5'}}>
                                100%
                            </Text>
                        </View>
                    </View>
                    
                    <Text style={{fontFamily:'ManropeRegular',fontSize:12,color:'#4D4D4D',marginTop:10}}>
                        ID: CERT-2025-UXUI-001
                    </Text>
                </View>

                <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:10,paddingVertical:10}}>
                    <TouchableOpacity style={{backgroundColor:'#4F46E5',height:52,flex:1,flexDirection:'row',padding:10,borderRadius:6,alignItems:'center',justifyContent:'center',marginRight:8}}>
                        <Image style={{width:24,height:24,marginRight:10}} source={require('../assests/CalenderWhite.png')}/>
                        <Text style={{fontFamily:'ManropeMedium',fontSize:16,color:'#FFFFFF'}}>
                            Download 
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{borderColor:'#4F46E5',borderWidth:1,flex:1,flexDirection:'row',padding:10,borderRadius:6,alignItems:'center',justifyContent:'center',marginRight:8}}>
                        <Image style={{width:16,height:20,marginRight:10}} source={require('../assests/ShareIcon.png')}/>
                        <Text style={{fontFamily:'ManropeMedium',fontSize:16,color:'#4F46E5'}}>
                            Share
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    </View>
  )
}
