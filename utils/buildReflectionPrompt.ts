import { EmotionCheckin,Activity,EmotionState } from "@/types"

export interface ReflectionContext {
    tasks : Activity[];
    thoughts: Activity[];
    emotions : EmotionCheckin[];
    windowLabel : string;
};
export const SYSTEM_PROMPT = `You are a private, thoughtful companion for someone tracking their cognitive energy throughout the day. You have been given a summary of their recent activities, thoughts, and emotional check-ins — all captured privately on their device.

Your role:
- Observe patterns honestly, without sugarcoating
- Be brief — one or two insights, not a list.
- Sound like a perceptive friend, not a productivity coach
- Ask one genuine question at most
- Never give generic advice like "try meditation" or "block focus time"
- Never repeat back what they already know as if it's insight
- If the data is thin or there's nothing notable, say so honestly
- Speak in second person, conversational tone
- Never mention that you are an AI
IMPORTANT: Respond in 4 sentences or fewer. Stop after your question.`;


export function buildReflectionPrompt({tasks,thoughts,emotions,windowLabel}: ReflectionContext):string {
    const serializeContext = () =>{
        const lines: string[] = [];

        //Today's tasks
        lines.push(`=== TASKS (${windowLabel}) ===`);
        if (tasks.length === 0){
            lines.push('No tasks logged yet.');
        } else {
            tasks.forEach(task=>{
                const mins = Math.round(task.duration /60);
                const time = new Date(task.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const energy = task.energyState ?? 'untagged';
                const emotion = task.emotionAtCapture ? ` | felt: ${task.emotionAtCapture}` : '';
                lines.push(`- "${task.name}" | ${mins}m | ${energy} | ${time}${emotion}`);
            });
            const flowMins = Math.round(tasks.filter(task => task.energyState === 'flow').reduce((sum,t) => sum + t.duration,0) /60);
            const drainMins = Math.round(tasks.filter(task => task.energyState === 'drain').reduce((sum,t) => sum + t.duration,0) /60);
            lines.push(`Total : ${flowMins}m Flow/ ${drainMins}m Drain`);
        }
        lines.push('');

        //Thoughts
        lines.push(`=== THOUGHTS (${windowLabel}) ===`);
        if (thoughts.length === 0){
            lines.push('No thoughts logged yet.');
        } else {
            const sorted = [...thoughts].sort((a,b) =>(b.recurrenceCount ?? 0) - (a.recurrenceCount ?? 0));
            sorted.forEach(thought=>{
                const recurrence = (thought.recurrenceCount ?? 0) > 0 ? ` | came by ${thought.recurrenceCount} x`:'';
                const emotion = thought.emotionAtCapture ? ` | felt: ${thought.emotionAtCapture}` : '';
                lines.push(`- "${thought.name}" | ${thought.energyState} | ${thought.intensity}${emotion}${recurrence}`);
            });
        }
        lines.push('');

        //Emotion check-ins
        lines.push(`=== EMOTION CHECK-INS (${windowLabel}) ===`);
        if (emotions.length === 0){
            lines.push('No emotion check-ins');
        } else {
            emotions.forEach(emotion =>{
                const time = new Date(emotion.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const note = emotion.note ? ` — "${emotion.note}"` : '';
                lines.push(`- ${emotion.state} at ${time}${note}`);
            });
        }
        return lines.join('\n');

    }
    const context = serializeContext();
    const request = `Based on the above, share what you genuinely notice. Be honest. Be brief. Ask me one thing if something stands out.`;
    //return `${SYSTEM_PROMPT}\n\n${context}\n\n${request}`;
    return `${context}\n\n${request}`;
}