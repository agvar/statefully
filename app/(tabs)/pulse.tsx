import MetricCircle from '@/components/MetricCircle';
import TimelineChart from '@/components/TimeLineChart';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useStore } from '@/store/useStore';
import { Activity } from '@/types';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

export default function PulseScreen(){
    const activities = useStore( state => state.activities);
    const { flowHours, drainHours } = useStore(useShallow(state => state.getTodayStats()));

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
        <SafeAreaView style={styles.content}>
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

                </View>

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
    backgroundColor: Colors.background.light,
  },
  header: {
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.size['4xl'],
    fontWeight: Typography.weight.bold,
    color: Colors.text.light.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.size.base,
    color: Colors.text.light.secondary,
  },
  content: {
    paddingBottom: Spacing.xl,
  },
  metricsContainer: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.light.primary,
    marginBottom: Spacing.md,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.lg,
  },
});