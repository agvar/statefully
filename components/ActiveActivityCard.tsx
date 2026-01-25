import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { Activity } from '@/types/index';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ActiveActivityCardProps {
    activity : Activity;
    onStop :() => void;
}

export default function ActiveActivityCard({ activity, onStop}: ActiveActivityCardProps) {
    const [elapsed, setElapsed ] = useState(0);

    useEffect(()=>{
            const interval = setInterval(()=>{
                const now =  Date.now();
                const start = activity.startTime.getTime();
                setElapsed(Math.floor((now-start)/1000));
            },1000)

            return () => clearInterval(interval);
    },[activity.startTime]);

    const formatTimer = (seconds:number) => {
        const hours = Math.floor( seconds/3600);
        const minutes = Math.floor((seconds % 3600)/60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`
    };

    return(
        <View style= {styles.container}>
            {/* Activity Name with Stop Button */}
            <View style={styles.header}>
                <Text style={styles.activityName} numberOfLines={2}>
                    {activity.name}
                </Text>
                <TouchableOpacity
                    style = {styles.stopButton}
                    onPress={onStop}
                    activeOpacity={0.7}
                >
                    <Ionicons name="stop-circle-outline" size={24} color={Colors.text.dark.primary}/>
                </TouchableOpacity>
            </View>

            {/* Larger time display */}
            <View style={styles.timerContainer}>
                <Text style={styles.timer}>
                    {formatTimer(elapsed)}
                </Text>
            </View>

            {/*Indicator showing running */}
            <View style={styles.footer}>
                <View style={styles.pulsingDot} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: Colors.background.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginHorizontal: Spacing.md,
        marginTop: Spacing.md,
        minHeight: 200,
        
        // Blue glowing border effect
        borderWidth: 2,
        borderColor: Colors.flow,
        shadowColor: Colors.flow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10, // Android shadow
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.md,
    },
    activityName: {
        flex: 1,
        fontSize: Typography.size.xl,
        fontWeight: Typography.weight.semibold,
        color: Colors.text.dark.primary,
        marginRight: Spacing.sm,
    },
    stopButton: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: BorderRadius.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timer: {
        fontSize: 48, // Large, prominent timer
        fontWeight: Typography.weight.medium,
        color: Colors.flow, // Blue to match border
        letterSpacing: 2,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pulsingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.flow,
        marginRight: Spacing.xs,
        // TODO: Add pulsing animation later
    },
    runningText: {
        fontSize: Typography.size.sm,
        color: Colors.text.dark.secondary,
    }
})

