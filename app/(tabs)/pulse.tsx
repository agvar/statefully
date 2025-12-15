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
    container: {
        flex: 1,
        justifyContent : 'center',
        alignItems: 'center',
        backgroundColor : '#ffffff'
    },
    title: {
        fontSize :32,
        fontWeight : 'bold',
        color: '#000000',
        marginBottom: 8
    },
    subtitle: {
        fontSize: 16,
        color: '#666666'
    }
})