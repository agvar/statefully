export const formatTime = (date : Date): string =>{ 
    const d = new Date(date);
    const h = d.getHours();
    const m = d.getMinutes().toString().padStart(2,'0');
    const ampm = h >= 12? 'PM' : 'AM';
    const hour = h % 12 || 12 ;
    return `${hour}:${m} ${ampm}`;
}