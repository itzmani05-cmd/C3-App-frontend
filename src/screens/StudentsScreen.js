import React,{useState,useEffect} from 'react'
import {View,Text,FlatList,TouchableOpacity,Alert} from 'react-native';
import axios from 'axios';
import Header from '../components/Header';
import { API_BASE_URL } from '../config/api';

export default function StudentsScreen ({ navigation }) {
    const [students,setStudents]=useState([]);

    const handleLogout = () => {
        Alert.alert('Logout', 'Do you want to log out now?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: () => {
                    global.userId = null;
                    global.user = null;
                    const rootNavigation =
                        navigation.getParent?.()?.getParent?.() ||
                        navigation.getParent?.() ||
                        navigation;

                    if (rootNavigation?.replace) {
                        rootNavigation.replace('Login');
                    } else {
                        navigation.navigate('Login');
                    }
                },
            },
        ]);
    };

    const fetchStudents=async()=>{
        try{
            const res=await axios.get(
                `${API_BASE_URL}/api/admin/students`
            );
            setStudents(res.data);
        }
        catch(err){
            console.log(err);
            Alert.alert("Error","Failed to fetch students");
        }
    };

    useEffect(()=>{
        fetchStudents();
    },[]);

    const handleDelete=(id)=>{
        Alert.alert(
            "Confirm",
            "Delete this student?",
            [
                {text:'Cancel'},
                {
                    text:'Delete',
                    onPress:async()=>{
                        try{
                            await axios.delete(
                                `${API_BASE_URL}/api/admin/students/${id}`
                            );
                            Alert.alert("Deleted","Student removed");
                            fetchStudents();
                        }
                        catch(err){
                            console.log(err);
                            Alert.alert("Error","Delete failed");
                        }
                    }
                }
            ]
        )
    };

    const renderItem=({item})=>(
        <View style={{backgroundColor:'#FFFFFF',padding:15,borderRadius:10,flexDirection:'row',justifyContent:'space-between',alignItems:"center",borderColor:'#E5E7EB',borderWidth:1,marginBottom:5}}>
            <View>
                <Text style={{fontFamily:'ManropeRegular',color:'#000000'}}>{item.name}</Text>
                <Text style={{fontFamily:'ManropeRegular',color:'#6B7280'}}>{item.email}</Text>
            </View>
            <TouchableOpacity
                onPress={()=>handleDelete(item._id)}
                style={{borderRadius:8,paddingHorizontal:12,paddingVertical:6,backgroundColor:'#DC2626'}}
            >
                <Text style={{color:"#FFFFFF",fontFamily:'ManropeBold'}}>Delete</Text>
            </TouchableOpacity>
        </View>
    )

  return (
    <View style={{flex:1,backgroundColor:'#F8FAFC'}}>
         <Header 
            title="Students List"
            showBack={false}
            rightLabel="Logout"
            onRightPress={handleLogout}
        />
        <Text style={{fontFamily:'ManropeMedium',color:'#6B7280',marginBottom:10,paddingHorizontal:15,marginTop:10}}>
           Total: {students.length} Students
        </Text>
        <FlatList 
            style={{marginHorizontal:20}}
            data={students}
            keyExtractor={(item)=>item._id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
        />
    </View>
  )
}
