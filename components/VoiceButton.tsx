import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { AudioRecorder, AudioManager } from 'react-native-audio-api';
import { useSpeechToText} from 'react-native-executorch';


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
    //const { isReady, error, transcribe } = useMoonshineModel();
    const { transcribe, error,downloadProgress, isReady,isGenerating } = useSpeechToText({
        model: {
            isMultilingual: false,
            encoderSource: require('../assets/models/moonshine_tiny_xnnpack_encoder.pte'),
            decoderSource: require('../assets/models/moonshine_tiny_xnnpack_decoder.pte'),
            tokenizerSource: require('../assets/models/moonshine_tiny_tokenizer.json'),
        }
    });

    console.log('Voice button rendered error value:',error);
    console.log('Voice button rendered isReady value:',isReady);
    console.log('Voice button  download progress value:',downloadProgress);
    console.log('Voice button  isGenerating:',isGenerating);

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
                console.log("Microphone permission granted");
                await AudioManager.setAudioSessionOptions({
                    iosCategory: 'record',
                    iosMode: 'default',
                    iosOptions: [],
                });

                const activated = await AudioManager.setAudioSessionActivity(true);
                if(!activated){
                    alert ("Could not activate audio session");
                    return;
                }
                console.log("Microphone audio session activated");

                const result = recorder.start();
                console.log(`recorder status: ${result.status}`);
                if(result.status === 'error'){
                    console.error(result.message);
                    return;
                }
                setIsRecording(true);
            }
            else {
                await recorder.stop();
                console.log("Stopping recording")
                if (!isReady){
                    console.error ('Models not loaded yet');
                }
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
                console.log("Copy audio ")
                //clear for next recording
                audioChunksRef.current = [];

                //transcribe
                setIsTranscribing(true);

                try {
                    if(!isReady || error) {
                        throw new Error('Model is not loaded yet');
                    }
                    const text = await transcribe(combinedAudio);
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
            disabled = {isTranscribing || disabled || !isReady}
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