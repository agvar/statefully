import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { Activity, EnergyState } from '@/types/index';
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


interface ManualActivityProps {
visible:boolean,
onClose: () => void,
onSave: (activity:Omit<Activity,'id'>)=> void

}

export default function ManualActivityForm({visible, onClose, onSave}: ManualActivityProps){
    const [activityName, setActivityName] = useState('');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(()=>{
        const now = new Date();
        return new Date(now.getTime() + (3600 * 1000))
    });
    const [energyState, setEnergyState] = useState<EnergyState | undefined>(undefined);

    //Picker visibilty for iOS only
    const [showStartPicker,setShowStartPicker] = useState(false);
    const [showEndPicker,setShowEndPicker] = useState(false);

    const validateForm = (): string | null => {
        const durationMs= endTime.getTime() - startTime.getTime();
        const durationHrs= durationMs/(1000 * 3600)

        if(!activityName.trim()) {
            return 'Please enter an activity';
        }

        if(startTime >= endTime) {
            return 'End time must be after start time';
        }

        if(!energyState){
            return 'Please select Flow or Drain as Energy state';
        }

        if (durationHrs > 24){
            return 'Activity cannot exceed 24 hours';
        }
        return null;
    };

    const handleSave = () =>{
        const error = validateForm();
        if(error) {
            Alert.alert('Invalid Activity',error);
            return;
        }
        const durationSeconds = (endTime.getTime() -  startTime.getTime())/1000;

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
        return date.toLocaleDateString('en-US',
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
    if(minutes >0 ){
        return `${minutes}m`
    }
        return `${seconds}s`
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
                        </View>

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

                        {/* End Time */}
                        <View style={styles.section}>
                            <Text style={styles.label}> End Time</Text>
                            <TouchableOpacity
                                style={styles.dateTimeButton}
                                onPress={() => setShowEndPicker(true)}
                            >
                                <Text style={styles.dateTimeText}>
                                    {formatDate(endTime)} at {formatTime(endTime)}
                                </Text>
                            </TouchableOpacity>
                            {
                                showEndPicker &&(
                                    <DateTimePicker
                                        value={endTime}
                                        mode="datetime"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={handleEndTimeChange}
                                        maximumDate={new Date()}
                                    />
                                )
                            }
                        </View>

                        {/* Energy state */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Energy State</Text>
                            <View style={styles.energySelector}>
                                <TouchableOpacity
                                    style={[
                                        styles.energyButton,
                                        {borderColor: Colors.flow},
                                        energyState === 'flow' && {
                                            backgroundColor:`${Colors.flow}1A`
                                        },
                                    ]}
                                    onPress={()=> setEnergyState('flow')}
                                >
                                    <Text
                                        style={[
                                            styles.energyButtonText,
                                            energyState === 'flow' && { color: Colors.flow}
                                        ]}
                                    >
                                        ✨ Flow
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.energyButton,
                                        {borderColor: Colors.drain},
                                        energyState === 'drain' &&  {
                                            backgroundColor:`${Colors.drain}1A`
                                        },
                                        
                                    ]}
                                    onPress={()=> setEnergyState('drain')}
                                >
                                    <Text
                                        style={[
                                            styles.energyButtonText,
                                            energyState === 'drain' && { color: Colors.drain}
                                        ]}
                                    >
                                        😰 Drain
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* Duration display */}
                        <View style={styles.durationDisplay}>
                            <Text style={styles.durationLabel}>Duration:</Text>
                            <Text style={styles.durationValue}>{getDuration()}</Text>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

            </SafeAreaView>

        </Modal>
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
   
  cancelButton: {
    padding: Spacing.sm,
    minWidth: 60,
  },
  
  cancelText: {
    fontSize: Typography.size.base,
    color: Colors.primary,
  },
  
  title: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.light.primary,
  },
  
  saveButton: {
    padding: Spacing.sm,
    minWidth: 60,
    alignItems: 'flex-end',
  },
  
  saveButtonText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.primary,
  },
  
  section: {
    marginTop: Spacing.lg,
  },
  
  label: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.light.primary,
    marginBottom: Spacing.sm,
  },
  
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    fontSize: Typography.size.base,
    color: Colors.text.light.primary,
  },
  
  dateTimeButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
  },
  
  dateTimeText: {
    fontSize: Typography.size.base,
    color: Colors.text.light.primary,
  },
  
  energySelector: {
    flexDirection: 'row',
    gap: Spacing.md,  
  },
  
  energyButton: {
    flex: 1,
    padding: Spacing.md,
    borderWidth: 2,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    backgroundColor: '#FFFFFF',
  },
  
  energyButtonSelected: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',  // Light blue tint when selected
  },
  
  energyButtonText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.light.primary,
  },
  
  durationDisplay: {
    marginTop: Spacing.xl,
    padding: Spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  durationLabel: {
    fontSize: Typography.size.base,
    color: Colors.text.light.secondary,
  },
  
  durationValue: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.light.primary,
  },
});