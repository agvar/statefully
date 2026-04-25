import { useState } from "react"
import { Modal , StyleSheet, View, Text, TouchableOpacity,KeyboardAvoidingView, Platform} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from "@/constants/theme";

const steps = [
    {
        emoji: '🌤',
        title: 'Track your inner weather',
        description: 'Tap an emotion pill anytime to log how you\'re feeling. Your mood shapes everything — capture it in the moment.',
    },
    {
        emoji: '🎙',
        title: 'Capture tasks by voice',
        description: 'Hold the mic and speak what you\'re working on. Statefully starts a timer and waits for you to mark it Flow or Drain.',
    },
    {
        emoji: '💭',
        title: 'Log thoughts as they come',
        description: 'Switch to Thought mode to speak a worry, idea, or distraction. It\'s stored instantly — no interruptions to your focus.',
    },
    {
        emoji: '✨',
        title: 'Reflect with Pulse',
        description: 'Open the Pulse tab and tap Reflect. Your on-device AI reads your day and offers a brief, honest observation.',
    },
];

interface OnboardingOverlayProps{
    onComplete :() => void;
}

export  default function OnboardingOverlay({onComplete}:OnboardingOverlayProps){ 
    const [step, setStep] = useState(0);

         return(
                <Modal
                    transparent={true}
                    animationType='fade'
                    visible={true}
                >
                    <SafeAreaView style={styles.container} edges={['top']}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding': 'height'}
                            style={{ flex:1 }}
                        >
                            <View style={styles.backdrop}>
                                <View style={styles.card}>
                                    <Text style={styles.emoji}>{steps[step].emoji}</Text>
                                    <Text style={styles.title}>{steps[step].title}</Text>
                                    <Text style={styles.description}>{steps[step].description}</Text> 

                                    <View style={styles.dots}>
                                        {[0,1,2,3].map(i => (
                                            <View key={i} style={[styles.dot, step === i && styles.dotActive]} />
                                        ))} 
                                    </View>

                                    <TouchableOpacity style={styles.button} 
                                        onPress={() => {
                                            if (step < steps.length - 1) {
                                                setStep(step + 1);
                                            } else {
                                                onComplete();
                                            }
                                        }}>
                                        <Text style={styles.buttonText}>{step < steps.length - 1 ? 'Next →' : 'Got it'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                
                    </SafeAreaView>

                </Modal>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.light,
    },
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
    },
    dots: {
        flexDirection: 'row',
        gap: 6,
        justifyContent: 'center',
        marginVertical: 20,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.25)',
    },
    dotActive: {
        width: 18,
        backgroundColor: Colors.flow,   // your blue accent
    },
    emoji: { 
        fontSize: 40, 
        textAlign: 'center', 
        marginBottom: 12 },

    title: { 
        fontSize: 20, 
        fontWeight: '700', 
        color: Colors.text.dark.primary, 
        textAlign: 'center', 
        marginBottom: 8 
    },
    description: { 
        fontSize: 15, 
        color: Colors.text.dark.secondary, 
        textAlign: 'center', lineHeight: 22 
    },
    button: { 
        backgroundColor: Colors.primary, 
        borderRadius: 12, 
        paddingVertical: 14, 
        alignItems: 'center', 
        marginTop: 8 
    },
    buttonText: { 
        color: '#FFFFFF', 
        fontWeight: '600', 
        fontSize: 16 },
    })