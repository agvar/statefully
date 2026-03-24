import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { Colors, Layout, Spacing } from '@/constants/theme';

export default function TabLayout(){
    return(
        <Tabs
        screenOptions={{
            tabBarActiveTintColor: Colors.flow,
            tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
            tabBarStyle:{
                backgroundColor: 'transparent',
                position:'absolute',
                borderTopWidth: 0,
                elevation: 0,
                height: Layout.tabBarHeight,
                paddingBottom: 34,
                paddingTop: 8,
            },
            tabBarBackground: () => (
                <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
            ),
            headerShown: false,
        }}
        >
            <Tabs.Screen
                name="now"
                options={{
                    title: "Now",
                    tabBarIcon:({ color, size }) => (
                        <Ionicons name="radio-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="log"
                options={{
                    title: "Log",
                    headerTitle: 'Activity Log',
                    tabBarIcon:({ color, size }) => (
                        <Ionicons name="list-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="pulse"
                options={{
                    title: "Pulse",
                    tabBarIcon:({ color, size }) => (
                        <Ionicons name="pulse-outline" size={size} color={color} />
                    ),
                }}
            />
            
        </Tabs>
    );

}