import { File } from 'expo-file-system';

export const transcribeAudio = async(audioFile: File): Promise<string> => {
    const apiKey = process.env.EXPO_PUBLIC_DEEPGRAM_API_KEY
    console.log("Log: starting Transcription util function");
    const transcribeUrl = 'https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true'
    try {
        //const audioFile = new File(fileUri);
        const audioBuffer = await audioFile.arrayBuffer();
    const response = await fetch(transcribeUrl,{
        method : "POST",
        headers: {
            "Content-Type" :"audio/m4a",
            "Authorization":`Token ${apiKey} `,
        },
        body: audioBuffer
    });
        if(!response.ok){
            const errData = await response.json();
            console.error("Deepgram, API error:",errData)
            throw new Error (`Deepgram returned ${response.status}:${errData.err_msg}`)
        }
        const respose_json = await response.json()
        console.log(`Log: json response is ${JSON.stringify(respose_json)}}`);
        const transcript =  respose_json.results.channels[0].alternatives[0].transcript;
        if(!transcript){
            throw new Error('No transcript in response');
        }
        return transcript;
    }
    catch(err){
        console.error("Transcription failed",err);
        throw err;
    }
}