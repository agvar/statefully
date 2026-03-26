/**
 * Core data types
 */

export type EnergyState = 'flow' | 'drain';
export type ActivitySource = 'voice' | 'manual';
export type EmotionState = 'alive' | 'calm' | 'low' | 'wired';
export type ActivityType = 'task' | 'thought';
export type Intensity = 'mild' | 'noticeable' | 'strong' | 'intense' | 'overwhelming';


// Activity Type

export interface Activity {
    id: string;
    name: string;
    startTime : Date;
    endTime?: Date;
    duration: number;
    energyState?: EnergyState;
    source: ActivitySource;
    transcription?: string;
    type: ActivityType;
    intensity ?: Intensity ;
    recurrenceCount?: number;
    recurrenceOf?: string ;
    emotionAtCapture?: EmotionState;

}

export interface EmotionCheckin {
    id: string;
    timestamp : Date;
    state : EmotionState;
    note?: string;
};
