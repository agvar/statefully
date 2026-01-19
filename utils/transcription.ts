import { File } from 'expo-file-system';

export const transcribeAudio = async(fileUri: File): Promise<string> => {
    const transcribeUrl = 'https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true'
    try {
        const audioFile = new File(fileUri);
        const audioBuffer = await audioFile.arrayBuffer();
    const response = await fetch(transcribeUrl,{
        method : "POST",
        headers: {
            "Content-Type" :"audio/m4a",
            "Authorization": `Token ${process.env.DEEPGRAM_API_KEY} `,
        },
        body: audioBuffer
    });
        const respose_json = await response.json()
        return respose_json.results.channels[0].alternatives[0].transcript
    }
    catch(err){
        console.error("Transcription failed",err);
        throw err;
    }
}