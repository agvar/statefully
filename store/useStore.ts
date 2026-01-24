import { Activity, ActivitySource, EnergyState } from '@/types';
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
    activeActivity: Activity | null;

    startActivity: (name:string, source: ActivitySource, transcription?: string) => void;
    stopActivity: () => void;
    tagActivity:(id:string, energyState:EnergyState) => void;
    getCurrentActiveActivity:() => Activity | null;
    getActivityById:(id:string) => Activity | undefined;


    //Manual CRUD
    addManualActivity:(Activity:Omit<Activity,'id'>) => void;
    updateActivity:(id: string, updates:Partial<Activity>) => void;
    deleteActivity: (id:string) => void;

    //Computed/helper
    getCompletedActivities: () => Activity[];
    getUntaggedActivities: () =>Activity[];
    getTodayStats: () => { flowHours:number, drainHours: number};

    //Utility actions
    clearAllActivities: () => void;
}

//Create the store

export const useStore = create<StoreState>()(
    persist(
    (set,get) =>({
        activities :[],
        activeActivity: null,

        startActivity : (name, source, transcription) => {
            if(get().activeActivity){
                throw new Error("Stop current activity first");
            }

            const newActivity:Activity = {
                id: Date.now().toString(),
                name,
                startTime: new Date(),
                duration: 0,
                source,
                transcription
            };
            set({ activeActivity: newActivity });

        },

        stopActivity: () =>{
            const active= get().activeActivity;
            if(!active) return;

            const endTime= new Date();
            const duration = (endTime.getTime() - active.startTime.getTime())/1000;

            const stoppedActivity = {
                ...active, endTime, duration
            };

            set(state => ({
                activeActivity: null,
                activities: [stoppedActivity, ...state.activities]
            }));
        },

        tagActivity :(id, energyState) =>{
            set(state =>({
                activities: state.activities.map((activity:Activity) =>
                    activity.id == id ? {...activity, energyState}: activity
                )
            }));
        },
        getCompletedActivities: () =>{
            return get().activities.filter((activity: Activity)=>
                activity.energyState != undefined
            )
        },
        getUntaggedActivities: () =>{
            return get().activities.filter((activity:Activity) =>
                activity.energyState == undefined && activity.endTime != undefined
        )
        },
        getTodayStats: () =>{
            const today = new Date().setHours(0,0,0,0);
            const todayActivities = get().activities.filter((activity:Activity) => {
                const activityDate = new Date(activity.startTime).setHours(0,0,0,0);
                return activityDate === today;
            });

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
        getCurrentActiveActivity:() =>{
            const active = get().activeActivity;
            if (!active ) return null;

            const elapsed= (Date.now()- active.startTime.getTime())/ 1000;
            if (elapsed > 3600 * 24) {
                console.warn('Activity running for over 24 hours');
            }
            return active;
        },

        getActivityById:(id) => {
            return get().activities.find((activity:Activity) => activity.id === id );

        },
        clearAllActivities: () => {
            set({
                activities:[],
                activeActivity : null
            });
        }
    }),
{
    name: 'statefully-storage', //unique name for storage key
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) =>({
       activities : state.activities,
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
            return {...current, activities}
                }
    })
);
