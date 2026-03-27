import React,{useState} from 'react'
import {ScrollView, View,Text,} from 'react-native';
import Header from '../components/Header';
import Section from '../components/Section';
import Row from '../components/Row';

import userIcon from "../assests/userIcon.png";
import lockIcon from "../assests/LockIcons.png";
import bellIcon from "../assests/BellsIcon.png";
import mailIcon from "../assests/EmailIcon.png";
import bookIcon from "../assests/CourseIcon.png";
import moonIcon from "../assests/ThemeIcon.png";
import langIcon from "../assests/LanguageIcon.png";
import CacheIcon from '../assests/CacheIcon.png';
import PrivacyIcon from '../assests/PrivacyIcon.png';
import ServiceIcon from '../assests/ServiceIcon.png';
import downloadIcon from "../assests/DownloadIcon.png";
import wifiIcon from "../assests/WifiIcon.png";

export default function SettingScreen() {
    const [pushNotification, setPushNotification]=useState(true);
    const [emailNotification, setEmailNotification]= useState(true);
    const [courseUpdates, setCourseUpdates]= useState(true);
    const [darkMode, setDarkMode]= useState(false);
    const [autoDownload, setAutoDownload]= useState(false);
    const [wifiOnly, setWifiOnly] = useState(true);

  return (
    <View style={{flex:1,backgroundColor:'#F5F5F5'}}>
        <Header 
            title="Settings"
            showBack={true}
        />
        <ScrollView contentContainerStyle={{paddingTop:10}}>
            <Section title="Account">
                <Row
                    icon={userIcon}
                    title="Edit Profile"
                    subtitle="john.smith@gmail.com"
                    onPress={() => {}}
                />
                <Row
                    icon={lockIcon}
                    title="Change Password"
                    subtitle="Update your password"
                    onPress={() => {}}
                    isLast
                />
                </Section>

                <Section title="Notifications">
                <Row
                    icon={bellIcon}
                    title="Push Notifications"
                    subtitle="Receive push notifications"
                    isSwitch
                    value={pushNotification}
                    onValueChange={setPushNotification}
                />
                <Row
                    icon={mailIcon}
                    title="Email Notifications"
                    subtitle="Receive email updates"
                    isSwitch
                    value={emailNotification}
                    onValueChange={setEmailNotification}
                />
                <Row
                    icon={bookIcon}
                    title="Course Updates"
                    subtitle="New lessons & announcements"
                    isSwitch
                    value={courseUpdates}
                    onValueChange={setCourseUpdates}
                    isLast
                />
                </Section>

                <Section title="Preferences">
                <Row
                    icon={moonIcon}
                    title="Dark Mode"
                    subtitle="Enable dark theme"
                    isSwitch
                    value={darkMode}
                    onValueChange={setDarkMode}
                />
                <Row
                    icon={langIcon}
                    title="Language"
                    subtitle="English"
                    onPress={() => {}}
                    isLast
                />
                </Section>

                <Section title="Download Settings">
                <Row
                    icon={downloadIcon}
                    title="Auto Download"
                    subtitle="Download new lessons automatically"
                    isSwitch
                    value={autoDownload}
                    onValueChange={setAutoDownload}
                />
                <Row
                    icon={wifiIcon}
                    title="Download on WiFi Only"
                    subtitle="Save mobile data"
                    isSwitch
                    value={wifiOnly}
                    onValueChange={setWifiOnly}
                    isLast
                />
                </Section>

                <Section title="Other">
                <Row
                    icon={PrivacyIcon}
                    title="Privacy Policy"
                    onPress={() => {}}
                />
                <Row
                    icon={ServiceIcon}
                    title="Terms of Service"
                    onPress={() => {}}
                />
                <Row
                    icon={CacheIcon}
                    title="Clear Cache"
                    onPress={() => {}}
                    isLast
                />
                </Section>

                <Text
                    style={{
                        textAlign: "center",
                        color: "#999",
                        fontSize: 12,
                        marginTop: 10,
                    }}
                    >
                    Learner v1.0.0
                </Text>
        </ScrollView>
    </View>
  )
}
