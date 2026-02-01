import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { transcribeAudio } from '@/utils/transcription';
import { Ionicons } from '@expo/vector-icons';
import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import { File, Paths } from 'expo-file-system';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';


interface VoiceButtonProps {
    onRecordingComplete : (text: string) => void;
    disabled?: boolean;
}

export default function VoiceButton({ onRecordingComplete, disabled = false }: VoiceButtonProps ) {
    const [isTranscribing, setIsTranscribing ] = useState(false)
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const recorderState = useAudioRecorderState(audioRecorder);
    const isRecording = recorderState.isRecording

    useEffect(() =>{
        if(!isRecording && !disabled){
            startPulseAnimation();
        }
        else{
            stopPulseAnimation();
        }

    },[isRecording,disabled])
    


    const handlePress= async() => {
        if(disabled) return ;
        //check for permission, request if needed
        console.log("Log: Recording started")
        console.log("Log: requesting permission")
        const status = await AudioModule.getRecordingPermissionsAsync();
        if (status.status !== 'granted'){
            const request = await AudioModule.requestRecordingPermissionsAsync();
            if (!request.granted) {
            alert("Permission to access microphone was denied ");
            console.log("Log: permission to microphone denied")
            return ;
            }
        }
        try {
            console.log("Log: Permission complete");
            await setAudioModeAsync({
                    allowsRecording:true,
                    playsInSilentMode:true
                }
            );
            console.log("Log: setAudioModeAsync succeeded");
        }
        catch(err){
            console.error("Failed to start recording")
        }

        if (!isRecording){
            console.log("Log: begin recording module");
            await audioRecorder.prepareToRecordAsync();
            await audioRecorder.record();
            console.log("Log: end recording module");
        }
        else {
            console.log("Log: start Stop record module");
            await audioRecorder.stop();
            const fileUri = audioRecorder.uri;
            setIsTranscribing(true)
            console.log(`Log: file saved is ${fileUri}`);
            if(fileUri) {
                try {
                    const destinationFileName = `recording-${Date.now()}.m4a`
                    const sourceFile = new File(fileUri)
                    const destinationFile = new File(Paths.document,destinationFileName)
                    await sourceFile.move(destinationFile)
                    console.log(`Log: Destination file is ${destinationFile}`);
                    console.log("Log: start Transcription module");

                    const transcript = await transcribeAudio(destinationFile);
                    onRecordingComplete(transcript);
                }
                catch(err) {
                    console.error(`Recording failed with Error: ${err}`)
                }
                finally {
                    setIsTranscribing(false);
                }
            }

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
            <Pressable 
            onPress={handlePress}
            disabled = {isTranscribing || disabled}
            style ={[styles.button, disabled && styles.buttonDisabled]}
            >
                {({ pressed}) => (
                    <Animated.View style = {[
                        styles.button,
                        isRecording && styles.buttonRecording,
                        isTranscribing && styles.buttonTranscribing,
                        pressed && styles.buttonPressed,
                        {
                            transform: [{scale: scaleAnim}],
                            opacity: opacityAnim

                        }
                    ]}>
                        <Ionicons
                            name = {isTranscribing? "hourglass-outline"
                                : isRecording ? "stop-circle-outline" 
                                : "mic-outline"}
                            size={40}
                            color="#ffffff"
                        />
                    </Animated.View>
                )}
            </Pressable>

            <Text style={[styles.label,disabled && styles.labelDisabled]}>
                {isTranscribing
                ? "Processing..."
                :isRecording
                ? "Tap to Stop" 
                :disabled
                ?"Activity in progress"
                : "Tap to Speak"}

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
        buttonDisabled: {
            opacity: 0.4,  
            backgroundColor: Colors.text.dark.tertiary, 
        },
        buttonRecording:{
            backgroundColor : Colors.background.light,
            shadowColor: Colors.background.light,
        },
        buttonTranscribing:{
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
        },
        labelDisabled: {
            color: Colors.text.dark.tertiary,  
}

    
})