import File from 'expo-file-system';


export default function convertAudiotoWav(audioDate:Float32Array) {
    const HEADER_SIZE = 44;
    const dataSize = audioDate.length * 2;// 2 bytes per sample
    const buffer = new ArrayBuffer(HEADER_SIZE + dataSize);
    const view = new DataView(buffer)

    const writeString = (view: DataView,offset:number,str:string) =>{
        for(let i=0;i<str.length;i++){
            view.setInt8(offset+i,str.charCodeAt(i))
        }
    };
    //writing first part of the WAV header
    writeString(view,0,'RIFF');

    //second part at byte-4 specifies the length of the file
    // which is the (44 bit header - 8 bits of the 'RIFF') + data size
    // hence 44=8=36 plus the data size
    view.setUint32(4,36 + dataSize, true);
    writeString(view,8,'WAVE');
    writeString(view,8,'fmt ');
    view.setUint32(4,36 + dataSize, true);
    writeString(view,8,'1');
    writeString(view,8,'WAVE');
    writeString(view,8,'WAVE');


}