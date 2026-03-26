import {View,Dimensions} from 'react-native';
const {width} = Dimensions.get("window");

export default function ProgressBar({step=1}){
    const total=3;
    const padding=32;
    const gap=10;
    const segmentWidth=(width-padding-gap*(total-1))/total;

    return(
        <View style={{position:'absolute',top:60,width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
            {[1,2,3].map((item,index)=>(
                <View
                    key={index}
                    style={{
                        width:segmentWidth,
                        marginRight:index!==total-1?gap:0,
                        height:7,
                        borderRadius:30,
                        backgroundColor:index===step?'#FFFFFF':'rgba(255,255,255,0.3)'
                    }}
                />
            ))}
        </View>
    )
}