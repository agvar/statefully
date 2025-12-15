import { StyleSheet, Text, View } from 'react-native';

export default function ThinkScreen(){
    return(
        <View style = {styles.container}>
            <Text style = {styles.tile}>Think Stream</Text>
            <Text style = {styles.subtitle}>Capture your thoughts</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : '#1a1a1a'
    },
    tile :{
        fontSize: 32,
        fontWeight: 'bold',
        color:'#ffffff',
        marginBottom : 8
    },
    subtitle :{
        fontSize: 16,
        color:'#888888'
    },
})