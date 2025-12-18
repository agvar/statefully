import { Colors, Spacing, Typography } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

export default function PulseScreen(){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Pulse</Text>
            <Text style={styles.subtitle}>Track your progress</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container :{
        flex : 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.background.light
    },
    title :{
        fontSize: Typography.size['4xl'],
        fontWeight: Typography.weight.bold,
        color: Colors.text.light.primary,
        marginBottom: Spacing.sm,
    },
    subtitle:{
        fontSize: Typography.size.base,
        color: Colors.text.light.primary
    },
})