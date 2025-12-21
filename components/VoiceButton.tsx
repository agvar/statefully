import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface VoiceButtonProps {
    onRecordingComplete : (text: string) => void;
}

export default function VoiceButton({ onRecordingComplete }: VoiceButtonProps ) {
    const [isRecording, setisRecording] = useState(false);

    const handlePress= () => {
        if(isRecording) {
            setisRecording(false);
            onRecordingComplete("This is a test thought");
        }
        else{
            setisRecording(true);
        }
    };

    return(
        <View style={styles.container}>
            <Pressable onPress={handlePress}>
                {({ pressed}) => (
                    <View style = {[
                        styles.button,
                        isRecording && styles.buttonRecording,
                        pressed && styles.buttonPressed,
                    ]}>
                        <Ionicons
                            name = {isRecording ? "stop-circle-outline" : "mic-outline"}
                            size={40}
                            color="#ffffff"
                        />
                    </View>
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
            alignItems: 'center'
        },
        buttonRecording:{
            backgroundColor : Colors.drain,
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