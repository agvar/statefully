import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { Activity } from '@/types';
import { StyleSheet, Text, View } from 'react-native';

interface ThoughtBubbleProps {
    thought: Activity;
}

export default function ThoughtBubble({thought }: ThoughtBubbleProps){
    const formatTimestamp = (date: Date): string => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`

        //format time

        const hours = date.getHours();
        const mins = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12 ;
        const displayMinutes = mins.toString().padStart(2,'0')

        return `${displayHours} : ${displayMinutes} ${ampm}`;
    };

    const getSentimentColor = ( sentiment : Thought['sentiment']): string => {
        switch (sentiment){
            case 'positive':
                return Colors.flow;
            case 'negative':
                return Colors.drain;
            default:
                return Colors.text.dark.tertiary;
        }
    };
    return(
        <View style={styles.container}>
            <View style={styles.bubble}>
                <Text style={styles.text}>{thought.text}</Text>

                <View style ={styles.footer}>
                    <View style={styles.timestampContainer}>
                        <View
                            style ={[
                                styles.sentimentDot,
                                { backgroundColor: getSentimentColor(thought.sentiment)}
                            ]}
                        />
                        <Text style={styles.timestamp}>
                            {formatTimestamp(thought.timestamp)}
                        </Text>
                    </View>

                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        alignItems: 'flex-start'
    },
    bubble:{
        backgroundColor: '#2C2C2E', // Dark gray bubble
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        maxWidth: '85%',
    },
    text:{
        fontSize: Typography.size.base,
        color: Colors.text.dark.primary,
        lineHeight: Typography.size.base * Typography.lineHeight.normal,
    },
    footer:{
        marginTop: Spacing.sm,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timestampContainer:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    sentimentDot:{
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: Spacing.xs
    },
    timestamp: {
        fontSize: Typography.size.xs,
        color: Colors.text.dark.secondary
    }
});
