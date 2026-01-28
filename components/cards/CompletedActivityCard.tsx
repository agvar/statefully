import { BorderRadius, Colors, Spacing, Typography } from "@/constants/theme";
import { Activity } from "@/types/index";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


interface CompletedActivityCardProps {
    activity: Activity;
    onPress?:()=>void; //Optional for future detail view
}

export default function  CompletedActivityCard({activity,onPress}:CompletedActivityCardProps) {
    
    const formatDuration = (seconds:number): string =>{
        const hours = Math.floor(seconds/ 3600);
        const minutes = Math.floor((seconds % 3600)/60);
        if (hours>0){
            return `${hours}h ${minutes}m`;
        }
        if (minutes>0){
            return `${minutes}m`;
        };
        return `${seconds}s`;
    };

    //Get energy state display

    const getEnergyDisplay = () =>{
        if (activity.energyState === 'flow'){
            return { emoji:'✨', text: 'Flow', color:Colors.flow }
        }
        return { emoji:'😰', text: 'Drain', color:Colors.drain }
    };

    const energy = getEnergyDisplay();

    const CardContent = (
        <View style={styles.container}>
            {/* Top Row: Name and Duration*/}
            <View style={styles.topRow}>
                <Text style={styles.activityName} numberOfLines={1}>
                    {activity.name}
                </Text>
                <Text style={styles.duration}>
                    ⏱ {formatDuration(activity.duration)}
                </Text>
            </View>
            
            {/* Bottom Row: Energy state and Badge */}
            <View style={styles.bottomRow}>
                <View style={[styles.badge,{ backgroundColor: energy.color + '20'}]}>
                    <Text style={styles.badgeEmoji}>{energy.emoji}</Text>
                    <Text style={[styles.badgeText, {color: energy.color}]}>
                        {energy.text}
                    </Text>
                </View>
            </View>
        </View>
    )

    //If onPress providedmmake it tappable
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
        padding: Spacing.md,
        marginHorizontal: Spacing.md,
        marginTop: Spacing.sm,
        
        borderWidth: 1,
        borderColor: Colors.border.dark,
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
});