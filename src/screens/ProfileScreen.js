import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import Header from '../components/Header';

export default function ProfileScreen ({navigation}) {
  return (
    <View>
        <Header
            title="Profile"
            showBack={true}
        />
        <View style={{padding:22,}}>
      
            <View style={{
              flexDirection:'row',
                  borderColor:'#4F46E5',
                  borderRadius:4,
                  backgroundColor:'#FFFFFF',
                  borderWidth:1,
                  padding:12,
                  position:'relative'
            }}>
              <Image source={require('../assests/Profile.jpg')}
                  style={{width:72,height:72,borderRadius:36}}
                />
              <View style={{flex:1,marginLeft:12,paddingTop:2}}>
                <Text style={{fontFamily:'ManropeExtraBold',fontSize:16,color:'#1A1A1A'}}>
                  Martin James
                </Text>
                <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#666666',marginTop:4}}>
                  martin.james12@outlook.com
                </Text>
                <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#666666',marginTop:4}}>
                  ID: 123456789
                </Text>
              </View>
              <TouchableOpacity style={{position:'absolute',top:20,right:12}}>
                <Image 
                  source={require('../assests/EditIcon.png')} 
                  style={{width:19,height:19}}
                />
              </TouchableOpacity>
            </View>

            <View style={{flexDirection:'row',marginTop:20}}>
              {[
                {value:'12',label:'Courses'},
                {value:'5',label:'Certificates'},
                {value:'48h',label:'Learning'},
              ].map((item,index)=>(
                <View
                  key={index}
                  style={{
                    flex:1,
                    alignItems:'center',
                    borderRadius:8,
                    marginBottom:10,
                    borderColor:'#F0F0F0',
                    borderWidth:1,
                    backgroundColor:'#FFFFFF',
                    padding:10,
                    marginRight:10,
                  }}
                >
                  <Text 
                    style={{
                      color:item.label==="Courses"
                        ?'#4F46E5':item.label==="Learning"
                        ?'#EBB300':'#319F43',
                      fontFamily:'ManropeBold',
                      fontSize:16,
                    }}
                  >
                    {item.value}
                  </Text>
                  <Text style={{color:'#4D4D4D',fontFamily:'ManropeRegular',fontSize:14}}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>

            <View style={{marginTop:20}}>
              {[
                { label: "My Courses", icon: require('../assests/CourseIcon.png'),screen:'MyCourse' },
                { label: "Certificates", icon: require('../assests/CertificateIcon.png'),screen:'Certificates' },
                { label: "Payment History", icon: require('../assests/PaymentIcon.png'),screen:'PaymentHistory' },
                { label: "Settings", icon: require('../assests/SettingIcon.png'),screen:'Settings' },
              ].map((item,index)=>(
                <TouchableOpacity
                  key={index}
                  onPress={()=>navigation.navigate(item.screen)}
                  style={{
                    height:52,
                    flexDirection:'row',
                    justifyContent:'space-between',
                    alignItems:'center',
                    backgroundColor:'#FFFFFF',
                    borderColor:'#F0F0F0',
                    padding:16,
                    borderWidth:1,
                  }}
                >
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Image source={item.icon} style={{width:20,height:20,marginRight:10}}/>
                    <Text style={{fontFamily:'ManropeMedium',fontSize:14}}>
                      {item.label}
                    </Text>
                  </View>
                  <Image source={require('../assests/RightArrowBlue.png')}
                    style={{width:20,height:20}}
                  />
                </TouchableOpacity>
              ))}

            </View>

            <TouchableOpacity
              style={{
                flexDirection:'row',
                alignItems:'center',
                height:52,
                backgroundColor:'#FFCCCD',
                borderRadius:8,
                marginTop:30,
                width:'100%'
              }}
            >
              <Image 
                source={require('../assests/LogoutIcon.png')}
                style={{width:20,height:20,marginLeft:20,}}
              />
              <Text style={{color:'#FF383C',fontSize:14,marginLeft:8,}}>
                Logout
              </Text>
            </TouchableOpacity>

            <Text style={{color:'#666666',fontFamily:'ManropeRegular',fontSize:14,textAlign:'center',marginTop:40,marginBottom:20}}>
              Version 1.0.0
            </Text>
        </View>

    </View>
  )
}
