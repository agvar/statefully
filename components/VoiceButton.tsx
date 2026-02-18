import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { AudioRecorder, AudioManager } from 'react-native-audio-api';
import { useMoonshineModel } from '@/utils/moonshineTranscription';


interface VoiceButtonProps {
    onRecordingComplete : (text: string) => void;
    disabled?: boolean;
}

export default function VoiceButton({ onRecordingComplete, disabled = false }: VoiceButtonProps ) {
    const [ isTranscribing, setIsTranscribing ] = useState(false)
    const [ isRecording, setIsRecording ] = useState(false);
    const audioChunksRef = useRef<Float32Array[]>([]);
    const recorderRef = useRef<AudioRecorder|null>(null);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    useEffect(() =>{
        if(!isRecording && !disabled){
            startPulseAnimation();
        }
        else{
            stopPulseAnimation();
        }

    },[isRecording,disabled])
    
    useEffect(()=>{
        const recorder = new AudioRecorder();
        recorder.onAudioReady(
        {
            sampleRate: 16000,
            channelCount: 1,
            bufferLength:1600
        },
        ({buffer,numFrames,when})=>{
            const chunk = buffer.getChannelData(0);
            const chunkCopy = new Float32Array(chunk);
            audioChunksRef.current.push(chunkCopy);

        }
    );
    recorderRef.current= recorder;
    return () =>{
        recorder.clearOnAudioReady();
        recorderRef.current = null;
    }
    },[]);



    const handlePress= async() => {
        const recorder = recorderRef.current;
        if(disabled || !recorder) return ;
        try {
            if (!isRecording){
                console.log("Log: begin recording module");
                const permission = await AudioManager.requestRecordingPermissions();
                if(permission !== 'Granted'){
                    alert ("Microphone permission denied");
                    return
                }
                const activated = await AudioManager.setAudioSessionActivity(true);
                if(!activated){
                    alert ("Could not activate audio session");
                    return;
                }

                const result = recorder.start();
                if(result.status === 'error'){
                    console.error(result.message);
                    return;
                }
                setIsRecording(true);
            }
            else {
                await recorder.stop();
                await AudioManager.setAudioSessionActivity(false);
                setIsTranscribing(true)
                setIsRecording(false)
                //process audio chunks
                const chunks = audioChunksRef.current;
                const totalLength = chunks.reduce((sum,chunk)=> sum + chunk.length,0);
                const combinedAudio= new Float32Array(totalLength);
                let offset = 0;
                for (const chunk of chunks) {
                    combinedAudio.set(chunk,offset);
                    offset += chunk.length;
                }

                //clear for next recording
                audioChunksRef.current = [];

                //transcribe
                setIsTranscribing(true);
                const transcribeWithMoonshine = async (audio:Float32Array): Promise<string> =>{
                    console.log ("Audio samples to transcribe");
                    await new Promise(resolve => setTimeout(resolve,1000));
                    return `Test Transcription (${audio.length} samples, ${(audio.length/16000).toFixed(1)}s)`
                }

                try {
                    const text = await useMoonshineModel(combinedAudio);
                    onRecordingComplete(text);
                }catch(err){
                    console.error('Transcription error',err);
                }finally {
                    setIsTranscribing(false);
                }
            }
    }catch(err) {
            console.error(`Recording failed with Error: ${err}`)
        }
    }
;
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