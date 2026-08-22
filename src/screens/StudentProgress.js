import React,{useEffect,useState} from 'react'
import {View, Text,FlatList, ActivityIndicator} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export default function StudentProgress({route,navigation}){
    const {userId, name}=route.params;
    const [progress,setProgress]=useState(null);
    const [loading, setLoading] =useState(true);
    useEffect(()=>{
        fetchProgress();
    },[]);

    const fetchProgress=async()=>{
        try{
            const res=await axios.get(
                `${API_BASE_URL}/api/admin/students/${userId}/progress`
            );
            console.log("PROGRESS:",res.data);
            setProgress(res.data);
        }
        catch(err){
            console.log(err);
        }
        finally{
            setLoading(false);
        };

        
    }
    if(loading){
            return <ActivityIndicator size="large" color="#2563EB" />
        }

  return (
    <View style={{flex:1,padding:20,backgroundColor:'#F8FAFC'}}>
        <View style={{flexDirection:'row', alignItems:'center', marginBottom:10,marginTop:20}}>
            <Text 
                onPress={() => navigation.goBack()}
                style={{
                    fontSize:18,
                    marginRight:10,
                    color:'#2563EB',
                    fontFamily:'ManropeMedium'
                }}
            >
                ← Back
            </Text>
            <Text style={{ fontSize: 22, fontFamily:'ManropeBold', color:'#000000'}}>
                {name}'s Progress
            </Text>
        </View>
        

        <Text style={{ marginVertical: 10,fontFamily:'ManropeRegular',color:'#6B7280' }}>
            Email: {progress?.email}
        </Text>

        <FlatList
            data={progress?.progress}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
            <View
                style={{
                    padding: 15,
                    marginVertical: 8,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 10,
                    borderWidth:1,
                    borderColor:'#E5E7EB'
                }}
            >
                <Text style={{fontFamily:'ManropeBold',marginBottom:4,color:'#000000',fontSize:16}}>
                    {item.subtopicId?.name || item.topicId?.name || "Unknown Topic"}
                </Text>
                {item.subtopicId && item.topicId && (
                    <Text style={{fontFamily:'ManropeRegular',marginBottom:6,color:'#6B7280',fontSize:13}}>
                        Topic: {item.topicId.name}
                    </Text>
                )}
                 <View style={{
                        height:8,
                        backgroundColor:'#E5E7EB',
                        borderRadius:10,
                        overflow:'hidden',
                        marginBottom:10
                    }}>
                        <View style={{
                            width:`${item.bestScore}%`,
                            height:'100%',
                            backgroundColor:
                                item.bestScore >= 80 ? '#2563EB' :
                                item.bestScore >= 70 ? '#2563EB' :
                                '#DC2626'
                        }} />
                    </View>

                    <Text style={{
                        fontSize:14,
                        marginBottom:6,
                        color:'#6B7280'
                    }}>
                        Score: {item.bestScore}%
                    </Text>

                    <View style={{
                        flexDirection:'row',
                        justifyContent:'space-between'
                    }}>
                        <Text style={{
                            fontFamily:'ManropeSemiBold',
                            color: item.isCleared ? '#2563EB' : '#DC2626'
                        }}>
                            {item.isCleared ? 'Cleared' : 'Not Cleared'}
                        </Text>

                        <Text style={{
                            fontFamily:'ManropeSemiBold',
                            color: item.isUnlocked ? '#2563EB' : '#6B7280'
                        }}>
                            {item.isUnlocked ? 'Unlocked' : 'Locked'}
                        </Text>
                    </View>
                </View>
            )}
        />
    </View>
  )
}

