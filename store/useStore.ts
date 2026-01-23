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
    //thoughts: Thought[];
    //tasks: Task[];
    activities :Activity[];
    activeActivity: Activity | null;

    startActivity: (name:string, source: ActivitySource, transcription?: string) => void;
    stopActivity: () => void;
    tagActivity:(id:string, energyState:EnergyState) => void;

    //Manual CRUD
   // addManualActivity:(Activity:Omit<Activity,'id'>) => void;
    //updateActivity:(id: string, updates:Partial<Activity>) => void;
    //deleteActivity: (id:string) => void;

    //Computed/helper
   // getCompletedActivities: () => Activity[];
    //getUntaggedActivities: () =>Activity[];
   // getTodayStats: () => { flowHours:number, drainHours: number};

       //Utility actions
   // clearAllThoughts: () => void;
   // clearAllTasks : () => void;
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
        tagActivity :(id,energyState) =>{
            set(state =>({
                activities: state.activities.map((activity:Activity) =>
                    activity.id == id ? {...activity, energyState}: activity
                )
            }));
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
