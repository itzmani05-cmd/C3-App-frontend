import Header from '../components/Header';
import React from 'react'
import {View, Text, Image,TouchableOpacity,TextInput,ScrollView} from 'react-native';

export default function PaymentScreen({navigation}){
  return (
    <View style={{flex:1,backgroundColor:'#FBFBFB'}}>
        <Header
            title="Payment"
            showBack={true}
        />
        <ScrollView contentContainerStyle={{padding:18}}>
            <Text style={{marginBottom:12,fontFamily:'ManropeBold',fontSize:14,color:'#4D4D4D'}}>
                Select Payment method
            </Text>
            <View>

                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:14,borderRadius:10,marginBottom:12,borderWidth:1,borderColor:'#F0F0F0',backgroundColor:'#FFFFFF'}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image
                            source={require('../assests/EmailIcon.png')} 
                            style={{width:16,height:13,marginRight:10}} 
                        />
                        <Text style={{fontFamily:'ManropeRegular',fontSize:16,color:'#1A1A1A'}} >
                            Credit or Debit Card
                        </Text>
                    </View>
                    <Image source={require('../assests/ArrowRight.png')}/>
                </View>

                <View>
                    <Text style={{fontFamily:'ManropeSemibold',fontSize:14,color:'#333333',marginBottom:10}}>
                        Select Card
                    </Text>
                    <View style={{flexDirection:'row',alignItems:'center',gap:10,marginBottom:8}}>
                        <Image 
                            style={{width:50,height:36,borderRadius:6,}}
                            source={require('../assests/PaymentPage/PaymentOne.png')} />
                        <Image style={{width:49,height:35}} source={require('../assests/PaymentPage/PaymentTwo.png')} />
                        <Image style={{width:101,height:28}} source={require('../assests/PaymentPage/AddCardPic.png')} />
                    </View>
                    <Image 
                        style={{width:'100%',height:203,marginTop:6,marginBottom:2}}
                        source={require('../assests/PaymentPage/ATMCardPic.png')} />
                    <View style={{backgroundColor:'#F0F0F0',flexDirection:'row',alignItems:'center',borderRadius:30,paddingHorizontal:10,paddingVertical:6,marginVertical:16}}>
                        <TextInput  placeholder='Promo Code'
                            placeholderTextColor='#676767'
                            style={{
                                flex:1,
                                paddingVertical:6,
                                color:'#676767',
                                fontSize:16,fontFamily:'ManropeRegular'
                            }}
                        />
                        <TouchableOpacity
                            style={{backgroundColor:'#4F46E5',justifyContent:'center',borderRadius:18,paddingVertical:8,paddingHorizontal:18}} 
                        >
                            <Text style={{color:'#FDFDFD',fontFamily:'ManropeRegular',fontSize:16,}}>
                                Apply
                            </Text>
                        </TouchableOpacity>
                </View>
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2,}}>
                            <Text style={{fontFamily:'ManropeSemiBold', fontSize:14,color:'#333333'}}>Order</Text>
                            <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#676767'}}>$ 39.0</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2}}>
                            <Text style={{fontFamily:'ManropeSemiBold', fontSize:14,color:'#333333'}}>Tax</Text>
                            <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#676767'}}>18%</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom:2}}>
                            <Text style={{fontFamily:'ManropeSemiBold', fontSize:14,color:'#333333'}}>Discount</Text>
                            <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#676767'}}>10%</Text>
                        </View>

                        <View style={{height:1, backgroundColor: '#eee', marginVertical: 6 }} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontWeight: '600' ,fontFamily:'ManropeSemiBold',fontSize:14,color:'#333333'}}>Total</Text>
                            <Text style={{fontFamily:'ManropeRegular',fontSize:14,color:'#676767'}}>$ 52.0</Text>
                        </View>
                    </View>
                    <View style={{padding:16,backgroundColor:'#FFFFFF',borderColor:'#F0F0F0',borderWidth:1,borderRadius:10,marginTop:12}}>   
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Image
                                    source={require('../assests/PaymentPage/NetBankingIcon.png')} 
                                    style={{width:16,height:13,marginRight:10}} 
                                />
                                <Text style={{fontFamily:'ManropeRegular',fontSize:16,color:'#1A1A1A'}} >
                                    Net Banking
                                </Text>
                            </View>
                            <Image source={require('../assests/ArrowRightBlack.png')}/>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{marginTop:8}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:12}}>
                    <Text style={{fontFamily:'ManropeBold',fontSize:18,color:'#333333'}}>
                        Total
                    </Text>
                    <Text style={{color:'#333333',fontFamily:'ManropeBold',fontSize:18,}}>
                        $ 52.0
                    </Text>
                </View>
                <TouchableOpacity
                    style={{
                        backgroundColor:'#4746E5',
                        borderRadius:6,
                        height:52,
                        alignItems:'center',
                        justifyContent:'center',
                        borderRadius:12
                    }}
                >
                    <Text style={{color:'#FFFFFF',fontFamily:'ManropeMedium',fontSize:16,}}>
                        Confirm Checkout
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </View>
  )
}
