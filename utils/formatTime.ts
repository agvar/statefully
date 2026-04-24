export const formatTime = (date : Date): string =>{ 
    const d = new Date(date);
    const h = d.getHours();
    const m = d.getMinutes().toString().padStart(2,'0');
    const ampm = h >= 12? 'PM' : 'AM';
    const hour = h % 12 || 12 ;
    return `${hour}:${m} ${ampm}`;
}


export const formatDuration = (seconds:number): string =>{
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600)/ 60);

    if (hours > 0){
        return `${hours}h ${minutes}m`;
    }
    if(minutes > 0){
        return `${minutes}m`
    }
    return `${seconds}s`
};

