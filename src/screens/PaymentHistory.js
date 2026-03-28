import React from 'react'
import {View,Text, ScrollView,TouchableOpacity,Image} from 'react-native';
import Header from '../components/Header';

export default function PaymentHistory(){
  return (
    <View style={{flex:1,backgroundColor:'#F0F0F0'}}>
        <Header
            title="Payment History"
            showBack={true}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{backgroundColor:'#FFFFFF',borderRadius:6,padding:15,borderColor:'#F0F0F0',borderWidth:1,margin:10}}>
                <View style={{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:'#FFFFFF',borderRadius:6,margin:10}}>
                    <Image style={{width:34,height:34}} source={require('../assests/WalletIcon.png')}/>
                    <View>
                        <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#4D4D4D'}}>
                            Total Spent
                        </Text>
                        <Text style={{fontFamily:'ManropeBold',color:'#4F46E5',fontSize:18}}>
                            $149.97
                        </Text>
                    </View>
                </View>
                <View style={{
                    height:1,
                    backgroundColor:'#E5E7EB',
                    marginTop:2
                }}/>
                <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:8}}>
                    <View style={{alignItems:'center',flex:1}}>
                        <Text style={{fontFamily:'ManropeBold',fontSize:16,color:'#1A1A1A',marginBottom:2}}>
                            4
                        </Text>
                        <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#4D4D4D'}}>
                            Transactions
                        </Text>
                    </View>
                    <View style={{alignItems:'center',flex:1}}>
                        <Text style={{fontFamily:'ManropeBold',fontSize:16,color:'#1A1A1A',marginBottom:2}}>
                            3
                        </Text>
                        <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#4D4D4D'}}>
                            Completed
                        </Text>
                    </View>
                    <View style={{alignItems:'center',flex:1}}>
                        <Text style={{fontFamily:'ManropeBold',fontSize:16,color:'#1A1A1A',marginBottom:2}}>
                            1
                        </Text>
                        <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#4D4D4D'}}>
                            Refunded
                        </Text>
                    </View>
                </View>
            </View>
            <Text style={{fontFamily:'ManropeBold',fontSize:14,color:'#4D4D4D',marginTop:12,marginBottom:15,marginHorizontal:14}}>
                Transaction History
            </Text>
            <View style={{backgroundColor:'#FFFFFF',borderRadius:10,padding:15,borderColor:'#F0F0F0',borderWidth:1,marginHorizontal:12,marginBottom:12}}>
                <View style={{}}>
                    <View style={{flexDirection:'row',alignItems:'center',flex:1}}>
                        <Image style={{width:34,height:34,marginRight:10}} source={require('../assests/CardIcon.png')} />
                        <View style={{flex:1}}>
                            <Text style={{fontFamily:'ManropeBold',fontSize:14,color:'#4D4D4D',marginBottom:4}}>
                                React Native - Build Mobile Apps
                            </Text>
                            <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#4D4D4D'}}>
                                TXN - 2026-03-01
                            </Text>
                        </View>
                        <Text style={{fontFamily:'ManropeBold',fontSize:16,color:'#4F46E5'}}>
                            $59.99
                        </Text>
                    </View>
                    <View style={{flexDirection:'row',marginTop:10,alignItems:'center',gap:18,paddingBottom:8,borderBottomColor:'#CCCCCC',borderBottomWidth:1}}>  
                        <View style={{flexDirection:'row',alignItems:'center',}}>
                            <Image style={{width:16,height:16,marginRight:8}} source={require('../assests/CalenderIcon.png')}/>
                            <Text style={{fontFamily:'ManropeRegular',fontSize:12,color:'#4D4D4D'}}>
                                Mar 5, 2025
                            </Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',}}>
                            <Image style={{width:16,height:16,marginRight:8}} source={require('../assests/CardIcon.png')}/>
                            <Text style={{fontFamily:'ManropeRegular',fontSize:12,color:'#4D4D4D'}}>
                                Credit Card
                            </Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',paddingRight:10,backgroundColor:'#D7F4DE',borderRadius:60,paddingVertical:4,paddingHorizontal:10}}>
                            <Image style={{width:5,height:5,marginRight:5}} source={require('../assests/Dot.png')}/>
                            <Text style={{fontFamily:'ManropeRegular',fontSize:12,color:'#319F43'}}>
                                Completed
                            </Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={{height:52,padding:14,backgroundColor:'#D4D2F9',borderRadius:6,marginTop:10,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                    <Image style={{width:24,height:24}} source={require('../assests/DownloadReceiptIcon.png')} />
                    <Text style={{color:'#4F46E5',fontFamily:'ManropeMedium',fontSize:16,marginLeft:10}}>
                        Download Receipt
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </View>
  )
}
