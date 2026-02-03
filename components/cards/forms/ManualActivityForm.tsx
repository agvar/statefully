import { Activity, EnergyState } from '@/types/index';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Alert, Platform } from 'react-native';


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

    
}