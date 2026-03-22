import { Activity, ActivitySource, EnergyState, EmotionCheckin, EmotionState, Intensity, ActivityType} from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Global App state store
 * Single source of truth for thoughts and tasks
 * 
 */

//Define store shape
interface StoreState{
    activities :Activity[];
    activeTask: Activity | null;
    emotionCheckIns : EmotionCheckin[];

    startTask: (name:string, source: ActivitySource, transcription?: string) => void;
    stopTask: () => void;
    tagTask:(id:string, energyState:EnergyState) => void;
    getCurrentActiveTask:() => Activity | null;
    getActivityById:(id:string) => Activity | undefined;
    addThought: (name:string,intensity: Intensity,energyState: EnergyState,source: ActivitySource,transcription?:string) => void;
    addEmotionCheckin :(emotionState: EmotionState,note?: string) => void ;
    incrementThoughtRecurrence: (id: string) => void;

    //Manual CRUD
    addManualActivity:(Activity:Omit<Activity,'id'>) => void;
    updateActivity:(id: string, updates:Partial<Activity>) => void;
    deleteActivity: (id:string) => void;

    //Computed/helper
    getCompletedTasks: () => Activity[];
    getUntaggedActivities: () =>Activity[];
    getTodayStats: () => { flowHours:number, drainHours: number};
    getEmotionCheckInsForDate: (date: Date) => EmotionCheckin[];
    getCompletedThoughts: () => Activity[];
    getCompletedActivities :() => Activity[];
    getThoughtsForDate: (date: Date) => Activity[];
    getTasksForDate: (date: Date) => Activity[];
    getStatsForDate : (date:Date) => {
        flowHours: number;
        drainHours: number;
        flowScore: number;
        thoughtCount: number;
        drainThoughtCount: number;
        dominantEmotion: EmotionState | null;
    };
    getTasksForDateRange :(start:Date,end:Date) => Activity[];
    getThoughtsForDateRange: (start:Date,end:Date) => Activity[];
    getEmotionCheckInsForDateRange:(start:Date,end:Date) => EmotionCheckin[];

    //Utility actions
    clearAllActivities: () => void;
}

//Create the store

