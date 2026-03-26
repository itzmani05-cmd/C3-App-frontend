import React from 'react'
import {View } from 'react-native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';

export default function ExploreScreen () {
  return (
    <View>
      <Header 
        title="Explore Courses"
        showBack={true}
      />
      <SearchBar/>
    </View>
  )
}
