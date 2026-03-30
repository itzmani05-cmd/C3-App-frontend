import React from 'react'
import {View ,Text,ScrollView} from 'react-native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import Category from '../components/Category';

import ExploreRecentSearch from '../components/ExploreRecentSearch';
import { learningCourses } from '../data/courses';
import {courses} from '../data/ExploreData';
import MyHomeLearningCard  from '../components/MyHomeLearningCard';

export default function HomeScreen() {
  return (
    <View >
      <Header 
        title="Good morning"
        showBack={true}
      />
      <ScrollView showsHorizontalScrollIndicator={false} style={{marginTop:10}}>
      
        <SearchBar/>
        <Category/>
        <Text style={{marginLeft:17,marginTop:15,color:'#4D4D4D',fontFamily:'ManropeBold'}}>
          Continue Learning
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{marginTop:10,paddingLeft:16}}>
            {learningCourses.map(item=>(
              <MyHomeLearningCard key={item.id} item={item}/>
            ))}
          
          
        </ScrollView>
        <Text style={{marginLeft:17,marginTop:15,color:'#4D4D4D',fontFamily:'ManropeBold'}}>
          Popular Search
        </Text>
        <ExploreRecentSearch courses={courses}/> 
      </ScrollView>
    </View>
  )
}