export const useStore = create<StoreState>()( 
    persist(
    (set,get) =>{ 
        const isSameDay = (a:Date , b: Date) => new Date(a).setHours(0,0,0,0) === new Date(b).setHours(0,0,0,0);

        const getActivitiesForDate = (items:Activity[], date: Date,type: ActivityType) =>{
            return items.filter(item => item.type == type && isSameDay(new Date(item.startTime),date))
        };

        
        return {
        activities :[],
        activeTask: null,
        emotionCheckIns:[],

       

        startTask : (name, source, transcription) => {
            if(get().activeTask){
                throw new Error("Stop current Task first");
            }

            const newActivity:Activity = {
                id: Date.now().toString(),
                name,
                startTime: new Date(),
                duration: 0,
                source,
                transcription,
                type:'task'
            };
            set({ activeTask: newActivity });

        },

        stopTask: () =>{
            const active= get().activeTask;
            if(!active) return;

            const endTime= new Date();
            const duration = (endTime.getTime() - active.startTime.getTime())/1000;

            const stoppedActivity = {
                ...active, endTime, duration
            };

            set(state => ({
                activeTask: null,
                activities: [stoppedActivity, ...state.activities]
            }));
        },

        tagTask :(id, energyState) =>{
            set(state =>({
                activities: state.activities.map((activity:Activity) =>
                    activity.id == id ? {...activity, energyState}: activity
                )
            }));
        },
        getCompletedTasks: () =>{
            return get().activities.filter((activity: Activity)=>
                activity.energyState != undefined && activity.type === 'task'
            )
        },
        getCompletedThoughts: () =>{
            return get().activities.filter((activity: Activity)=>
                activity.energyState != undefined && activity.type === 'thought'
            )
        },
        getCompletedActivities:()=>{
            return get().activities.filter((activity: Activity)=>
                activity.energyState != undefined)
            .sort((a:Activity, b:Activity) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
        },
        getUntaggedActivities: () =>{
            return get().activities.filter((activity:Activity) =>
                activity.energyState == undefined && activity.endTime != undefined
        )
        },
        
        getTasksForDate: (date) =>{
           return getActivitiesForDate(get().activities, new Date(date),'task')
        },
        getThoughtsForDate: (date) =>{
           return getActivitiesForDate(get().activities, new Date(date),'thought')
        },
         getEmotionCheckInsForDate:(date:Date)  =>{
            return get().emotionCheckIns.filter((emotion:EmotionCheckin)=> isSameDay(new Date(emotion.timestamp),date))
        },

        getTodayStats: () =>{
            const today = new Date()
            const todayActivities = get().getTasksForDate(today) 

            const flowSeconds = todayActivities
                .filter((activity:Activity) => activity.energyState === 'flow')
                .reduce((sum:number,activity:Activity) => sum + activity.duration,0);

            const drainSeconds = todayActivities
                .filter((activity:Activity) => activity.energyState === 'drain')
                .reduce((sum:number,activity:Activity) => sum + activity.duration,0);
            
            return {
                flowHours : flowSeconds /3600,
                drainHours : drainSeconds /3600
            };
        },
        getTasksForDateRange:(start:Date,end:Date) =>{
            return get().activities.filter( (activity:Activity) =>
                activity.type === 'task' &&
                new Date(activity.startTime) >= start &&
                new Date(activity.startTime) <= end
            )
        },
        getThoughtsForDateRange:(start:Date,end:Date) =>{
            return get().activities.filter( (activity:Activity) =>
                activity.type === 'thought' &&
                new Date(activity.startTime) >= start &&
                new Date(activity.startTime) <= end
            )
        },
        getEmotionCheckInsForDateRange:(start:Date,end:Date) =>{
            return get().emotionCheckIns.filter( (emotion:EmotionCheckin) =>
                new Date(emotion.timestamp) >= start &&
                new Date(emotion.timestamp) <= end
            )
        },

        addManualActivity:(activity) =>{
            const newActivity:Activity = {
                ...activity,
                id: Date.now().toString()
            };
            set(state =>({
                activities: [...state.activities, newActivity]
                    .sort((a,b) => b.startTime.getTime() - a.startTime.getTime())
            }));
        },
        updateActivity:(id, updates)=>{
            set(state=>({
                activities: state.activities.map((activity:Activity)=>
                    activity.id === id
                        ? {...activity, ...updates}
                        : activity
                    )
            }));
        },
        deleteActivity:(id)=>{
            set(state => ({
                activities: state.activities.filter((activity:Activity)=>
                    activity.id !== id )
            }))
        },
        getCurrentActiveTask:() =>{
            const active = get().activeTask;
            if (!active ) return null;

            const elapsed= (Date.now()- active.startTime.getTime())/ 1000;
            if (elapsed > 3600 * 24) {
                console.warn('Task running for over 24 hours');
            }
            return active;
        },

        getActivityById:(id) => {
            return get().activities.find((activity:Activity) => activity.id === id );

        },
        clearAllActivities: () => {
            set({
                activities:[],
                activeTask : null
            });
        },
        addEmotionCheckin:(emotionState: EmotionState,note?: string)=>{
            const newEmotion: EmotionCheckin = {
                    id: Date.now().toString(),
                    timestamp : new Date(),
                    state : emotionState,
                    note: note,
            };
            set(state => ({
                 emotionCheckIns: [newEmotion, ...state.emotionCheckIns]
             }));
        },
        incrementThoughtRecurrence :(id) =>{
            set(state =>({
                activities: state.activities.map((activity:Activity) =>
                    activity.id == id ? 
                        {...activity, 
                            recurrenceCount:(activity.recurrenceCount ?? 0) + 1,
                            startTime: new Date()
                        }
                        : activity
                )
            }));
        },
        addThought : (name, intensity, energyState, source, transcription) => {
            const now = new Date();
            const newThought:Activity = {
                id: Date.now().toString(),
                name,
                startTime: now,
                endTime:now,
                energyState,
                duration: 0,
                source,
                transcription,
                type:'thought',
                intensity,
                recurrenceCount:0
            };
            set(state => ({
                activities: [newThought, ...state.activities]
            }));

        },
        getStatsForDate: (date) =>{
            const statsDate = new Date(date);
            const dateTasks = get().getTasksForDate(statsDate) ;
            const dateThoughts = get().getThoughtsForDate(statsDate) ;
            const dateEmotions = get().getEmotionCheckInsForDate(statsDate)

            const flowSeconds = dateTasks
                .filter((activity:Activity) => activity.energyState === 'flow')
                .reduce((sum:number,activity:Activity) => sum + activity.duration,0);

            const drainSeconds = dateTasks
                .filter((activity:Activity) => activity.energyState === 'drain')
                .reduce((sum:number,activity:Activity) => sum + activity.duration,0);

            const flowHours= flowSeconds/ 3600;
            const drainHours= drainSeconds/ 3600;
            const flowScore = (flowHours + drainHours) === 0 
                ? 0 
                :flowHours / (flowHours + drainHours);

            const thoughtCount = dateThoughts.length;
            const drainThoughtCount = dateThoughts
                .filter((thought:Activity) => thought.energyState === 'drain')
                .length;
            
            const emotionCounts = { alive:0, calm:0, low:0, wired:0};
            dateEmotions.forEach(emotion => emotionCounts[emotion.state]++);
            const dominantEmotion: EmotionState | null = dateEmotions.length === 0
                ? null
                : Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0][0] as EmotionState;

            return {
                flowHours,
                drainHours,
                flowScore,
                thoughtCount,
                drainThoughtCount,
                dominantEmotion
            }

        },
    }},
{
    name: 'statefully-storage', //unique name for storage key
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) =>({
       activities : state.activities,
       emotionCheckIns : state.emotionCheckIns
    }),

    //custom merge function to handle dates
    merge : (persisted: any, current: StoreState) =>{
        const activities = (persisted.activities || []).map(
            (activity:Activity) => ({
                    ...activity,
                    startTime: new Date(activity.startTime),
                    endTime: activity.endTime? new Date(activity.endTime): undefined
            })
                );
            const emotionCheckIns = (persisted.emotionCheckIns || []).map(
            (emotion:EmotionCheckin) => ({
                    ...emotion,
                    timestamp: new Date(emotion.timestamp)
            })
                );
            return {...current, activities,emotionCheckIns}
                }
    })
);
