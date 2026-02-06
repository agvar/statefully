import ActivityLogCard from '@/components/cards/ActivityLogCard';
import ManualActivityForm from '@/components/forms/ManualActivityForm';
import DateSectionHeader from '@/components/sections/DateSectionHeader';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useStore } from '@/store/useStore';
import { Activity } from '@/types';
import { useState } from 'react';
import { Alert, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

 export default function ActivityLogScreen ()  {
    const activities = useStore(state => state.activities);
    const deleteActivity = useStore(store => store.deleteActivity);
    const addManualActivity = useStore(store => store.addManualActivity)

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

    const groupedActivities = groupActivitiesByDate(activities);
    const handleDelete = (activity : Activity) =>{
        Alert.alert(
            'Delete Activity',
            `Are you sure you want to delete ${activity.name} ?`,
            [
                { text: 'Cancel', style :'cancel'},
                {
                    text:'Delete',
                    style:'destructive',
                    onPress: () => deleteActivity(activity.id)
                },
            ]
        );
    };

    const handleEdit = (activity: Activity) => {
        setEditingActivity(activity);
    };

    const handleAddActivity = (activity: Omit<Activity, 'id'>)=>{
        addManualActivity(activity);
        setShowAddModal(false);
    }

    return(
        <View style={styles.container}>
            {/*  Add Button */}
            <TouchableOpacity
            style = {styles.addButton}
            onPress =  {() => setShowAddModal(true)}
            activeOpacity={0.7}
            >
                <Text style={styles.addButtonText}>+ Add Manual Activity</Text>
            </TouchableOpacity>

            {/* Activity List*/}
            <SectionList 
                sections ={groupedActivities}
                keyExtractor={(item) => item.id}
                renderSectionHeader={({ section}) => (
                    <DateSectionHeader 
                    date = { section.date}
                    activities={ section.data}
                    />
                )}
                renderItem={({item})=> (
                    <ActivityLogCard 
                        activity = {item}
                        onEdit={ ()=> handleEdit(item)}
                        onDelete={()=>handleDelete(item)}
                    />
                )}
                contentContainerStyle={styles.listContent}
                stickySectionHeadersEnabled={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>
                            No activities yet.Start tracking in the Think Stream !
                        </Text>

                    </View>
                }
            />

                {/* Add ManualActivityForm modal */}
                <ManualActivityForm 
                    visible={showAddModal}
                    onClose={()=>setShowAddModal(false)}
                    onSave={handleAddActivity}
                />
        </View>

    )

};

const groupActivitiesByDate = (activities: Activity[]) =>{
    const groups : {[key: string]:Activity[] } ={};

    activities.forEach(activity => {
        const date = new Date(activity.startTime);
        date.setHours(0,0,0,0);
        const key = date.toISOString().split('T')[0];
        if(!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(activity);
    });

    return Object.entries(groups)
        .map(([datestring,activities]) => ({
            date : new Date(datestring + 'T00:00:00' ),
            data : activities.sort((a,b) => 
                b.startTime.getTime()- a.startTime.getTime())
            ,
    }))
    .sort((a,b)=> b.date.getTime() - a.date.getTime());
        
    };

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.light,
    },
    addButton: {
        marginTop: Spacing['2xl'] + 20, // Safe area + spacing
        marginHorizontal: Spacing.md,
        padding: Spacing.md,
        backgroundColor: Colors.primary,
        borderRadius: 12,
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: Typography.size.base,
        fontWeight: Typography.weight.semibold,
        color: '#FFFFFF',
    },
    listContent: {
        paddingBottom: Spacing.xl,
    },
    emptyState: {
        padding: Spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing['3xl'],
    },
    emptyText: {
        fontSize: Typography.size.base,
        color: Colors.text.light.secondary,
        textAlign: 'center',
    },
});