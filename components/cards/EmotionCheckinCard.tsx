import { EMOTION_EMOJI,EmotionCheckin } from "@/types";
import {Colors, Spacing,BorderRadius, Shadows, Typography} from '@/constants/theme';
import { StyleSheet, View,Text,TouchableOpacity,Alert } from "react-native";
import { formatTime } from "@/utils/formatTime";

interface EmotionCheckinCardProps{
    checkin: EmotionCheckin;
    onDelete?: () => void;
}

export default function EmotionCheckinCard({checkin,onDelete}: EmotionCheckinCardProps) {
    const color = Colors.emotion[checkin.state];
    return (
        <TouchableOpacity 
            onLongPress= { ()=>
                Alert.alert(
                    'Delete Activity',
                    `Are you sure you want to delete ${checkin.state} ?`,
                    [
                        { text: 'Cancel', style :'cancel'},
                        {
                            text:'Delete',
                            style:'destructive',
                            onPress: () => onDelete?.()
                        },
                    ]
                )
            }

            >
            <View style={[styles.container, { borderLeftColor: color, backgroundColor: color + '0F' }]}>
                <View style={styles.row}>
                    <Text style={styles.stateLabel}>
                        {EMOTION_EMOJI[checkin.state]}  {checkin.state}
                    </Text>
                    <Text style={styles.timeLabel}>{formatTime(checkin.timestamp)}</Text>
                </View>
                {checkin.note && (
                    <Text style={styles.note} numberOfLines={2}>"{checkin.note}"</Text>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: BorderRadius.md,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        marginHorizontal: Spacing.md,
        marginTop: Spacing.sm,
        ...Shadows.sm,
        borderLeftWidth: 3,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    stateLabel: {
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.medium,
        color: Colors.text.dark.primary,
        textTransform: 'capitalize',
    },
    timeLabel: {
        fontSize: Typography.size.xs,
        color: Colors.text.dark.tertiary,
    },
    note: {
        marginTop: Spacing.xs,
        fontSize: Typography.size.xs,
        color: Colors.text.dark.secondary,
        fontStyle: 'italic',
    },
});