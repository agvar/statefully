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
            const mod =  new ExecutorchModule();
            await mod.load(require('../assets/models/moonshine_tiny_xnnpack_decoder.pte'));
            try {
                for (let i=0; i<5;i++){
                    const shape = await mod.getInputShape('forward',i);
                    console.log(`shape for ${i} input is ${shape}`)
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
        try{
            const audioTensor:TensorPtr ={
                dataPtr : audioData,
                sizes : [1,audioData.length],
                scalarType :ScalarType.FLOAT,
            };
            
            console.log('encoder input length',[audioTensor].length);
            const encoderOutput = await encoder.forward([audioTensor]);
            const hiddenStateTensor = encoderOutput[0];
            console.log('encounter hidden sizes',hiddenStateTensor.sizes);
            
            
            let currentToken = [1];
            let transcript = "";

            
            for (let i=0;i<200;i++){
                const tokenArray = new Int32Array(currentToken);
                const currentTokenTensor = {
                dataPtr : tokenArray,
                sizes : [1, currentToken.length],
                scalarType :ScalarType.LONG,
                }
                console.log("first token for decoder",currentTokenTensor.sizes)
                console.log("hidden state encoder",hiddenStateTensor.sizes)
                console.log('decoder input',[currentTokenTensor, hiddenStateTensor]);
                
                const decoderOutput = await decoder.forward([hiddenStateTensor, currentTokenTensor]);
                const rawBuffer = decoderOutput[0].dataPtr as ArrayBuffer;
                const logits = new Float32Array(rawBuffer);
                const nextTokenId = logits.reduce((maxI, x, currI, arr) => (x > arr[maxI] ? currI : maxI), 0);
                
                if (nextTokenId == 2) break;
                const TokenToWord = await tokenizer?.idToToken(nextTokenId);
                transcript += TokenToWord

                currentToken.push(nextTokenId);
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

