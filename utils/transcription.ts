import { File } from 'expo-file-system';

export const transcribeAudio = async(fileUri: File): Promise<string> => {
    const apiKey = process.env.EXPO_PUBLIC_DEEPGRAM_API_KEY
    console.log("Log: starting Transcription util function");
    const transcribeUrl = 'https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true'
    try {
        const audioFile = new File(fileUri);
        const audioBuffer = await audioFile.arrayBuffer();
        console.log("Log: audioBuffer created");
    const response = await fetch(transcribeUrl,{
        method : "POST",
        headers: {
            "Content-Type" :"audio/m4a",
            "Authorization":`Token ${apiKey} `,
        },
        body: audioBuffer
    });
         console.log("Log: awaiting response");
        const respose_json = await response.json()
        console.log(`Log: json response is ${JSON.stringify(respose_json)}}`);
        return respose_json.results.channels[0].alternatives[0].transcript
    }
    catch(err){
        console.error("Transcription failed",err);
        throw err;
    }
}