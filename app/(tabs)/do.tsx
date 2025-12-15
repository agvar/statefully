import { StyleSheet, Text, View } from 'react-native';

export default function DoScreen(){
    return(
        <View style = {styles.container}>
            <Text style = {styles.title}>Do Board</Text>
            <Text style={styles.subtitle}>Execute your tasks</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container :{
        flex : 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    },
    title :{
        fontSize:32,
        fontWeight:'bold',
        color:'#000000',
        marginBottom: 8,
    },
    subtitle:{
        fontSize: 16,
        color: '#666666'
    },
})