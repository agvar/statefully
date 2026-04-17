import ActiveActivityCard from '@/components/cards/ActiveActivityCard';
import CompletedActivityCard from '@/components/cards/CompletedActivityCard';
import UntaggedActivityCard from '@/components/cards/UntaggedActivityCard';
import ThoughtTaggingSheet from '@/components/ThoughtTaggingSheet';
import ThoughtCard from '@/components/cards/ThoughtCard';
import { LinearGradient } from 'expo-linear-gradient';
import {buildReflectionPrompt, ReflectionContext } from '@/utils/buildReflectionPrompt';
import { EMOTION_EMOJI,Activity,EmotionCheckin } from '@/types/index';
import EmotionPillRow from '@/components/cards/EmotionPillRow';
import { Ionicons } from '@expo/vector-icons';
import OnBoardingOverlay from '@/components/OnboardingOverlay';

import VoiceButton from '@/components/VoiceButton';
import { BorderRadius, Colors, Layout, Spacing, Typography } from '@/constants/theme';
import { useStore } from '@/store/useStore';
import { EnergyState, Intensity, EmotionState } from '@/types/index';
import { useEffect, useState, useMemo} from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import EmotionCheckinCard from '@/components/cards/EmotionCheckinCard';
import TextCaptureSheet from '@/components/TextCaptureSheet';

type RecentItem =
    | {kind:'activity',item: Activity,timestamp:Date}
    | {kind:'emotion',item: EmotionCheckin,timestamp:Date}

