import { useEffect, useState } from "react";
import convertAudiotoWav from '../utils/audioDebug';
import { TensorPtr, useExecutorchModule, ScalarType ,TokenizerModule, ExecutorchModule } from "react-native-executorch";

interface MoonshineModelHook{
    isReady: boolean;
    error: string | undefined;
    transcribe :(audioData:Float32Array) =>Promise<string|undefined> ;
};

export  function useMoonshineModel():MoonshineModelHook {

    const encoder = useExecutorchModule({
        modelSource: require('../assets/models/moonshine_tiny_xnnpack_encoder.pte')
    });
    const decoder = useExecutorchModule({
        modelSource: require('../assets/models/moonshine_tiny_xnnpack_decoder.pte')
    });
    const [tokenizer, setTokenizer] = useState<TokenizerModule | null>(null);
    const [istokenizerReady, setisTokenizerReady] = useState(false);

    useEffect(() => {
        async function setupTokenizer() {
        try {   
            const tokenizerInstance = new TokenizerModule();
            await tokenizerInstance.load({tokenizerSource:require('../assets/models/moonshine_tiny_tokenizer.json')});
            setTokenizer(tokenizerInstance);
            setisTokenizerReady(true);
        } catch (err) {
            console.error("Failed to load tokenizer",err)
        }
    }
        setupTokenizer();

    },[]);

    /*
    useEffect(() =>{
        const debugModel = async() =>{
            const EncoderModel =  new ExecutorchModule();
            await EncoderModel.load(require('../assets/models/moonshine_tiny_xnnpack_encoder.pte'));
            try {
                for (let i=0; i<5;i++){
                    const shape = await EncoderModel.getInputShape('forward',i);
                    console.log(`Enoder shape for ${i} input is ${shape}`)
                }

            } catch(err)
            {
                console.log(' no more input slots found');
            }

            const DecoderModel =  new ExecutorchModule();
            await DecoderModel.load(require('../assets/models/moonshine_tiny_xnnpack_decoder.pte'));
            try {
                for (let i=0; i<5;i++){
                    const shape = await DecoderModel.getInputShape('forward',i);
                    console.log(`Decoder shape for ${i} input is ${shape}`)
                }
                //DecoderModel.getInputShape

            } catch(err)
            {
                console.log(' no more input slots found');
            }

        };
        debugModel();
    },[]
    );
    */

    const isReady = encoder.isReady && decoder.isReady && istokenizerReady;
    const error = encoder.error?.message || decoder.error?.message;

    const transcribe =async (audioData:Float32Array) : Promise<string| undefined>=> {
        console.log("starting transcription process");
        console.log(`length of audio float32 array ${audioData.length}`)
        
        try {
            const uri = await convertAudiotoWav(audioData);
            console.log("wav path: ", uri);
        } catch(err){
            console.log("error fetching eav debug file")
        }
        
        
        const STATIC_INPUT= 480000;
        const paddedAudio = new Float32Array(STATIC_INPUT);
        const actualLength = Math.min(audioData.length, STATIC_INPUT)
        paddedAudio.set(audioData.subarray(0, actualLength));


        try{
            const audioTensor:TensorPtr ={
                dataPtr : paddedAudio,
                sizes : [1,paddedAudio.length],
                scalarType :ScalarType.FLOAT,
            };
            const encoderOutput = await encoder.forward([audioTensor]);
            console.log("encoder sucessfull")
            const hiddenStateTensor = encoderOutput[0];
            const hiddenStateArray = new Float32Array(hiddenStateTensor.dataPtr as ArrayBuffer);
            console.log("Hidden State Samples:", hiddenStateArray.slice(0, 10));
            console.log('encounter hidden sizes',hiddenStateTensor.sizes);
            /*
            const encoderArray = await tokenizer?.encode("hello");
            console.log("Encoded Array",encoderArray);

            for (let i=0;i<5;i++){
                const decoderId = await tokenizer?.decode([i]);
                console.log(`ID ${i} translates to ${decoderId}`);
            }
            */

            let currentTokens = [1];
            const TOTAL_TOKENS=178;
            const transcriptTokenIds =[]
            
            for (let i=0;i<TOTAL_TOKENS;i++){
                const tokenBuffer = new BigInt64Array(currentTokens.length);
                currentTokens.forEach((id,idx) => {
                    tokenBuffer[idx] = BigInt(id);
                })

                const currentTokenTensor = {
                dataPtr : tokenBuffer.buffer,
                sizes : [1,currentTokens.length],
                scalarType :ScalarType.LONG,
                }
                
                const decoderOutput = await decoder.forward([ currentTokenTensor, hiddenStateTensor ]);
                //const vocabSize = decoderOutput[0].sizes[2];
                const rawBuffer = decoderOutput[0].dataPtr as ArrayBuffer;

                const outputTokensInt = new BigInt64Array(rawBuffer);
                console.log('outputTokens size:',decoderOutput[0].sizes);
                console.log('rawBuffer byte size:',rawBuffer.byteLength);
                //console.log('output as int64, sample 20',outputTokensInt.slice(0,20));

                //const test_outTokenFloat = new Float32Array(rawBuffer).slice(0,20);
                //console.log('output as float32, sample 20',test_outTokenFloat);

                const test_outTokenInt16 = new Int16Array(rawBuffer);
                console.log('output as int16, all',test_outTokenInt16);
                
                //const allLogits = new Float32Array(rawBuffer);
                //console.log('allLogits',allLogits);
                /*
                const lastTokenindex = currentTokens.length - 1;
                const startOffset = lastTokenindex * vocabSize
                const lastTokenLogits = allLogits.subarray(startOffset, startOffset + vocabSize)

                */
                
                //if (i===4) break;

                //const nextTokenId = allLogits.reduce((maxI, x, currI, arr) => (x > arr[maxI] ? currI : maxI), 0);
                const nextTokenId= Number(outputTokensInt[outputTokensInt.length - 1])

                /*
                const nextTokenId = allLogits.reduce(
                    (maxIdx, val, idx) => val > allLogits[maxIdx] ? idx : maxIdx, 0);
                */
                console.log('Next TokenId',nextTokenId);

                if (nextTokenId === 2) {
                    break;
                };
                
                const word = await tokenizer?.idToToken(nextTokenId);
                if(word && !word.startsWith("<")) {
                    transcriptTokenIds.push(nextTokenId);
                }
                currentTokens.push(nextTokenId);
                console.log("currentTokens:",currentTokens);
                //currentTokens = [nextTokenId];
            };

            const transcription = await tokenizer?.decode(transcriptTokenIds);
            return transcription;
        } 
        catch(err){
            console.error("Transcription Error",err);
            throw new Error ("Transcription Error");
        }
    } 

    return {isReady,error, transcribe};


};

