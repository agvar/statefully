import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { Activity } from '@/types/index';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ActivityLogCardProps{
    activity: Activity;
    onEdit: () => void;
    onDelete: () =>void;
}

export default function ActivityLogCard({activity, onEdit, onDelete}:ActivityLogCardProps){

    const formatTimeRange = (start: Date, end?:Date): string => {
        //format Time
        const formatTime = (date: Date) =>{
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours > 12 ? 'PM': 'AM';
            const displayHours = hours % 12 || 12;
            const displayMinutes = minutes.toString().padStart(2, '0');
            return `${displayHours}:${displayMinutes} ${ampm}`;
        };
        if(!end){
             return `Started ${formatTime(start)}`;
        }
         return `Started ${formatTime(start)} - ${formatTime(end)}`;
        };
        //format duration
        const formatDuration =(seconds :number )=>{
            const hours= Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) /60);
            if (hours > 0){
                return `${hours}h:${minutes}m`;
            }
            return `${minutes}m`;
        };

        //Energy badge
        const getEnergyDisplay = () =>{
            if(!activity.energyState){
                return {emoji :'⏳', text: ' Untagged', color:Colors.text.light.tertiary};
            }
            if(activity.energyState === 'flow'){
                return {emoji :'✨', text: ' Flow', color:Colors.flow};
            }
            else {
                return {emoji :'😰', text: ' Drain', color:Colors.drain};
            }
        };

        const energy = getEnergyDisplay();

        return (
            <View style={styles.container}>
                {/*Activity Name */}
                <Text style ={styles.activityName} numberOfLines={2}>
                    {activity.name}
                </Text>

                {/* Time Range and Duration */}
                <Text style={styles.timeInfo}>
                    {formatTimeRange(activity.startTime, activity.endTime)}
                    {activity.endTime && ` (${formatDuration(activity.duration)})`}
                </Text>

                {/* Bottom Row: Badge and Actions */}
                <View style ={styles.bottomRow}>
                    {/* Energy Badge */}
                    <View style={[styles.badge,{backgroundColor: energy.color + '20' }]}>
                        <Text style={styles.badgeEmoji}>{energy.emoji}</Text>
                        <Text style={[styles.badgeText, { color: energy.color}]}>
                            {energy.text}
                        </Text>
                    </View>
                    {/* Action Buttons */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={onEdit}
                            activeOpacity={0.7}
                         >
                            <Text style={styles.actionText}>Edit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton,styles.deleteButton]}
                            onPress={onDelete}
                            activeOpacity={0.7}
                         >
                            <Text style={[styles.actionText,styles.deleteText]}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background.card,  // White for light theme
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginHorizontal: Spacing.md,
        marginTop: Spacing.sm,
        ...Shadows.md,
    },
    activityName: {
        fontSize: Typography.size.lg,
        fontWeight: Typography.weight.semibold,
        color: Colors.text.light.primary,  // Black text on white
        marginBottom: Spacing.xs,
    },
    timeInfo: {
        fontSize: Typography.size.sm,
        color: Colors.text.light.secondary,
        marginBottom: Spacing.md,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    actions: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    actionButton: {
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.sm,
        backgroundColor: Colors.background.lightGray,
    },
    deleteButton: {
        backgroundColor: Colors.error + '10',  // Light red tint
    },
    actionText: {
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.medium,
        color: Colors.text.light.primary,
    },
    deleteText: {
        color: Colors.error,
    },
});