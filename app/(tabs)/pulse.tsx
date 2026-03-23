import MetricCircle from '@/components/MetricCircle';
import TimelineChart from '@/components/TimeLineChart';
import { Colors, Layout, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store/useStore';
import { Activity } from '@/types';
import { ScrollView, StyleSheet, Text, View,Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';
import { buildReflectionPrompt , ReflectionContext,SYSTEM_PROMPT} from '@/utils/buildReflectionPrompt';
import { useLLM,LLAMA3_2_1B_SPINQUANT ,Message} from 'react-native-executorch';
import { useEffect, useState } from 'react';

export default function PulseScreen(){
    const [shouldLoad, setShouldLoad] = useState(false);
    const activities = useStore( state => state.activities);
    const { flowHours, drainHours } = useStore(useShallow(state => state.getTodayStats()));
    const {isReady,downloadProgress,error,isGenerating,configure,
        generate,response} = useLLM({model: LLAMA3_2_1B_SPINQUANT,
        preventLoad: !shouldLoad
    });
    const [pendingPrompt,setPendingPrompt] = useState<string|null>(null);

    useEffect(()=>{
        if(isReady && pendingPrompt){
            const messages:Message[] =[
                { role: 'system', content: SYSTEM_PROMPT },
                {role:'user',content:pendingPrompt}
            ]
            generate(messages);
            setPendingPrompt(null);
        };
    },[isReady,pendingPrompt,generate])

    const createLLMPromptValues = ():string =>{
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
    };

    const handleReflect = () =>{
        const prompt = createLLMPromptValues();
        setPendingPrompt(prompt);
        setShouldLoad(true);
    };
    

    const todayActivities = activities.filter( activity =>
        {   const today = new Date();
            const activityDate = new Date(activity.startTime);
            return(
                activityDate.getFullYear() === today.getFullYear() &&
                activityDate.getMonth() === today.getMonth() &&
                activityDate.getDate() === today.getDate()
            );
            }
    )

    const sentiment = calculateSentiment(todayActivities);
    const totalHours = flowHours + drainHours;
    const flowScore = totalHours > 0 ? (flowHours / totalHours) *100 :0 ;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Pulse ⚡</Text>
                <Text style={styles.subtitle}>
                    Today:{flowHours.toFixed(1)}h Flow/ {drainHours.toFixed(1)}h Drain
                </Text>
            </View>
            {/* Metrics Section */}
            <ScrollView contentContainerStyle ={styles.content}>
                {/*Timeline Chart */}
                <TimelineChart  activities={todayActivities}/>

                {/*Metrics Section */}
                <View style={styles.metricsContainer}>
                    <Text style={styles.sectionTitle}>Today's Metrics</Text>
                    <View style={styles.metricsRow}>
                        <MetricCircle 
                            percentage={sentiment.percentage}    
                            label ="Avg, Sentiment"
                            value={sentiment.label}
                            color={Colors.flow}
                        />

                        <MetricCircle 
                            percentage={flowScore}    
                            label ="Flow Score"
                            value={`${Math.round(flowScore)}%`}
                            color={Colors.drain}
                        />

                    </View>
                {/*Download progress bar */}
                </View>
                {!isReady && downloadProgress > 0 && (
                    <View style = {styles.progressContainer}>
                        <View style={[styles.progressFill, { width : downloadProgress * 120 }]} />
                    </View>
                )
                }
                {/*Reflect Button */}
                <View style={styles.reflectButtonWrapper}>
                    <Pressable 
                    onPress={handleReflect}
                    disabled = {isGenerating }
                    style ={[styles.reflectButton, isGenerating && styles.reflectButtonDisabled]}
                    >
                        <Text style={styles.reflectButtonLabel}>
                            {isGenerating? 'Reflecting ...': 'Reflect'}</Text>
                    </Pressable>
                </View>

                <Text style={styles.reflectStatusLabel}>
                    {!shouldLoad
                        ? 'Tap to load & reflect'
                        : !isReady
                        ? `Loading model ${Math.round(downloadProgress * 100)}%`
                        : isGenerating
                        ? 'Thinking...'
                        : response
                        ? 'Tap to reflect again'
                        : 'Model ready'}
                </Text>
                {/* streaming response */}
                {(isGenerating ||(!isGenerating && response)) && (
                    <View style = {styles.responseContainer}>
                        <Text style={styles.responseText}>{response}</Text>
                    </View>
                )
                }


            </ScrollView>
        </SafeAreaView>
    )
}
//Helper function

function calculateSentiment(activities: Activity[]):{
    label: string;
    percentage: number;
} {
    const completedActivities = activities.filter(activity => activity.energyState);

    if(completedActivities.length === 0){
        return{ label: 'No Data', percentage:0}
    }

    const totalSeconds = completedActivities.reduce((sum,activity) => sum + activity.duration,0)
    const flowSeconds = completedActivities.filter(activity=> activity.energyState == 'flow')
        .reduce((sum,activity) => sum + activity.duration,0);

    const flowPercentage = (flowSeconds/totalSeconds) * 100;
    let label:string;
    if (flowPercentage >= 70) {
        label= 'Excellent';
    }
    else if (flowPercentage >= 50) {
        label= 'Positive';
    }
    else if (flowPercentage >= 30) {
        label= 'Neutral';
    }
    else {
        label= 'Challenging';
    };

    return {label, percentage: flowPercentage}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  header: {
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.size['4xl'],
    fontWeight: Typography.weight.bold,
    color: Colors.text.dark.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.size.base,
    color: Colors.text.dark.secondary,
  },
  content: {
    paddingBottom: Layout.tabBarHeight
  },
  metricsContainer: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.dark.primary,
    marginBottom: Spacing.md,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.background.cardDark,
    borderRadius: 12,
    padding: Spacing.lg,
  },
  progressContainer:{
    width:120,
    height: 4,
    alignSelf: 'center',
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
 reflectButtonWrapper: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
},
reflectButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.flow,
    backgroundColor: Colors.flow + '30',   // 19% opacity fill
    shadowColor: Colors.flow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
},
  reflectButtonDisabled:{
    opacity: 0.4,
  },
  reflectButtonLabel: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.dark.primary,
},
responseContainer: {
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.background.cardDark,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.flow,
    overflow: 'hidden',
},
responseText: {
    fontSize: Typography.size.base,
    color: Colors.text.dark.primary,
    lineHeight: 22,
},
reflectStatusLabel: {
    marginTop: Spacing.sm,
    fontSize: Typography.size.sm,
    color: Colors.text.dark.secondary,
    alignSelf: 'center',
},

});