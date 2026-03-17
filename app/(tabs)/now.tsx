import ActiveActivityCard from '@/components/cards/ActiveActivityCard';
import CompletedActivityCard from '@/components/cards/CompletedActivityCard';
import UntaggedActivityCard from '@/components/cards/UntaggedActivityCard';
import ThoughtTaggingSheet from '@/components/ThoughtTaggingSheet';
import ThoughtCard from '@/components/cards/ThoughtCard';
import { LinearGradient } from 'expo-linear-gradient';
import {buildReflectionPrompt, ReflectionContext } from '@/utils/buildReflectionPrompt';


import VoiceButton from '@/components/VoiceButton';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useStore } from '@/store/useStore';
import { EnergyState, Intensity, EmotionState } from '@/types/index';
import { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
const EMOTION_EMOJI_ARRAY:Record<EmotionState, string> = {
    alive: '🌊',
    calm: '😌',
    low: '😶',
    wired: '😤',
    };

export default function NowScreen(){
    const activeTask = useStore(state => state.activeTask);
    const unTaggedActivities = useStore(useShallow(state => state.getUntaggedActivities()));
    const allCompleted = useStore(useShallow(state => state.getCompletedActivities()));
    //const clearActivities = useStore(state => state.clearAllActivities)

    const startTask = useStore(state => state.startTask)
    const stopTask = useStore(state => state.stopTask)
    const tagTask = useStore(state => state.tagTask)
    const addThought = useStore(state =>state.addThought);
    const incrementThoughtRecurrence = useStore(state => state.incrementThoughtRecurrence);
    const addEmotionCheckin = useStore(state => state.addEmotionCheckin)
 
    const [captureMode,setCaptureMode] = useState<'task'|'thought'>('task');
    const [pendingThought, setPendingThought] = useState<string| null>(null);
    const [taggingSheetVisible, setTaggingSheetVisible] = useState(false);
    const [selectedEmotion, setSelectedEmotion] = useState<EmotionState| null>(null);

    //check prompt for LLM start
    const checkPromptLLM = ():string =>{
        const store = useStore.getState();
        const today = new Date();
        const startOfToday = new Date(today);
        startOfToday.setHours(0,0,0,0);
        if (selectedEmotion) {
            const ctx: ReflectionContext = {
            currentEmotion: selectedEmotion,
            tasks: store.getTasksForDateRange(startOfToday, today),
            thoughts: store.getThoughtsForDateRange(startOfToday, today),
            emotions: store.getEmotionCheckInsForDateRange(startOfToday, today),
            windowLabel: 'today',
            };
            const prompt = buildReflectionPrompt(ctx);
            return prompt
        } else {
            return ''
        }
    }

    //Handle voice input ->start new activity
    const handleVoiceInput = (transcription: string) => {
            const activityName = transcription;
            if (activityName.length === 0){
                Alert.alert("No Speech Detected", "No activity was created. Please try again.");
                return;
            } 
            if(captureMode=='thought' || activeTask !== null){
                setPendingThought(transcription);
                setTaggingSheetVisible(true);
            } else {
                try {
                    startTask(activityName, 'voice',transcription )
                    // prompt check
                     const prompt = checkPromptLLM();
                     console.log(`LLM prompt:${prompt}`)

                } catch(error){
                    Alert.alert('Stop current activity before starting a new one');
                }
                
            }
    };

    const handleThoughtTagged = (intensity:Intensity, energyState:EnergyState) =>{
        if(!pendingThought) return;
        addThought(pendingThought,intensity,energyState,'voice',pendingThought);

        setPendingThought(null);
        setTaggingSheetVisible(false);
        setCaptureMode('task');
    };

    const handleThoughtCancelled= () => {
        setPendingThought(null);
        setTaggingSheetVisible(false);
    }

    //Handle tagging
    const handleTag = (id:string, energyState: EnergyState): void => {
        tagTask(id,energyState);
    };


    return(
        <View style = {styles.container}>
            <LinearGradient 
                colors={[Colors.gradient.auroraStart,Colors.background.dark,Colors.gradient.auroraEnd]}
                style={StyleSheet.absoluteFill}
            />
            {/* Header */}
            <View style = {styles.header}>
                <Text style = {styles.title}>Now ⚡</Text>
            </View>

            {/* Scrollable Content */}
        <FlatList
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                <>
                    {/*Emotion Check in section*/}
                    <Text style={styles.emotionLabel}> What is your inner weather now? </Text>
                    <View style={styles.pillRow}>
                        {( Object.entries(EMOTION_EMOJI_ARRAY).map( ([emotion, emoji ])=> (
                            <TouchableOpacity
                                key= {emotion}
                                style={[styles.pill ,selectedEmotion === emotion as EmotionState 
                                && { backgroundColor: Colors.emotionGlow[emotion as EmotionState], 
                                     borderColor: Colors.emotion[emotion as EmotionState],
                                     shadowColor: Colors.emotion[emotion as EmotionState], // glow color
                                     shadowOpacity: 0.6,                                             // glow intensity
                                     shadowRadius: 8,                                                // glow spread
                                     shadowOffset: { width: 0, height: 0 },                         // centered glow
                                     elevation: 6,                                                  //Android
                                    
                                       }
                                 ]}
                                onPress = {()=> {
                                    addEmotionCheckin(emotion as EmotionState);
                                    setSelectedEmotion(emotion as EmotionState)  ;  
                                }
                                }
                            >
                                <Text style={[styles.pillText,selectedEmotion === emotion as EmotionState && styles.pillTextActive]}>
                                    {emoji}{emotion}
                                </Text>
                            </TouchableOpacity>
                        ))
                        )}
                    </View>


                    {/*Active Activity section*/}
                    {
                        activeTask &&(
                            <ActiveActivityCard
                                activity={activeTask}
                                onStop={stopTask}
                            />
                        )
                    }

                    {/*Untagged Activities section */}
                    {
                        unTaggedActivities.map(activity=>(
                            <UntaggedActivityCard 
                                key={activity.id}
                                activity={activity}
                                onTag= {(energyState) =>{handleTag(activity.id,energyState)}}
                            />
                        ))
                    }
                    {/*Section header for completed */}
                    {
                        allCompleted.length >0 &&(
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Recent</Text>
                            </View>
                        )
                    }
                </>
            }
            data = {allCompleted}
            renderItem={({ item }) => 
                item.type === 'thought'
                ? <ThoughtCard thought={item} onAgain={incrementThoughtRecurrence} />
                : <CompletedActivityCard activity={item} />
            }
            keyExtractor={item=> item.id}
            ListEmptyComponent={
                !activeTask && unTaggedActivities.length == 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>
                            Tap the microphone to start tracking your first Thought or Task
                        </Text>
                    </View>
                ): null
            }
        />
        {/* Mode toggle- only visible when no active task */}
        { !activeTask && (
            <View style={styles.modeToggle}>
                <TouchableOpacity
                    style= {[styles.modeButton, captureMode === 'task' && styles.modeButtonActive]}
                    onPress ={() => setCaptureMode('task')}
                >
                    <Text style={captureMode === 'task' ? styles.modeButtonTextActive : styles.modeButtonText}>
                        📋 Task
                    </Text>
                </TouchableOpacity>
                                <TouchableOpacity
                    style= {[styles.modeButton, captureMode === 'thought' && styles.modeButtonActive]}
                    onPress ={() => setCaptureMode('thought')}
                >
                    <Text style={captureMode === 'thought' ? styles.modeButtonTextActive : styles.modeButtonText}>
                        💭 Thought
                    </Text>
                </TouchableOpacity>
            </View>
        )

        }

        {/*  Voice Button (Fixed at the Bottom) */}
        <View style= {styles.voiceButtonContainer}>
                <VoiceButton onRecordingComplete={handleVoiceInput}
                captureMode= {captureMode}
            />
        </View>
            <ThoughtTaggingSheet 
                visible= {taggingSheetVisible}
                transcription={pendingThought}
                onConfirm={handleThoughtTagged}
                onCancel={handleThoughtCancelled}
            />
        </View>


    );
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        //backgroundColor : Colors.background.dark,
    },
    header:{
        paddingTop: Spacing['2xl'] + 20, // Safe area + spacing
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.md,
        //backgroundColor: Colors.background.dark
    },
    title :{
        fontSize: Typography.size['4xl'],
        fontWeight: Typography.weight.bold,
        color:Colors.text.dark.primary,
    },
    scrollContent: {
        flex: 1,
    },
    scrollContentContainer: {
        paddingBottom: Spacing.xl,
    },
    sectionHeader: {
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.sm,
    },
    sectionTitle: {
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.semibold,
        color: Colors.text.dark.secondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    emptyState: {
        padding: Spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing['3xl'],
    },
    emptyText: {
        fontSize: Typography.size.base,
        color: Colors.text.dark.secondary,
        textAlign: 'center',
        lineHeight: Typography.size.base * 1.5,
    },
    voiceButtonContainer:{
        paddingVertical: Spacing.lg,
        paddingHorizontal:Spacing.md,
        //backgroundColor:Colors.background.dark,
        borderTopWidth:1,
        borderTopColor: Colors.border.dark
    },
    modeToggle:{
        flexDirection:'row',
        backgroundColor: Colors.background.surface,   // #111111 subtle track
        borderRadius: BorderRadius.full,               // full pill shape
        padding: 3,                                    // inner padding so active pill floats
        marginHorizontal: Spacing.md,                  // contain to screen width
        marginBottom: Spacing.xs,
    },
    modeButton:{
        flex:1,
        alignItems:'center',
        paddingVertical: Spacing.sm,                   // slightly taller than before
        borderRadius: BorderRadius.full,               // pill-shaped active state


    },
    modeButtonActive:{
        backgroundColor: Colors.flow,

    },
    modeButtonText:{
        color:Colors.text.dark.secondary,
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.medium,
    },
    modeButtonTextActive:{
        color:Colors.text.dark.primary,
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.semibold,        // slightly bolder when active
    },
    pillRow:{
        flexDirection:'row',
        flexWrap: 'wrap',
        justifyContent:'center',
        marginVertical: Spacing.md

    },
    pill:{
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,      // pill shape
        borderWidth: 1,
        borderColor: Colors.border.dark,
        marginHorizontal: 4,  
        marginBottom: 4                 //gap between pills
    },
    pillText:{
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.medium,
        color: Colors.text.dark.secondary,
    },
    pillTextActive:{
        color: Colors.text.dark.primary,
    },
    emotionLabel: {
        fontSize: Typography.size.lg,
        fontWeight: Typography.weight.medium,
        color: Colors.text.dark.secondary,
        marginBottom: Spacing.xs,
        paddingHorizontal:Spacing.md,
        marginTop:Spacing.sm
},
});