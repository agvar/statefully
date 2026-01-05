import { Colors, Spacing, Typography } from '@/constants/theme';
import { useStore } from '@/store/useStore';
import { StyleSheet, Text, View } from 'react-native';

export default function DoScreen(){
    const thoughts = useStore(state => state.thoughts);
    return(
        <View style = {styles.container}>
            <Text style = {styles.title}>Do Board</Text>
            <Text style={styles.subtitle}>Execute your tasks</Text>
            {/* Temporray: Show thought content */}
            <Text style={styles.debugText}>
                Thoughts in store: {thoughts.length}
            </Text>
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
    debugText: {
        marginTop: Spacing.lg,
        fontSize: Typography.size.sm,
        color: Colors.text.light.tertitary
    }
})