import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout(){
    return(
        <Tabs
        screenOptions={{
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#8E8E93',
            tabBarStyle:{
                backgroundColor: '#F2F2F7',
                borderTopWidth: 0,
                elevation: 0,
                height: 88,
                paddingBottom: 34,
                paddingTop: 8,
            },
            headerShown: false,
        }}
        >
            <Tabs.Screen
                name="think"
                options={{
                    title: "Think",
                    tabBarIcon:({ color, size }) => (
                        <Ionicons name="bulb-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="do"
                options={{
                    title: "Do",
                    tabBarIcon:({ color, size }) => (
                        <Ionicons name="checkmark-circle-outline" size={size} color={color} />
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