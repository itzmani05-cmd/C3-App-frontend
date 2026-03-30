import React from 'react'
import {View,ScrollView,Text} from 'react-native';
import { learningCourses } from '../data/courses';
import MyLearningCard from '../components/MyLearningCard';
import Header from '../components/Header'

export default function MyLearning  () {
  return (
    <View style={{flex:1,backgroundColor:'#FBFBFB'}}>
      <Header
            title="My Learning"
            showBack={true}
        />
      {learningCourses.length===0?(
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <Text style={{fontSize:16,color:'#888'}}>
            No items in wishlist
          </Text>
        </View>
      ):(
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{paddingBottom:20}}
      >
        {learningCourses.map(item=>(
          <MyLearningCard key={item.id} item={item}/>
        ))}
      </ScrollView>
      )}
    </View>
  )
}

