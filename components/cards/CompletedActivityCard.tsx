import { BorderRadius, Colors, Spacing, Typography, Shadows } from "@/constants/theme";
import { Activity } from "@/types/index";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { formatTime } from "@/utils/formatTime";
import {formatDuration} from 'utils/formatTime';

interface CompletedActivityCardProps {
    activity: Activity;
    onPress?:()=>void; //Optional for future detail view
}

export default function  CompletedActivityCard({activity,onPress}:CompletedActivityCardProps) {
    //Get energy state display

    const getEnergyDisplay = () =>{
        if (activity.energyState === 'flow'){
            return { emoji:'✨', text: 'Flow', color:Colors.flow }
        }
        return { emoji:'😰', text: 'Drain', color:Colors.drain }
    };

    const energy = getEnergyDisplay();

    const CardContent = (
        <View style={[styles.container,{backgroundColor:energy.color + '0F', borderLeftColor: energy.color}]}>
            {/* Top Row: Name and Duration*/}
            <View style={styles.topRow}>
                <Text style={styles.activityName} numberOfLines={1}>
                    {activity.name}
                </Text>
                <View style={styles.topRight}>
                    <Text style={styles.timeLabel}>{formatTime(activity.startTime)}</Text>
                    <Text style={styles.duration}>⏱ {formatDuration(activity.duration)}</Text>
                </View>
            </View>
            
            {/* Bottom Row: Energy state and Badge */}
            <View style={styles.bottomRow}>
                <View style={[styles.badge,{ backgroundColor: energy.color + '0F'}]}>
                    <Text style={styles.badgeEmoji}>{energy.emoji}</Text>
                    <Text style={[styles.badgeText, {color: energy.color}]}>
                        {energy.text}
                    </Text>
                </View>
            </View>
            {
                activity.emotionAtCapture && (
                    <Text style={styles.emotionCapture}>feeling {activity.emotionAtCapture}
                        {activity.emotionAtCompletion ? ' → ' + activity.emotionAtCompletion :''}</Text>
                )
            }
        </View>
    )

    //If onPress provided make it tappable
    if(onPress){
        return (
            <TouchableOpacity onPress = {onPress} activeOpacity={0.7}>
                {CardContent}
            </TouchableOpacity>
        )
    }
    return CardContent;
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background.cardDark,
        borderRadius: BorderRadius.md,
        ...Shadows.sm,
        padding: Spacing.md,
        marginHorizontal: Spacing.md,
        marginTop: Spacing.sm,
        borderLeftWidth: 3,
        overflow: 'hidden',       // clips left border inside border radius
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    activityName: {
        flex: 1,
        fontSize: Typography.size.base,
        fontWeight: Typography.weight.medium,
        color: Colors.text.dark.primary,
        marginRight: Spacing.sm,
    },
    duration: {
        fontSize: Typography.size.sm,
        color: Colors.text.dark.secondary,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.sm,
        borderRadius: BorderRadius.sm,
    },
    badgeEmoji: {
        fontSize: Typography.size.sm,
        marginRight: 4,
    },
    badgeText: {
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.medium,
    },
    topRight: {
        alignItems: 'flex-end',
        gap: 2,
    },
    timeLabel: {
        fontSize: Typography.size.xs,        // smaller than body — supporting info
        color: Colors.text.dark.tertiary,    // dimmest text tier — it's timestamp, not primary
    },
    emotionCapture: {
        fontSize: Typography.size.xs,
        color: Colors.text.dark.tertiary,
        fontStyle: 'italic',
    },
});