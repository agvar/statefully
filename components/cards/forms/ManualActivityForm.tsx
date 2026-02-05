import { Activity, EnergyState } from '@/types/index';
import DateTimePicker,{DateTimePickerEvent} from "@react-native-community/datetimepicker
import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { View, Modal, Text, StyleSheet,KeyboardAvoidingView, 
    ScrollView,TouchableOpacity, TextInput} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacing, Colors } from '@/constants/theme';


interface ManualActivityProps {
visible:boolean,
onClose: () => void,
onSave: (activity:Omit<Activity,'id'>)=> void

}

export default function ManualActivityForm({visible, onClose, onSave}: ManualActivityProps){
    const [activityName, setActivityName] = useState('');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [energyState, setEnergyState] = useState<EnergyState | undefined>(undefined);

    //Picker visibilty for iOS only
    const [showStartPicker,setShowStartPicker] = useState(false);
    const [showEndPicker,setShowEndPicker] = useState(false);

    const validateForm = (): string | null => {
        if(!activityName.trim()) {
            return 'Please enter an activity';
        }

        if(startTime<= endTime) {
            return 'End time must be after start time';
        }

        if(!energyState){
            return 'Please select Flow or Drain as Energy state';
        }
        return null;
    };

    const handleSave = () =>{
        const error = validateForm();
        if(error) {
            Alert.alert('Invalid Activity',error);
            return;
        }
        const durationSeconds = endTime.getTime() -  startTime.getTime();

        const newActivity: Omit<Activity, 'id'> = {
            name:activityName.trim(),
            startTime: startTime,
            endTime: endTime,
            duration: durationSeconds,
            energyState: energyState!,
            source: 'manual',
            transcription: undefined,
        };

        onSave(newActivity);
        resetForm();
        onClose();

    };

    const resetForm = () => {
        setActivityName('');
        setStartTime(new Date());
        setEndTime(new Date());
        setEnergyState(undefined);
    }

    const handleStartTimeChange = (event:DateTimePickerEvent, selectedDate?: Date) => {
        if(event.type === 'dismissed'){
            setShowStartPicker(false);
            return;
        }
        if(selectedDate){
            setStartTime(selectedDate)
            if(selectedDate > endTime ) {
                setEndTime(new Date(selectedDate.getTime() + 3600000));
            }
        }

        if (Platform.OS === 'android') {
            setShowStartPicker(false);
        }
    }

    const handleEndTimeChange = (event:DateTimePickerEvent, selectedDate?: Date) => {
        if(event.type === 'dismissed'){
            setShowEndPicker(false);
            return;
        }
        if(selectedDate){
            setEndTime(selectedDate)
        }

        if (Platform.OS === 'android') {
            setShowEndPicker(false);
        }
    }
    const formatTime = (date: Date): string =>{
        return date.toLocaleTimeString('en-US',
            {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true 
            }
        );
   };

    const formatDate = (date: Date): string =>{
        return date.toLocaleTimeString('en-US',
            {
                month: 'short',
                day: 'numeric',
                year: 'numeric' 
            }
        );
   };

   const getDuration=(): string =>{
    if (startTime >= endTime){
        return 'Invalid';
    }
    const seconds = (endTime.getTime() - startTime.getTime()) /1000;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600)/ 60);
    if(hours > 0) {
        return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
   };

    return(
        <Modal
            visible={visible}
            animationType='slide'
            presentationStyle='pageSheet'
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.container} edges={['top']}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding': 'height'}
                    style={{ flex:1 }}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                    >   
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            
                            <Text style={styles.title}>Add Activity</Text>

                            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>

                        {/*  Activity Name*/}
                        <View style={styles.section}>
                            <Text style={styles.label}>Activity Name</Text>
                            <TextInput
                                style={styles.input}
                                value={activityName}
                                onChangeText={setActivityName}
                                placeholder='e.g., Working on presentation'
                                placeholderTextColor={Colors.text.light.tertiary}
                                autoCapitalize="sentences"
                                returnKeyType="done"
                                maxLength={100}
                            />

                        {/* Start Time */}
                        <View style={styles.section}>
                            <Text style={styles.label}> Start Time</Text>
                            <TouchableOpacity
                                style={styles.dateTimeButton}
                                onPress={() => setShowStartPicker(true)}
                            >
                                <Text style={styles.dateTimeText}>
                                    {formatDate(startTime)} at {formatTime(startTime)}
                                </Text>
                            </TouchableOpacity>
                            {
                                showStartPicker &&(
                                    <DateTimePicker
                                        value={startTime}
                                        mode="datetime"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={handleStartTimeChange}
                                        maximumDate={new Date()}
                                    />
                                )
                            }

                        </View>

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

            </SafeAreaView>

        </Modal>>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
})