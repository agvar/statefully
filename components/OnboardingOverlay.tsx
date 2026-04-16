import { useState } from "react"
import { Modal , StyleSheet, View, Text} from "react-native"
import { Colors } from "@/constants/theme";

const steps = [
    { emoji: '🌤', title: 'Track your inner weather', description: '...' },
    { emoji: '🎙', title: 'Capture tasks by voice', description: '...' },
    { emoji: '💭', title: 'Log thoughts as they come', description: '...' },
    { emoji: '✨', title: 'Reflect with Pulse', description: '...' },
];

interface OnBoardingOverlayProps{
    onComplete :() => void;
}

export  function OnBoardingOverlay(){ 
    const [step, setStep] = useState(0);

         return(
                <Modal
                    transparent={true}
                    animationType='fade'
                    visible={true}
                >
                    <View style={styles.backdrop}>
                        <View style={styles.card}>
                            {steps.map((item,step) =>
                            <View>
                                <Text>{steps[step].emoji}</Text>
                                <Text>{steps[step].title}</Text>
                                <Text>{steps[step].description}</Text>     
                            </View>     
                            )  
                            }  
                        </View>
                </View>

                </Modal>

    )
}

const styles = StyleSheet.create({
    backdrop: {
        flex :1,
        backgroundColor:'rgba(0,0,0,0.75)',
        justifyContent:'center',
        alignItems:'center'
    },
    card: {
        backgroundColor:'#1C1C1E',
        borderRadius:20,
        padding:28,
        width:'85%'
    }
})