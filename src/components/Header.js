import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import { ArrowLeft, Bell, LogOut } from 'lucide-react-native';
import AppText from './AppText';

const Header=({
    title,
    showBack,
    onBackPress,
    rightLabel,
    onRightPress,
    rightLabelColor='#DC2626',
    onBellPress,
    unreadCount=0,
})=>{
    return (
        <View
            style={{height:100,paddingTop:50,
                paddingBottom:18,
                paddingHorizontal:16,
                backgroundColor:'#FFFFFF',
                justifyContent:'center',
                flexDirection:'row',
                alignItems:'center',
                shadowColor:'#0F172A',
                shadowOffset:{width:0,height:2},
                shadowOpacity:0.06,
                shadowRadius:8,
                elevation:3,
                zIndex:10,
            }}
        >
            {showBack&&(
                <TouchableOpacity
                    onPress={onBackPress}
                    disabled={!onBackPress}
                    activeOpacity={0.6}
                    style={{
                        position:'absolute',
                        left:12,
                        width:36,
                        height:36,
                        bottom:14,
                        borderRadius:18,
                        backgroundColor:'#F3F4F6',
                        justifyContent:'center',
                        alignItems:'center'
                    }}
                >
                    <ArrowLeft size={18} color="#0F172A" />
                </TouchableOpacity>
            )}
            <AppText variant="extraBold" style={{fontSize:17,color:'#0F172A',textAlign:'center',letterSpacing:0.2}} numberOfLines={1}>
                {title}
            </AppText>
            {(onBellPress || rightLabel) ? (
                <View
                    style={{
                        position:'absolute',
                        right:16,
                        bottom:14,
                        flexDirection:'row',
                        alignItems:'center',
                    }}
                >
                    {onBellPress ? (
                        <TouchableOpacity
                            onPress={onBellPress}
                            activeOpacity={0.7}
                            style={{
                                width:36,
                                height:36,
                                borderRadius:18,
                                backgroundColor:'#F3F4F6',
                                justifyContent:'center',
                                alignItems:'center',
                                marginRight: rightLabel ? 10 : 0,
                            }}
                        >
                            <Bell size={17} color="#374151" />
                            {unreadCount > 0 ? (
                                <View
                                    style={{
                                        position:'absolute',
                                        top:4,
                                        right:5,
                                        width:9,
                                        height:9,
                                        borderRadius:5,
                                        backgroundColor:'#DC2626',
                                        borderWidth:1.5,
                                        borderColor:'#FFFFFF',
                                    }}
                                />
                            ) : null}
                        </TouchableOpacity>
                    ) : null}
                    {rightLabel ? (
                        <TouchableOpacity
                            onPress={onRightPress}
                            activeOpacity={0.7}
                            style={{
                                minHeight:32,
                                justifyContent:'center',
                                alignItems:'center',
                                paddingHorizontal:12,
                                borderRadius:999,
                                backgroundColor: rightLabel === 'Logout' ? '#FEF2F2' : '#EEF2FF',
                                borderWidth:1,
                                borderColor: rightLabel === 'Logout' ? '#FEE2E2' : '#E0E7FF',
                            }}
                        >
                            <View style={{ alignItems: 'center',flexDirection:'row',gap:6 }}>
                                <AppText variant="bold" style={{ fontSize: 12, color: rightLabelColor }}>
                                    {rightLabel}
                                </AppText>
                                {rightLabel === 'Logout' ? <LogOut size={14} color={rightLabelColor} /> : null}
                            </View>
                        </TouchableOpacity>
                    ) : null}
                </View>
            ) : null}
        </View>
    )
}

export default Header;
