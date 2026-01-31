import { Colors, Spacing, Typography } from '@/constants/theme';
import { Activity } from '@/types/index';
import { StyleSheet, Text, View } from 'react-native';

interface DateSectionHeaderProps{
    date:Date,
    activities :Activity[];
}
export default function DateSectionHeader({date,activities}:DateSectionHeaderProps) {
    const formatDate= (date:Date): string =>{
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() -1 );

        const normalizeDate = (d:Date) => {
            const normalized = new Date(d);
            normalized.setHours(0,0,0,0);
            return normalized.getTime();

        };

        const today_normalized = normalizeDate(today);
        const yest_normalized = normalizeDate(yesterday);
        const date_normalized = normalizeDate(date);
        const date_monthFormat = date.getMonth();
        const date_dayFormat = date.getDate();

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        if(date_normalized === today_normalized) {
            return 'Today';
        }
        if(date_normalized === yest_normalized){
            return 'Yesterday';
        }
        return `${months[date_monthFormat]} ${date_dayFormat}`;
    };

    const calculateStats = () => {
        let totalSeconds = 0 ;
        let flowSeconds = 0;
        let drainSeconds = 0 ;

        activities.forEach((activity:Activity) =>{
            if(activity.energyState === 'flow'){
                flowSeconds += activity.duration;
            }
            if(activity.energyState === 'drain'){
                drainSeconds += activity.duration;
            }
            totalSeconds += activity.duration;
        });

    const formatHours=(seconds: number)=>{
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600)/ 60);
        if (hours>0){
            return `${hours}h:${minutes}m`;
        }
        return `${minutes}m`;
    };

    return {
        total : formatHours(totalSeconds),
        flow: formatHours(flowSeconds),
        drain: formatHours(drainSeconds)
    };
    
    };
    const stats = calculateStats();
    return (
        <View style={styles.container}>
            {/* Date */}
            <Text style={styles.dateText}>{formatDate(date)}</Text>

            {/* Total */}
            <Text style={styles.totalText}>
                Total:{stats.total}
            </Text>

            {/* Flow vs Drain */}
            <View style={styles.statsRow}>
                <Text style={styles.flowText}>
                    {stats.flow} Flow ✨
                </Text>
                <Text style={styles.separator}> / </Text> 
                <Text style={styles.drainText}>
                    {stats.drain} Drain 😰
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.sm,
        backgroundColor: Colors.background.light,
    },
    dateText: {
        fontSize: Typography.size.xl,
        fontWeight: Typography.weight.bold,
        color: Colors.text.light.primary,
        marginBottom: Spacing.xs,
    },
    totalText: {
        fontSize: Typography.size.base,
        color: Colors.text.light.secondary,
        marginBottom: Spacing.xs,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flowText: {
        fontSize: Typography.size.sm,
        color: Colors.flow,
        fontWeight: Typography.weight.medium,
    },
    drainText: {
        fontSize: Typography.size.sm,
        color: Colors.drain,
        fontWeight: Typography.weight.medium,
    },
    separator: {
        fontSize: Typography.size.sm,
        color: Colors.text.light.tertiary,
    },
});