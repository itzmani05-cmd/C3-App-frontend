import {View,Dimensions} from 'react-native';
const {width} = Dimensions.get("window");

export default function ProgressBar({step=1,style}){
    const gap=10;

    return(
        <View style={[{position:'absolute',top:60,left:20,right:20,flexDirection:'row',}]}>
            {[1,2,3].map((item,index)=>(
                <View
                    key={index}
                    style={{
                        width:112.66,
                        height:7,
                        borderRadius:30,
                        backgroundColor:'#FFFFFF',
                        opacity:index<step?1:0.3,
                        marginRight:index!==2?gap:0
                    }}
                />
            ))}
        </View>
    )
}
