import React from 'react'
import {View,Text } from 'react-native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import Category from '../components/Category';
import ExploreRecentSearch from '../components/ExploreRecentSearch';

import {courses} from '../data/ExploreData';

export default function LearningScreen () {
  return (
    <View>
      <Header 
        title="My Learning"
        showBack={true}
      />
      
      <SearchBar/>
      <Category/>
      <Text style={{marginLeft:17,marginTop:15,color:'#4D4D4D',fontFamily:'ManropeBold'}}>
        Recent Search
      </Text>
      <ExploreRecentSearch courses={courses}/>
    </View>
  )
}
