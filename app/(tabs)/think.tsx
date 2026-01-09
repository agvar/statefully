import ThoughtBubble from '@/components/ThoughtBubble';
import VoiceButton from '@/components/VoiceButton';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useStore } from '@/store/useStore';
import { Thought } from '@/types';
import { useEffect } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';

export default function ThinkScreen(){
    //create test data for testing
    const thoughts = useStore(state => state.thoughts);
    const addThought = useStore(state => state.addThought);

    const clearAllThoughts = useStore(state => state.clearAllThoughts);

    useEffect(() => {
        if (thoughts.length === 0) {
            addThought({
            id: '1',
            text: 'Had a great idea for a project',
            timestamp : new Date(Date.now()),
            sentiment:'positive'
        }),
            addThought({
            id: '2',
            text: 'Been a bummer of a day- got nothing done',
            timestamp : new Date(Date.now()- 15*60000),
            sentiment:'negative'
        }),
            addThought({
            id: '3',
            text: 'Normal day- nothing special',
            timestamp : new Date(Date.now()- 45*60000),
            sentiment:'neutral'
        })
    }

    }, []);

    const HandleRecordingComplete = (text: string) =>{
        const newThought:Thought = {
            id : Date.now().toString(),
            text: text,
            timestamp: new Date(),
            sentiment: 'neutral'
        };
        addThought(newThought);
    };

    return(
        <View style = {styles.container}>
            <View style = {styles.header}>
                <Text style = {styles.title}>Think Stream</Text>
            </View>

            {/* Thought List */}
        <FlatList
            data = {thoughts}
            renderItem = {({ item }) => <ThoughtBubble thought = {item} />}
            keyExtractor ={item => item.id}
            contentContainerStyle= {styles.listContent}
            showsVerticalScrollIndicator = {false}
            inverted
        />
        {/*  Voice Button (Fixed at the Bottom) */}
        <View style= {styles.VoiceButtonContainer}>
            <VoiceButton onRecordingComplete={HandleRecordingComplete}/>
        </View>
        <Button title='Clear all thoughts' onPress={clearAllThoughts} />
        </View>
    );
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : Colors.background.dark,
    },
    header:{
        paddingTop: Spacing['2xl'] + 20,
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.md,
        backgroundColor: Colors.background.dark
    },
    title :{
        fontSize: Typography.size['4xl'],
        fontWeight: Typography.weight.bold,
        color:Colors.text.dark.primary,
    },
    listContent :{
        paddingBottom: Spacing.md,
        flexGrow: 1
    },
    VoiceButtonContainer:{
        paddingVertical: Spacing.lg,
        paddingHorizontal:Spacing.md,
        backgroundColor:Colors.background.dark,
        borderTopWidth:1,
        borderTopColor: Colors.border.dark
    }
});