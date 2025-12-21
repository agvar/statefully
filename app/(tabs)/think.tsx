import VoiceButton from '@/components/VoiceButton';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

export default function ThinkScreen(){
    return(
        <View style = {styles.container}>
            <Text style = {styles.title}>Think Stream</Text>
            <View style = {styles.content}>
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