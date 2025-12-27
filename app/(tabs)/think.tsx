import ThoughtBubble from '@/components/ThoughtBubble';
import VoiceButton from '@/components/VoiceButton';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { Thought } from '@/types';
import { StyleSheet, Text, View } from 'react-native';

export default function ThinkScreen(){
    //create test data for testing
    const testThought1:Thought ={
        id: '1',
        text: 'Had a great idea for project,feels like a breakthrough.',
        timestamp : new Date(),
        sentiment: 'positive'
    };
    const testThought2:Thought ={
        id: '1',
        text: 'This has been bummer of a day- I got nothing done.',
        timestamp : new Date(),
        sentiment: 'positive'
    };

    return(
        <View style = {styles.container}>
            <Text style = {styles.title}>Think Stream</Text>
            <View style = {styles.content}>
                <ThoughtBubble thought={testThought1}/>
                <ThoughtBubble thought={testThought2}/>
                <VoiceButton 
                onRecordingComplete={(text) =>{
                    console.log('Recorded',text)
                }}/>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : Colors.background.dark,
        paddingTop: Spacing['2xl']
    },
    title :{
        fontSize: Typography.size['4xl'],
        fontWeight: Typography.weight.bold,
        color:Colors.text.dark.primary,
        marginBottom : Spacing.sm,
        paddingHorizontal: Spacing.md
    },
    content :{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: Typography.size.base,
        color:Colors.text.dark.secondary
    },
})