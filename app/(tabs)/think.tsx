import { Colors, Spacing, Typography } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

export default function ThinkScreen(){
    return(
        <View style = {styles.container}>
            <Text style = {styles.title}>Think Stream</Text>
            <Text style = {styles.subtitle}>Capture your thoughts</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : Colors.background.dark
    },
    title :{
        fontSize: Typography.size['4xl'],
        fontWeight: Typography.weight.bold,
        color:Colors.text.dark.primary,
        marginBottom : Spacing.sm
    },
    subtitle :{
        fontSize: Typography.size.base,
        color:Colors.text.dark.secondary
    },
})