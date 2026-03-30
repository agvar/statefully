import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { AudioRecorder, AudioManager } from 'react-native-audio-api';
import { useSpeechToText, WHISPER_TINY_EN_QUANTIZED} from 'react-native-executorch';
//import { useMoonshineModel } from '@/utils/moonshineTranscription';


interface VoiceButtonProps {
    onRecordingComplete : (text: string) => void;
    captureMode:'task'| 'thought';
}

export default function VoiceButton({ onRecordingComplete, captureMode }: VoiceButtonProps ) {
    const [ isTranscribing, setIsTranscribing ] = useState(false)
    const [ isRecording, setIsRecording ] = useState(false);
    const audioChunksRef = useRef<Float32Array[]>([]);
    const recorderRef = useRef<AudioRecorder|null>(null);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;
    const haloScaleAnim = useRef(new Animated.Value(1)).current;
    const haloOpacityAnim = useRef(new Animated.Value(0.6)).current;
    const recordingScaleAnim = useRef(new Animated.Value(1)).current;
    const {isReady, error, transcribe, downloadProgress} = useSpeechToText({
        model: WHISPER_TINY_EN_QUANTIZED
    });
    // TODO(future): Re-enable streaming transcription once the react-native-executorch
    // OnlineASR data-race bug is fixed. In OnlineASR::process(), audioCopy is created
    // correctly under mutex lock but then audioBuffer_ (not audioCopy) is passed to
    // asr_->transcribe(), causing a SIGSEGV when concurrent insertAudioChunk() calls
    // trigger a vector reallocation. Tracked in: https://github.com/software-mansion/react-native-executorch
    // To test a fix: git checkout -b test/streaming-fix && npm install react-native-executorch@<new-version>

    useEffect(() =>{
        if(!isRecording ){
            startPulseAnimation();
            startHaloAnimation();
            startRecordingAnimation();
        } else if(!isRecording && isReady){
            stopRecordingAnimation();
            startPulseAnimation();
            startHaloAnimation();
        }

        else{
            stopPulseAnimation();
            stopHaloAnimation();
            stopRecordingAnimation();
        }

    },[isRecording,isReady])
    
    useEffect(()=>{
        const recorder = new AudioRecorder();
        recorder.onAudioReady(
        {
            sampleRate: 16000,
            channelCount: 1,
            bufferLength:1600
        },
        ({buffer})=>{
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
        if(!recorder) return ;
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
                recorder.start();
                setIsRecording(true);
            }
            else {
                await recorder.stop();

                console.log("Stopping recording");
                await AudioManager.setAudioSessionActivity(false);
                setIsTranscribing(true);
                setIsRecording(false);

                const chunks = audioChunksRef.current;
                const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
                const combinedAudio = new Float32Array(totalLength);
                let offset = 0;
                for (const chunk of chunks) {
                    combinedAudio.set(chunk, offset);
                    offset += chunk.length;
                }
                audioChunksRef.current = [];

                try {
                    if (!isReady || error) {
                        throw new Error('Model is not loaded yet');
                    }
                    const result = await transcribe(combinedAudio);
                    const cleanedtext = cleanTranscription(result);
                    onRecordingComplete(cleanedtext);
                } catch(err) {
                    console.error('Transcription error', err);
                } finally {
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
    };

    const startHaloAnimation = () => {
        Animated.loop(
            Animated.parallel([
                Animated.timing(haloScaleAnim, {
                    toValue: 1.4,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(haloOpacityAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const stopHaloAnimation = () => {
        haloScaleAnim.stopAnimation();
        haloOpacityAnim.stopAnimation();
        haloScaleAnim.setValue(1);
        haloOpacityAnim.setValue(0.6);
    };

    const startRecordingAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(recordingScaleAnim, {
                    toValue: 1.08,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(recordingScaleAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const stopRecordingAnimation = () => {
        recordingScaleAnim.stopAnimation();
        Animated.timing(recordingScaleAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
        }).start();
    };

    const getMicLabel = () =>{
    if (!isReady && downloadProgress === 0) return 'Tap to activate mic';
    if (!isReady && downloadProgress > 0)   return `Loading model ${Math.round(downloadProgress * 100)}%`;
    if (isTranscribing)                     return 'Processing...';
    if (isRecording)                        return 'Listening...Tap again when done';  
    return captureMode === 'thought' ? 'Tap to record a thought' : 'Tap to record a task';
};

    

    return(
        <View style={styles.container}>
            <View style={styles.buttonWrapper}>
                <Animated.View style={[
                    styles.haloRing,
                    {
                        transform: [{ scale: haloScaleAnim }],
                        opacity: haloOpacityAnim,
                    }
                        ]} />
                <Pressable 
                onPress={handlePress}
                disabled = {isTranscribing  || !isReady}
                style ={[styles.button, (isTranscribing  || !isReady) && styles.buttonDisabled]}
                >
                    {({ pressed}) => (
                        <Animated.View style = {[
                            styles.button,
                            isRecording && styles.buttonRecording,
                            isTranscribing && styles.buttonTranscribing,
                            pressed && styles.buttonPressed,
                            !isReady && styles.buttonLoading,
                            {
                                transform: [{scale: isRecording? recordingScaleAnim: scaleAnim}],
                                opacity: opacityAnim

                            }
                        ]}>
                            <Ionicons
                                name = {isTranscribing? "hourglass-outline"
                                    : isRecording ? "mic-off-outline" 
                                    : "mic-outline"}
                                size={40}
                                color="#ffffff"
                            />
                        </Animated.View>
                    )}
                </Pressable>
            </View>
            


            {!isReady && downloadProgress > 0 && (
                <View style = {styles.progressContainer}>
                    <View style={[styles.progressFill, { width : downloadProgress * 120 }]} />
                </View>
            )

            }

            <Text style={[styles.label]}>{getMicLabel()}</Text>
        </View>
    );

}

const cleanTranscription = (raw: string): string => {
    return raw
        .replace(/\[.*?\]/g, '')      // removes [BLANK_AUDIO], [MUSIC], etc.
        .replace(/\(.*?\)/g, '')      // removes (wind blowing), (coughing), etc.
        .replace(/\s+/g, ' ')        // collapse multiple spaces
        .trim();
};

const styles = StyleSheet.create({
        container :{
            alignItems : 'center'
        },
        button :{
            width: 100,
            height: 100,
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
        buttonLoading: {
            opacity: 0.4,  
            backgroundColor: Colors.text.dark.tertiary, 
        },
        buttonRecording:{
            backgroundColor : '#FF3B30',
            shadowColor: '#FF3B30',
        },
        buttonTranscribing:{
            backgroundColor : Colors.drain,
            shadowColor: Colors.drain,
        },
        buttonPressed:{
            opacity: 0.8,
        },
        label:{
            marginTop: Spacing.sm,
            fontSize: Typography.size.base,
            color: 'rgba(255, 255, 255, 0.6)',
        },
        labelDisabled: {
            color: Colors.text.dark.tertiary,  
        },
        progressContainer:{
            width:120,
            height: 4,
            backgroundColor : 'rgba(255,255,255,0.2)',
            borderRadius: BorderRadius.full,
            marginTop: Spacing.sm,
            overflow: 'hidden',
        },
        progressFill:{
            height: '100%',
            backgroundColor: Colors.flow,
            borderRadius: BorderRadius.full,
        },
        buttonWrapper: {
            width: 120,
            height: 120,
            justifyContent: 'center',
            alignItems: 'center',
        },
        haloRing: {
            position: 'absolute',
            width: 120,
            height: 120,
            borderRadius: BorderRadius.full,
            borderWidth: 2,
            borderColor: Colors.flow,
            backgroundColor: 'transparent',
        },
        partialText: {
            marginTop: Spacing.sm,
            fontSize: Typography.size.sm,
            color: 'rgba(255,255,255,0.6)',
            textAlign: 'center',
            paddingHorizontal: Spacing.lg,
},

    
})