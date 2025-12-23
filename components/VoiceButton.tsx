import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

interface VoiceButtonProps {
    onRecordingComplete : (text: string) => void;
}

export default function VoiceButton({ onRecordingComplete }: VoiceButtonProps ) {
    const [isRecording, setisRecording] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    const handlePress= () => {
        if(isRecording) {
            setisRecording(false);
            stopPulseAnimation();
            onRecordingComplete("This is a test thought");
        }
        else{
            setisRecording(true);
            startPulseAnimation();
        }
    };

    const startPulseAnimation = () =>{
        Animated.loop(
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(
                        scaleAnim,{
                            toValue: 1.15,
                            duration: 1000,
                            useNativeDriver: true
                        }
                    ),
                    Animated.timing(
                        scaleAnim,{
                            toValue: 1,
                            duration: 1000,
                            useNativeDriver: true
                        }
                    )
                ]),
                Animated.sequence([
                    Animated.timing(
                        opacityAnim,{
                            toValue: 0.7,
                            duration: 1000,
                            useNativeDriver: true
                        }
                    ),
                    Animated.timing(
                        opacityAnim,{
                            toValue: 1,
                            duration: 1000,
                            useNativeDriver: true
                        }
                    )
                ])
            ])
            
        ).start();
    };

    const stopPulseAnimation = () =>{
        scaleAnim.stopAnimation();
        opacityAnim.stopAnimation();

        Animated.parallel([
            Animated.timing(
                scaleAnim,{
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true
                }
            ),
            Animated.timing(
                opacityAnim,{
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true
                }
            )
        ]).start();
    }

    return(
        <View style={styles.container}>
            <Pressable onPress={handlePress}>
                {({ pressed}) => (
                    <Animated.View style = {[
                        styles.button,
                        isRecording && styles.buttonRecording,
                        pressed && styles.buttonPressed,
                        {
                            transform: [{scale: scaleAnim}],
                            opacity: opacityAnim

                        }
                    ]}>
                        <Ionicons
                            name = {isRecording ? "stop-circle-outline" : "mic-outline"}
                            size={40}
                            color="#ffffff"
                        />
                    </Animated.View>
                )}
            </Pressable>
            <Text style={styles.label}>
                {isRecording? "Tap to Stop" : "Tap to Speak"}

            </Text>
        </View>
    );

}

const styles = StyleSheet.create({
        container :{
            alignItems : 'center'
        },
        button :{
            width: 120,
            height: 120,
            borderRadius: BorderRadius.full,
            backgroundColor: Colors.flow,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: Colors.flow,
            shadowOffset: {width: 0, height:0},
            shadowOpacity: 0.5,
            shadowRadius: 20,
            elevation: 10

        },
        buttonRecording:{
            backgroundColor : Colors.drain,
            shadowColor: Colors.drain,
        },
        buttonPressed:{
            opacity: 0.8,
        },
        label:{
            marginTop: Spacing.md,
            fontSize: Typography.size.lg,
            color: Colors.text.dark.primary
        }

    
})