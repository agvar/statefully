import ThoughtBubble from '@/components/ThoughtBubble';
import ActiveActivityCard from '@/components/cards/ActiveActivityCard';
import CompletedActivityCard from '@/components/cards/CompletedActivityCard';
import UntaggedActivityCard from '@/components/cards/UntaggedActivityCard';

import VoiceButton from '@/components/VoiceButton';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useStore } from '@/store/useStore';
import { Activity,EnergyState } from '@/types';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';

export default function ThinkScreen(){
    //create test data for testing
    const activeActivity = useStore(state => state.activeActivity);
    const unTaggedActivities = useStore(state => state.getUntaggedActivities());
    const completedActivities = useStore(state => state.getCompletedActivities());
    const clearActivities = useStore(state => state.clearAllActivities)

    const startActivity = useStore(state => state.startActivity)
    const stopActivity = useStore(state => state.stopActivity)
    const tagActivity = useStore(state => state.tagActivity)

    //Handle voice input ->start new activity
    const handleVoiceInput = (transcription: string) => {
        try {
            const activityName = transcription.trim();
            startActivity(activityName, 'voice',transcription )

        } catch(err) {
            alert('Stop current activity before starting a new one');
        }

    };

    //Handle tagging
    const handleTag = (id:string, energyState: EnergyState) {
        tagActivity(id,energyState);
    };


    return(
        <View style = {styles.container}>
            {/* Header */}
            <View style = {styles.header}>
                <Text style = {styles.title}>Think Stream ✨</Text>
            </View>

            {/* Scrollable Content */}
        <FlatList
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                <>
                    {/*Active Activity section*/}
                    {
                        activeActivity &&(
                            <ActiveActivityCard
                                activity={activeActivity}
                                onStop={stopActivity}
                            />
                        )
                    }

                    {/*Untagged Activities section */}
                    {
                        unTaggedActivities.map(activity=>(
                            <UntaggedActivityCard 
                                key={activity.id}
                                activity={activity}
                                onTag= {(energyState) =>{handleTag(activity.id,energyState)}}
                            />
                        ))
                    }
                    {/*Section header for comppleted */}
                    {
                        completedActivities.length >0 &&(
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Recent Activities</Text>
                            </View>
                        )
                    }
                </>
            }
        />
        {/*  Voice Button (Fixed at the Bottom) */}
        <View style= {styles.VoiceButtonContainer}>
            <VoiceButton onRecordingComplete={handleVoiceInput}/>
        </View>
        <Button title='Clear all Activities' onPress={clearActivities} />
        </View>
    );
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : Colors.background.dark,
    },
    header:{
        paddingTop: Spacing['2xl'] + 20, // Safe area + spacing
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.md,
        backgroundColor: Colors.background.dark
    },
    title :{
        fontSize: Typography.size['4xl'],
        fontWeight: Typography.weight.bold,
        color:Colors.text.dark.primary,
    },
    scrollContent: {
        flex: 1,
    },
    scrollContentContainer: {
        paddingBottom: Spacing.xl,
    },
    sectionHeader: {
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.sm,
    },
    sectionTitle: {
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.semibold,
        color: Colors.text.dark.secondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    emptyState: {
        padding: Spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing['3xl'],
    },
    emptyText: {
        fontSize: Typography.size.base,
        color: Colors.text.dark.secondary,
        textAlign: 'center',
        lineHeight: Typography.size.base * 1.5,
    },
    VoiceButtonContainer:{
        paddingVertical: Spacing.lg,
        paddingHorizontal:Spacing.md,
        backgroundColor:Colors.background.dark,
        borderTopWidth:1,
        borderTopColor: Colors.border.dark
    },
    voiceHint: {
        marginTop: Spacing.sm,
        fontSize: Typography.size.sm,
        color: Colors.text.dark.secondary,
    },
    
});