export default function NowScreen(){
    const activeTask = useStore(state => state.activeTask);
    const unTaggedActivities = useStore(useShallow(state => state.getUntaggedActivities()));
    const completedActivities = useStore(useShallow(state => state.getCompletedActivities()));
    const todayEmotions = useStore(useShallow(state => state.getEmotionCheckInsForDate(new Date())));
    //const clearActivities = useStore(state => state.clearAllActivities)

    const startTask = useStore(state => state.startTask)
    const stopTask = useStore(state => state.stopTask)
    const tagTask = useStore(state => state.tagTask)
    const addThought = useStore(state =>state.addThought);
    const resurfaceThought = useStore(state => state.resurfaceThought);
    const addEmotionCheckin = useStore(state => state.addEmotionCheckin);
    const deleteEmotionCheckin = useStore(state => state.deleteEmotionCheckin);
    const onboardingComplete = useStore(state=> state.onboardingComplete);
    const setOnboardingComplete = useStore(state => state.setOnboardingComplete)
 
    const [captureMode,setCaptureMode] = useState<'task'|'thought'>('task');
    const [pendingThought, setPendingThought] = useState<string| null>(null);
    const [taggingSheetVisible, setTaggingSheetVisible] = useState(false);
    const [selectedEmotion, setSelectedEmotion] = useState<EmotionState| null>(null);
    const [emotionConfirmed, setEmotionConfirmed] = useState(false);
    const [anchorToast,setAnchorToast] = useState<EmotionState | null>(null);
    const [textCaptureVisible, setTextCaptureVisible] = useState(false);

    useEffect(()=>{
        const recent = useStore.getState().emotionCheckIns[0];
        if (recent) setSelectedEmotion(recent.state);
    },[]);

    useEffect(() => {
        if(activeTask) setCaptureMode('thought');
    },[activeTask]);

    const recentItems = useMemo<RecentItem[]>(() =>{
        const activityItems = completedActivities.map((activity:Activity)=>({
            kind: 'activity' as const,
            item: activity,
            timestamp: new Date(activity.startTime)
        }));
        const emotionItems = todayEmotions.map((emotion:EmotionCheckin)=>({
            kind: 'emotion' as const,
            item: emotion,
            timestamp: new Date(emotion.timestamp)
        }));
        return [...activityItems,...emotionItems]
            .sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
    },[completedActivities,todayEmotions])

    //check prompt for LLM start
    const checkPromptLLM = ():string =>{
        const store = useStore.getState();
        const today = new Date();
        const startOfToday = new Date(today);
        startOfToday.setHours(0,0,0,0);
        const ctx: ReflectionContext = {
        tasks: store.getTasksForDateRange(startOfToday, today),
        thoughts: store.getThoughtsForDateRange(startOfToday, today),
        emotions: store.getEmotionCheckInsForDateRange(startOfToday, today),
        windowLabel: 'today',
        };
        const prompt = buildReflectionPrompt(ctx);
        return prompt

    }

    //Handle voice input ->start new activity
    const handleVoiceInput = (transcription: string) => {
            const activityName = transcription;
            if (activityName.length === 0){
                Alert.alert("No Speech Detected", "No activity was created. Please try again.");
                return;
            } 
            const emotionAtCapture = useStore.getState().getRecentEmotion();

            if(captureMode=='thought' || activeTask !== null){
                setPendingThought(transcription);
                setTaggingSheetVisible(true);
            } else {
                try {
                    startTask(activityName, 'voice',transcription,emotionAtCapture )
                    if(emotionAtCapture) {
                        setAnchorToast(emotionAtCapture);
                        setTimeout(()=> setAnchorToast(null), 2500);
                    }
                    

                } catch(error){
                    Alert.alert('Stop current activity before starting a new one');
                }
                
            }
    };

    const handleThoughtTagged = (intensity:Intensity, energyState:EnergyState,emotionAtCapture?:EmotionState) =>{
        if(!pendingThought) return;
        addThought(pendingThought,intensity,energyState,'voice',pendingThought,emotionAtCapture);

        setPendingThought(null);
        setTaggingSheetVisible(false);
        setCaptureMode('task');
    };

    const handleThoughtCancelled= () => {
        setPendingThought(null);
        setTaggingSheetVisible(false);
    }

    //Handle tagging
    const handleTag = (id:string, energyState: EnergyState,emotionAtCompletion?:EmotionState|null): void => {
        tagTask(id,energyState,emotionAtCompletion);
    };
    const handleTextCapture = (text: string)=>{
        //setTextThoughtVisible(false);
        //setPendingThought(text);
        //setTaggingSheetVisible(true);
        handleVoiceInput(text)
    }


    return(
        <View style = {styles.container}>
            <LinearGradient 
                colors={[Colors.gradient.auroraStart,Colors.background.dark,Colors.gradient.auroraEnd]}
                start={{ x:0, y:0 }}
                end={{ x:1, y:0.7 }} 
                style={StyleSheet.absoluteFill}
            />

            {/* Onboarding form */}
            {!onboardingComplete && (
                <OnBoardingOverlay onComplete={setOnboardingComplete} />
            )}

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
                    <EmotionPillRow
                        selected={selectedEmotion}
                        onSelect={(emotion) => {
                            addEmotionCheckin(emotion);
                            setSelectedEmotion(emotion);
                            setEmotionConfirmed(true);
                            setTimeout(()=> setEmotionConfirmed(false),2000);
                        }}
                    />

                    {emotionConfirmed && (
                        <Text style={styles.emotionConfirm}>✓ Logged</Text>
                    )}
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
                                onTag= {(energyState,emotionAtCompletion) =>{handleTag(activity.id,energyState,emotionAtCompletion)}}
                            />
                        ))
                    }
                    {/*Section header for completed */}
                    {
                        recentItems.length >0 &&(
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Recent</Text>
                            </View>
                        )
                    }
                </>
            }
            data = {recentItems}
            keyExtractor={row=> `${row.kind}-${row.item.id}`}
            renderItem={({ item:row }) => {
                if (row.kind === 'emotion'){
                    return <EmotionCheckinCard checkin={row.item} onDelete={()=>deleteEmotionCheckin(row.item.id)} />;
                }
                if(row.item.type === 'thought') {
                    return <ThoughtCard thought={row.item} onAgain={resurfaceThought} />
                }
                return <CompletedActivityCard activity={row.item} />;

            }
            }
            ListEmptyComponent={
                !activeTask && unTaggedActivities.length == 0 && recentItems.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>
                            Tap the microphone to start tracking your first Thought or Task
                        </Text>
                    </View>
                ): null
            }
        />

            {
                anchorToast && (
                    <Text style={styles.anchorToast}>
                        {EMOTION_EMOJI[anchorToast] } Captured when feeling {anchorToast}

                    </Text>
                )
            }

        {/* Mode toggle- only visible when no active task */}
            <View style={styles.modeToggle}>
                <TouchableOpacity
                    style= {[styles.modeButton, captureMode === 'task' && styles.modeButtonActive,
                        !!activeTask && styles.modeButtonDisabled
                    ]}
                    onPress ={() => !activeTask && setCaptureMode('task')}
                    disabled={!!activeTask}
                >
                    <Text style={captureMode === 'task' ? 
                        styles.modeButtonTextActive : styles.modeButtonText}>
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

        {/*  Voice Button (Fixed at the Bottom) */}
        <View style= {styles.voiceButtonContainer}>
            <VoiceButton onRecordingComplete={handleVoiceInput}captureMode= {captureMode}/>
            <TouchableOpacity
                style={styles.keyboardButton}
                onPress={()=> setTextCaptureVisible(true)}
            >
                <Ionicons name="create-outline" size={24} color = {Colors.text.dark.secondary} />
        </TouchableOpacity>
        </View>
            <ThoughtTaggingSheet 
                visible= {taggingSheetVisible}
                transcription={pendingThought}
                onConfirm={handleThoughtTagged}
                onCancel={handleThoughtCancelled}
            />
            <TextCaptureSheet 
                visible={textCaptureVisible}
                mode={captureMode}
                onSubmit={handleTextCapture}
                onCancel={() => setTextCaptureVisible(false)}
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
        paddingBottom: Layout.tabBarHeight,
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
        paddingVertical: Spacing.xl,
        paddingHorizontal:Spacing.md,
        paddingBottom:Layout.tabBarHeight,
        borderTopWidth:1,
        borderTopColor: 'rgba(255,255,255,0.06)',
        position:'relative'
    },
    keyboardButton: {
        position: 'absolute',
        right: Spacing.md,
        top: Spacing.xl,           // aligns with top of voice button circle
        padding: Spacing.sm,
        borderRadius: BorderRadius.md,
        backgroundColor: 'rgba(255,255,255,0.06)',
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
    modeButtonDisabled: {
        opacity: 0.35,                      // visually communicates "unavailable" without removing it
    },
    emotionLabel: {
        fontSize: Typography.size.lg,
        fontWeight: Typography.weight.medium,
        color: Colors.text.dark.secondary,
        marginBottom: Spacing.xs,
        paddingHorizontal:Spacing.md,
        marginTop:Spacing.sm
    },
    emotionConfirm: {
        textAlign: 'center',
        fontSize: Typography.size.sm,
        color: Colors.text.dark.secondary,
        marginTop: Spacing.xs,
        marginBottom: Spacing.xs,
    },
    anchorToast: {
        textAlign: 'center',
        fontSize: Typography.size.sm,
        color: Colors.text.dark.secondary,
        marginTop: Spacing.xs,
        marginBottom: Spacing.xs,
    },
    captureRow:{
        flexDirection:'row',
        alignItems:'center',
        gap:Spacing.sm,

    }
    
});