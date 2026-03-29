import React from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity,Image } from 'react-native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';

export default function HelpCenter() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F0F0F0' }}>
      <Header title="Help Center" showBack />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{position:'relative', backgroundColor: '#4F46E5', padding: 16, paddingBottom: 30 }}>
          <Text style={{ color: '#FFFFFF', textAlign: 'center', fontSize: 16, fontFamily:'ManropeBold' }}>
            How can we help you?
          </Text>

          <Text style={{ color: '#FFFFFF', textAlign: 'center', fontSize: 14,fontFamily:'ManropeRegular', marginTop: 4 }}>
            Search for answers or browse topics below
          </Text>
        </View>

        <SearchBar style={{position:'absolute',top:9}}/>

        <Text style={{ margin: 16, fontFamily:'ManropeBold', color: '#4D4D4D',fontSize:14 }}>
          Quick Links
        </Text>

        {[
          'Getting Started',
          'Account Settings',
          'Payments & Refunds',
          'Technical Support'
        ].map((item, i) => (
          <View key={i} style={{
            backgroundColor: '#fff',
            marginHorizontal: 16,
            marginBottom: 10,
            padding: 14,
            borderRadius: 10,
            elevation: 2
          }}>
            <Image style={{width:34,height:34}} source={
                i === 0 ? require('../assests/RocketIcon.png') :
                i === 1 ? require('../assests/SettingIcon.png') :
                i === 2 ? require('../assests/CardIcon.png') :
                require('../assests/TechnicalSupportIcon.png')

            } />
            <Text style={{ textAlign:'center',fontFamily:'ManropeBold',fontSize:16,color:'#1A1A1A' }}>{item}</Text>
            <Text style={{textAlign:'center',fontSize: 12, color: '#666', marginTop: 2 }}>
              {i === 0 && 'Learn the Basics'}
              {i === 1 && 'Manage your account'}
              {i === 2 && 'Billing information'}
              {i === 3 && 'Troubleshooting help'}
            </Text>
          </View>
        ))}

        {/* FAQ */}
        <Text style={{ margin: 16, fontWeight: '600', color: '#444' }}>
          Frequently Asked Questions
        </Text>

        {[
          'How do I enroll in a course?',
          'Can I download lessons for offline viewing?',
          'How do I track my progress?',
          'How do I get a certificate?',
          'Can I get a refund?',
          'How do I contact an instructor?'
        ].map((q, i) => (
          <View key={i} style={{
            backgroundColor: '#fff',
            marginHorizontal: 16,
            marginBottom: 8,
            padding: 14,
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
            <Text style={{ fontSize: 13 }}>{q}</Text>
            <Text>⌄</Text>
          </View>
        ))}

        {/* SUPPORT CARD */}
        <Text style={{ margin: 16, fontWeight: '600', color: '#444' }}>
          Still need help?
        </Text>

        <View style={{
          backgroundColor: '#fff',
          marginHorizontal: 16,
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
          elevation: 2
        }}>
          <Text style={{ fontWeight: '600' }}>Contact Support</Text>
          <Text style={{ fontSize: 12, color: '#666', textAlign: 'center', marginTop: 4 }}>
            Our support team is available 24/7 to assist you
          </Text>

          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <TouchableOpacity style={{
              flex: 1,
              backgroundColor: '#4F46E5',
              padding: 10,
              borderRadius: 10,
              alignItems: 'center',
              marginRight: 6
            }}>
              <Text style={{ color: '#fff' }}>Live Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#4F46E5',
              padding: 10,
              borderRadius: 10,
              alignItems: 'center',
              marginLeft: 6
            }}>
              <Text style={{ color: '#4F46E5' }}>Email Us</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* RESOURCES */}
        <Text style={{ margin: 16, fontWeight: '600', color: '#444' }}>
          Additional Resources
        </Text>

        {[
          'User Guide',
          'Video Tutorials',
          'Community Forum'
        ].map((item, i) => (
          <View key={i} style={{
            backgroundColor: '#fff',
            marginHorizontal: 16,
            marginBottom: 10,
            padding: 14,
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            elevation: 2
          }}>
            <View>
              <Text style={{ fontWeight: '500' }}>{item}</Text>
              <Text style={{ fontSize: 12, color: '#666' }}>
                {i === 0 && 'Complete guide to using learner'}
                {i === 1 && 'Learn through video guides'}
                {i === 2 && 'Connect with other learners'}
              </Text>
            </View>

            <Text>{'>'}</Text>
          </View>
        ))}

      </ScrollView>
    </View>
  )
}