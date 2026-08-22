import React, { useEffect, useRef } from 'react'
import {View} from 'react-native';
import axios from 'axios';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import { API_BASE_URL } from '../config/api';

export default function TimeUpScreen({route,navigation}){
  const {lessonName="Lesson",answers=[],questions=[],topicId, subtopicId}=route.params||{};
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    const submitTimedOutAttempt = async () => {
      if (hasSubmittedRef.current) {
        return;
      }

      const loggedInUserId = global.userId || global.user?.userId;
      if (!loggedInUserId || (!topicId && !subtopicId)) {
        return;
      }

      hasSubmittedRef.current = true;

      try {
        const payload = {
          answers,
          isTimedOut: true,
        };

        if (topicId) {
          payload.topicId = topicId;
        }

        if (subtopicId) {
          payload.subtopicId = subtopicId;
        }

        await axios.post(`${API_BASE_URL}/api/quiz/submit`, payload, {
          headers: {
            userid: loggedInUserId,
          },
        });
      } catch (err) {
        hasSubmittedRef.current = false;
        console.log('Timed out quiz submit failed:', err);
      }
    };

    submitTimedOutAttempt();
  }, [answers, subtopicId, topicId]);

  return (
    <View style={{flex:1,backgroundColor:'#FFFFFF',justifyContent:'center',padding:20}}>
      <View style={{width:'100%',backgroundColor:'#FFFFFF',padding:25,borderRadius:20,alignItems:'center',elevation:6,shadowColor:"#000000",shadowOpacity:0.1,shadowRadius:10}}>
        <AppText variant="bold" style={{marginTop:10,color:"#DC2626"}}>
          Time's Up!
        </AppText>
        <AppText variant="bold" style={{marginTop:8,color:'#000000'}}>
          {lessonName}
        </AppText>
        <View style={{height: 1,width: '100%',backgroundColor: '#FFFFFF',marginVertical: 20}} />
        <View style={{backgroundColor:'#FFFFFF',paddingVertical:15,paddingHorizontal:25,marginBottom:25,borderRadius:12}}>
          <AppText style={{fontSize: 16,color: '#2563EB'}}>
            You attempted {answers.length} / {questions.length}
          </AppText>
        </View>
        <View style={{flexDirection:'row',gap:22}}>
          <AppButton
            label="Go Back"
            tone="secondary"
            onPress={()=>navigation.goBack()}
            style={{paddingHorizontal:20}}
            textStyle={{fontSize:14}}
          />
          <AppButton
            label="Retry"
            tone="secondary"
            onPress={()=>navigation.replace("QuestionsScreen",{
              topicId,subtopicId, lessonName,  topicName: route.params?.topicName,subtopicName: route.params?.subtopicName,unitName: route.params?.unitName
            })}
            style={{paddingHorizontal:20}}
            textStyle={{fontSize:14}}
          />
        </View>
      </View>
    </View>
  )
}

