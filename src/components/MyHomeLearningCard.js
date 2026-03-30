import React from 'react';
import { TouchableOpacity, Text, View, Image } from 'react-native';

export default function MyHomeLearningCard({ item }) {
  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderColor: '#F0F0F0',
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: 4,
        width:'35%',
        marginRight:12
        
      }}
    >
      <Image
        source={item.image}
        style={{width: '100%', height: 116 }}
      />

      <View style={{padding: 10 }}>
        <View style={{flexDirection:'row',justifyContent:"space-between"}}>
            <View style={{flex:1}}>

                <Text style={{fontFamily: 'ManropeBold', fontSize: 14, color: '#4D4D4D' }}>
                    {item.title}
                </Text>
                <Text style={{fontFamily: 'ManropeRegular', fontSize: 12, color: '#4D4D4D' }}>
                    {item.author}
                </Text>
            </View>
            <View style={{flexDirection:'row',alignItems:'center',top:-10}}>
            <Text style={{fontSize: 12, color: '#4D4D4D',fontWeight:'400', marginRight: 8,fontFamily:'ManropeRegular'}}>
                ⭐ {item.rating}
            </Text>
            <Text style={{fontSize: 12, color: '#4D4D4D',fontWeight:'400',fontFamily:'ManropeRegular' }}>
                • {item.time}
            </Text>
            </View>
        </View>

        <View style={{ marginTop: 8 }}>          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12, color: '#4D4D4D',fontFamily:'ManropeRegular', }}>
              {item.lessons}/{item.totalLessons} lessons
            </Text>

            <Text style={{ fontSize: 12, color: '#4F46E5', fontWeight: '500' ,fontFamily:'ManropeMedium'}}>
              {item.progress}%
            </Text>
          </View>

          <View
            style={{
              height: 6,
              backgroundColor: '#E5E7EB',
              borderRadius: 10,
              marginTop: 6,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                width: `${item.progress}%`,
                height: '100%',
                backgroundColor:
                  item.progress > 70 ? '#22C55E' : '#4F46E5',
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}