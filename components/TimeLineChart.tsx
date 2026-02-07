import { Colors, Spacing, Typography } from '@/constants/theme';
import { Activity } from '@/types/index';
import { StyleSheet, View } from 'react-native';
import Svg, { Text } from 'react-native-svg';

interface TimelineChartProps {
    activities : Activity[]
}

 export default function TimelineChart({activities}:TimelineChartProps)  {
    const chartWidth= 350;
    const chartHeight = 80;

    const todayActivities = activities
    .filter( activity=> isToday(activity.startTime))
    .sort((a,b) => b.startTime.getTime() - a.startTime.getTime());

    const timeToX= (date: Date) =>{
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const decimalHours = hours + (minutes/60)
        return ((chartWidth/24) * decimalHours)
    };

    const chartDurationToWidth = (seconds:number) =>{
        const hours = seconds/3600;
        return ((chartWidth/24) * hours) 
    };

    if (todayActivities.length === 0){
        return(
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}> No activities today</Text>

            <Svg width={chartWidth} height={chartHeight}>
              {/*  Time axis markers (0,6,12,18,24)*/}

            </Svg>
        </View>
        );
    }
    
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Day Timeline</Text>

            <Svg />

        </View>
    )
    

    const isToday=(date: Date):boolean =>{
        const today = new Date();
        return  (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
  },
  title: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.light.primary,
    marginBottom: Spacing.sm,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    gap: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: Typography.size.sm,
    color: Colors.text.light.secondary,
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.xl,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.size.base,
    color: Colors.text.light.secondary,
  },
});