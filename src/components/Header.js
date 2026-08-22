import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import { ArrowLeft, LogOut } from 'lucide-react-native';
import AppText from './AppText';

const Header=({
    title,
    showBack,
    onBackPress,
    rightLabel,
    onRightPress,
    rightLabelColor='#DC2626'
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
            {rightLabel==='Logout' ? (
                <TouchableOpacity
                    onPress={onRightPress}
                    activeOpacity={0.7}
                    style={{
                        position:'absolute',
                        right:16,
                        bottom:16,
                        minHeight:32,
                        justifyContent:'center',
                        alignItems:'center',
                        paddingHorizontal:12,
                        borderRadius:999,
                        backgroundColor:'#FEF2F2',
                        borderWidth:1,
                        borderColor:'#FEE2E2',
                    }}
                >
                    <View style={{ alignItems: 'center',flexDirection:'row',gap:6 }}>
                        <AppText variant="bold" style={{ fontSize: 12, color: rightLabelColor }}>
                            {rightLabel}
                        </AppText>
                        <LogOut size={14} color={rightLabelColor} />
                    </View>
                </TouchableOpacity>
            ) : null}
        </View>
    )
}

export default Header;
