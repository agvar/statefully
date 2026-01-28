import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { Activity, EnergyState } from '@/types/index';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface UntaggedActivityCardProps{
    activity: Activity ;
    onTag: (EnergyState:EnergyState) => void;
};

export default function UntaggedActivityCard({activity, onTag}:UntaggedActivityCardProps) {
    //format seconds to readable string
    const formatDuration = (seconds:number): string =>{
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600)/ 60);

        if (hours > 0){
            return `${hours}h ${minutes}m`;
        }
        if(minutes > 0){
            return `${minutes}m`
        }
        return `${seconds}s`
    };

    return(
        <View style={styles.container}>
            {/* Activity Info */}
            <View style={styles.infoSection}>
                <Text style={styles.activityName} numberOfLines={2}>
                    {activity.name}
                </Text>
                <Text style={styles.duration}>
                        ⏱{formatDuration(activity.duration)}
                </Text>
            </View>

            {/* Sentiment Picker*/}
            <View style={styles.pickerSection}>
                <Text style={styles.prompt}>How did that feel?</Text>
                <View style={styles.buttonRow}>

                    {/*Flow button */}
                    <TouchableOpacity
                        style={[styles.button, styles.flowButton]}
                        onPress={() => onTag('flow')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonEmoji}>✨</Text>
                        <Text style={styles.buttonText}>Flow</Text>
                    </TouchableOpacity>

                    {/*Drain button */}
                    <TouchableOpacity
                        style={[styles.button, styles.drainButton]}
                        onPress={() => onTag('drain')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonEmoji}>😰</Text>
                        <Text style={styles.buttonText}>Drain</Text>
                    </TouchableOpacity>

                </View>

            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background.cardDark,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginHorizontal: Spacing.md,
        marginTop: Spacing.md,
        
        // Subtle border to differentiate from completed cards
        borderWidth: 1,
        borderColor: Colors.border.dark,
        
        ...Shadows.md,
    },
    infoSection: {
        marginBottom: Spacing.lg,
    },
    activityName: {
        fontSize: Typography.size.lg,
        fontWeight: Typography.weight.semibold,
        color: Colors.text.dark.primary,
        marginBottom: Spacing.xs,
    },
    duration: {
        fontSize: Typography.size.base,
        color: Colors.text.dark.secondary,
    },
    pickerSection: {
        alignItems: 'center',
    },
    prompt: {
        fontSize: Typography.size.base,
        color: Colors.text.dark.secondary,
        marginBottom: Spacing.md,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: Spacing.md, // Space between buttons
        width: '100%',
    },
    button: {
        flex: 1, // Equal width for both buttons
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        
        // Subtle shadow for depth
        ...Shadows.sm,
    },
    flowButton: {
        backgroundColor: Colors.flow,
    },
    drainButton: {
        backgroundColor: Colors.drain,
    },
    buttonEmoji: {
        fontSize: 32,
        marginBottom: Spacing.xs,
    },
    buttonText: {
        fontSize: Typography.size.base,
        fontWeight: Typography.weight.semibold,
        color: Colors.text.dark.primary,
    },
})