import { useEffect, useState } from "react";
import { TensorPtr, useExecutorchModule, ScalarType ,TokenizerModule, ExecutorchModule} from "react-native-executorch";

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
        //console.log('input sample audio',audioData.slice(0,5));
        const STATIC_INPUT= 480000;
        const paddedAudio = new Float32Array(STATIC_INPUT);
        paddedAudio.set(audioData.slice(0,STATIC_INPUT))
        try{
            const audioTensor:TensorPtr ={
                dataPtr : paddedAudio,
                sizes : [1,STATIC_INPUT],
                scalarType :ScalarType.FLOAT,
            };
            
            console.log('encoder input length',[audioTensor].length);
            const encoderOutput = await encoder.forward([audioTensor]);
            console.log("encoder sucessfull")
            const hiddenStateTensor = encoderOutput[0];
            console.log('encounter hidden sizes',hiddenStateTensor.sizes);
            
            //pad encoder hidden state
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

            
            let currentTokens = [1,1,1];
            let transcript = "";
            const PADDED_TOKENS=178;
            
            for (let i=0;i<PADDED_TOKENS;i++){
                const tokenBuffer = new BigInt64Array(PADDED_TOKENS);
                currentTokens.forEach((id,idx) => {
                    tokenBuffer[idx] = BigInt(id);
                })

                const currentTokenTensor = {
                dataPtr : tokenBuffer,
                sizes : [1,PADDED_TOKENS],
                scalarType :ScalarType.LONG,
                }
                //console.log("first token for decoder",currentTokenTensor.sizes)
                //console.log("hidden state encoder",paddedHiddenTensor.sizes)
                //console.log('decoder input',[currentTokenTensor, paddedHiddenTensor]);
                
                const decoderOutput = await decoder.forward([ currentTokenTensor, hiddenStateTensor ]);
                console.log("Decoder sucessfull");
                const rawBuffer = decoderOutput[0].dataPtr as ArrayBuffer;
                const logits = new Float32Array(rawBuffer);
                const nextTokenId = logits.reduce((maxI, x, currI, arr) => (x > arr[maxI] ? currI : maxI), 0);
                
                if (nextTokenId == 2) break;
                const TokenToWord = await tokenizer?.idToToken(nextTokenId);
                transcript += TokenToWord

                currentTokens.push(nextTokenId);
            }
              

                //const decoderOutput = await decoder.forward([hiddenStateTensor]);
                //console.log('decoder output',decoderOutput)
                return transcript;
        } 
        catch(err){
            console.error("Transcription Error",err);
            throw new Error ("Transcription Error");
        }
    } 

    return {isReady,error, transcribe};


};

