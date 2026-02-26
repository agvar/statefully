import {File ,Paths } from 'expo-file-system';


export default async function  convertAudiotoWav(audioDate:Float32Array) {
    const HEADER_SIZE = 44;
    const dataSize = audioDate.length * 2;// 2 bytes per sample
    const buffer = new ArrayBuffer(HEADER_SIZE + dataSize);
    const view = new  DataView(buffer)

    const writeString = (view: DataView,offset:number,str:string) =>{
        for(let i=0;i<str.length;i++){
            view.setInt8(offset+i,str.charCodeAt(i))
        }
    };

    const writeData=(audioDate:Float32Array,offset:number)=>{
        for (let i=0; i<audioDate.length * 2; i+2){
            view.setInt16(offset+1,audioDate[i],true)
        }
    }

    const convertIntBase64 = (intArray:Int8Array) => {
        let binary ='';
        const lenArray = intArray.byteLength;

        for (let i =0; i<lenArray; i++){
            binary += String.fromCharCode(intArray[i]);
        }
        return btoa(binary)

    }
    //writing first part of the WAV header
    writeString(view,0,'RIFF');

    //second part at byte-4 specifies the length of the file
    // which is the (44 bit header - 8 bits of the 'RIFF') + data size
    // hence 44=8=36 plus the data size
    view.setUint32(4,36 + dataSize, true);
    writeString(view,8,'WAVE');
    writeString(view,12,'fmt ');
    view.setUint32(16,16);
    view.setUint16(20,1);
    view.setUint16(22,1);
    view.setUint32(24,16000); //sample rate
    view.setUint32(28,32000); // Byte rate (SampleRate * Channels * 2) (Uint32)
    view.setUint16(32,2); 
    view.setUint16(34,16);
    writeString(view,36,'data');
    view.setUint32(40,dataSize);
    writeData(audioDate,44);

    const uint8 = new Uint8Array(view.buffer);

    const wavFile = new File(Paths.document,'debug_audio.wav');
    await wavFile.write(uint8);
    console.log(`saved debug audio file to ${wavFile}`)

    

}