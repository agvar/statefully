import { useEffect, useState } from "react";
import convertAudiotoWav from '../utils/audioDebug';
import { TensorPtr, useExecutorchModule, ScalarType ,TokenizerModule, ExecutorchModule } from "react-native-executorch";

interface MoonshineModelHook{
    isReady: boolean;
    error: string | undefined;
    transcribe :(audioData:Float32Array) =>Promise<string> ;
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

            } catch(err)
            {
                console.log(' no more input slots found');
            }

        };
        debugModel();
    },[]
    );

    const isReady = encoder.isReady && decoder.isReady && istokenizerReady;
    const error = encoder.error?.message || decoder.error?.message;

    const transcribe =async (audioData:Float32Array) => {
        console.log("starting transcription process");
        //console.log(`length of audio float32 array ${audioData.length}`)
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
            
            //pad encoder hidden state
            /*
            const rawEncoderData = new Float32Array(hiddenStateTensor.dataPtr as ArrayBuffer);
            const PADDED_TIME = 1248;
            const FEATURE_DIM = 288;
            const  paddedHiddenData = new Float32Array(1 * PADDED_TIME * FEATURE_DIM)
            paddedHiddenData.set(rawEncoderData);
            
            const paddedHiddenTensor : TensorPtr = {
                dataPtr:paddedHiddenData,
                sizes :[1,PADDED_TIME,FEATURE_DIM],
                scalarType:ScalarType.FLOAT
            }
            */
            
            let currentTokens = [1];
            let transcript = "";
            const PADDED_TOKENS=178;
            
            for (let i=0;i<PADDED_TOKENS;i++){
                const tokenBuffer = new BigInt64Array(PADDED_TOKENS);
                currentTokens.forEach((id,idx) => {
                    tokenBuffer[idx] = BigInt(id);
                })

                const currentTokenTensor = {
                dataPtr : tokenBuffer.buffer,
                sizes : [1,PADDED_TOKENS],
                scalarType :ScalarType.LONG,
                }
                //console.log("first token for decoder",currentTokenTensor.sizes)
                //console.log("hidden state encoder",paddedHiddenTensor.sizes)
                //console.log('decoder input',[currentTokenTensor, paddedHiddenTensor]);
                
                const decoderOutput = await decoder.forward([ currentTokenTensor, hiddenStateTensor ]);
                //console.log("Decoder sucessfull");
                const vocabSize = decoderOutput[0].sizes[2];
                const rawBuffer = decoderOutput[0].dataPtr as ArrayBuffer;
                const outputTokens = new BigInt64Array(rawBuffer);
                //console.log('outputTokens',outputTokens);
                /*
                const allLogits = new Float32Array(rawBuffer);

                const lastTokenindex = currentTokens.length - 1;
                const startOffset = lastTokenindex * vocabSize
                const lastTokenLogits = allLogits.subarray(startOffset, startOffset + vocabSize)

                console.log('🎤 Logits first 10 samples:', allLogits.slice(0, 10));
                console.log('🎤 All logits min:', Math.min(...allLogits));
                console.log('🎤 All logits max:', Math.max(...allLogits));
                console.log('🎤 logits has zero values?', allLogits.some(v => v !== 0));
                */
                
                console.log('outputTokens',outputTokens.slice(0,10));
                //console.log('current tokens list',currentTokens);
                //console.log('current token value',outputTokens[currentTokens.length-1]);

                
                if (i===4) break;

                //const nextTokenId = lastTokenLogits.reduce((maxI, x, currI, arr) => (x > arr[maxI] ? currI : maxI), 0);
                const nextTokenId= Number(outputTokens[currentTokens.length])
                console.log('Next TokenId',nextTokenId);
                /*
                if (nextTokenId === 1) {
                    // If we've been stuck on '1' for too long, the audio might be too quiet/unclear
                    if (i > 10) { 
                        console.log("Model is stuck in a 'Start' loop. Audio might be unrecognized.");
                        break; 
                    }
                    // Just continue to the next iteration without adding to currentTokens
                    continue; 
                }
                */

                if (nextTokenId === 2) {
                    break;
                };
                if (nextTokenId === 0 || nextTokenId === 3){
                    console.log("next token id",nextTokenId);
                    console.log("Model predicted PAD or UNK, stopping");
                    break;
                }
                
                
                const word = await tokenizer?.idToToken(nextTokenId);
                if (word && !word.startsWith("<")){
                    transcript += word
                    console.log("Word",word)
            }
                
                currentTokens.push(nextTokenId);
            }
                
            return transcript;
        } 
        catch(err){
            console.error("Transcription Error",err);
            throw new Error ("Transcription Error");
        }
    } 

    return {isReady,error, transcribe};


};

