import { Activity, EnergyState } from '@/types/index';
import { useState } from 'react';
import { Alert } from 'react-native';


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
    
}