import { Task, Thought } from '@/types';
import { create } from 'zustand';

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

export const useStore = create<StoreState>((set,get) =>({
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
    clearAllTasks: () => set({ tasks: [] })
}));
