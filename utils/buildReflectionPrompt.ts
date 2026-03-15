import { EmotionCheckin,Activity,EmotionState } from "@/types"

interface ReflectionContext {
    currentEmotion : EmotionState;
    tasks : Activity[];
    thoughts: Activity[];
    emotions : EmotionCheckin[];
    windowLabel : string;
}

export function buildReflectionPrompt({currentEmotion,tasks,thoughts,emotions,windowLabel}: ReflectionContext):string {
    const SYSTEM_PROMPT = `You are a private, thoughtful companion for someone tracking 
    their cognitive energy throughout the day.You have been given a summary of their recent activities, 
    thoughts, and emotional check-ins — all captured privately on their device.

        Your role:
        - Observe patterns honestly, without sugarcoating
        - Be brief — one or two insights, not a list
        - Sound like a perceptive friend, not a productivity coach
        - Ask one genuine question at most
        - Never give generic advice like "try meditation" or "block focus time"
        - Never repeat back what they already know as if it's insight
        - If the data is thin or there's nothing notable, say so honestly
        - Speak in second person, conversational tone
        - Never mention that you are an AI`;

    const serializeContext = () =>{
        const lines: string[] = [];

        //current emotion
        lines.push(`=== CURRENT STATE ===`);
        lines.push(`Emotion right now : ${currentEmotion ?? 'not checked in '}`);
        lines.push('');

        //Today's tasks
        lines.push(`=== TASKS (${windowLabel}) ===`);
        if (tasks.length === 0){
            lines.push('No tasks logged yet.');
        } else {
            tasks.forEach(task=>{
                const mins = Math.round(task.duration /60);
                const time = new Date(task.startTime).toLocaleTimeString
            })
        }
    }
    
    
    return ''
}