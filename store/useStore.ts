import { Task, Thought } from '@/types';
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
    thoughts: Thought[];
    tasks: Task[];

    //Actions for thoughts
    addThought: (thought: Thought) => void;
    removeThought: (id:string) => void;
    updateThought: (id:string, updates:Partial<Thought>) => void;

    //Action for Tasks
    addTask: (task: Task) => void;
    removeTask: (id: string) => void;
    updateTask: (id:string, updates:Partial<Task>) => void;
    toggleTaskComplete : (id:string) => void;

    //Utility actions
    clearAllThoughts: () => void;
    clearAllTasks : () => void;
}

//Create the store

export const useStore = create<StoreState>()(
    persist(
    (set,get) =>({
    //Initial state
    thoughts: [],
    tasks: [],

    //Thought actions
    addThought: (thought) =>
        set((state) => ({
            thoughts: [thought, ...state.thoughts]
        })),

    removeThought: (id) =>
        set((state) => ({
            thoughts: state.thoughts.filter(t => t.id !== id)
        })),

    updateThought: (id, updates) =>
        set((state) => ({
            thoughts: state.thoughts.map(
                t => t.id === id ? { ...t, ...updates} : t
            )
        })),

    //Task actions
    addTask: (task) => 
        set((state) => ({
            tasks : [...state.tasks, task]
        })),
    
    removeTask: (id) => 
        set( (state) => ({
            tasks: state.tasks.filter(t => t.id !== id)
        })),

    updateTask: (id, updates) =>
        set((state) =>({
            tasks: state.tasks.map(t => t.id === id ? {...t, ...updates} : t)
        })),
    
    toggleTaskComplete : (id) =>set((state) =>
        ({
            tasks: state.tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t)
        })),

    //Utility actions
    clearAllThoughts: () => set({ thoughts: [] }),
    clearAllTasks: () => set({ tasks: [] }),
}),
{
    name: 'statefully-storage', //unique name for storage key
    storage: createJSONStorage(() => AsyncStorage),

    //custom merge function to handle dates
    merge : (persistedState, currentState) =>{
        const merged = { ...currentState, ...(persistedState as any) };

        if (merged.thoughts) {
            merged.thoughs = merged.thoughts.map((thought: any) =>(
                {...thought, timestamp: new Date(thought.timestamp)}
            ));
        }

        if (merged.tasks){
            merged.tasks= merged.thoughts.map((task:any) => (
                {...task,
                    startTime: task.startTime ? new Date(task.startTime) : undefined,
                    endTime: task.endTime ? new Date(task.endTime) : undefined,
                 }));
        }

        return merged;
    }
}
 )
);
