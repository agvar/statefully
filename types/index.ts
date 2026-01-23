/**
 * Core data types
 */

// Activity Type

export interface Activity {
    id: string;
    name: string;
    startTime : Date;
    endTime?: Date;
    duration: number;
    energyState?: 'flow' | 'drain';
    source: 'voice' | 'manual';
    transcription?: string;

}




//Sentiment Types

export type Sentiment = 'positive'| 'negative' | 'neutral';

//Thought object

export interface Thought {
    id: string;                 //Unique id
    text: string;               // Thought content
    timestamp: Date;            // when the thought was captured
    sentiment: Sentiment;       // Sentiment (emotional tone)
    audioUri?: string;           //Optional: audio file path
}

//Task object

export interface Task {
    id: string;
    title: string;
    description?: string;
    duration: number;           //second spend
    energyLevel: 'high' | 'medium' | 'low';
    startTime?: Date;
    endTime?: Date;
    completed:boolean;
    sourceThoughtId?: string;
}

//Filter and sort types of thoughts

export type ThoughtFilter = 'all' | 'positive' | 'negative' | 'neutral';
export type ThoughtSort = 'recent' | 'oldest';