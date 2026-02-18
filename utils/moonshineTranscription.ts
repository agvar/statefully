import { useEffect, useState } from "react";
import { TensorPtr, useExecutorchModule, ScalarType ,TokenizerModule} from "react-native-executorch";


export  async function useMoonshineModel(audioData:Float32Array):Promise<string> {
    try {
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
                await tokenizerInstance.load(require('../assets/models/moonshine_tiny_tokenizer.json'));
                setTokenizer(tokenizerInstance);
                setisTokenizerReady(true);
            } catch (err) {
                console.error("Failed to load tokenizer",err)
            }
        }
            setupTokenizer();

        },[]);

        const isReady = encoder.isReady && decoder.isReady && istokenizerReady;
        const error = encoder.error || decoder.error;

        if(!isReady || error) {
                throw new Error('Model is not loaded yet');
        }

        const audioTensor:TensorPtr ={
            dataPtr : audioData,
            sizes : [1, audioData.length],
            scalarType :ScalarType.FLOAT,
        }
        
        const encoderOutput = await encoder.forward([audioTensor]);
        const hiddenStateTensor = encoderOutput[0];

        let currentToken = [1];
        let transcript = "";

        for (let i=0;i<200;i++){
            const currentTokenTensor = {
            dataPtr : new Float32Array(currentToken),
            sizes : [1, currentToken.length],
            scalarType :ScalarType.INT,
            }

            const decoderOutput = await decoder.forward([hiddenStateTensor,currentTokenTensor]);
            const rawBuffer = decoderOutput[0].dataPtr as ArrayBuffer;
            const logits = new Float32Array(rawBuffer);
            const nextTokenId = logits.reduce((maxI, x, currI, arr) => (x > arr[maxI] ? currI : maxI), 0);
            
            if (nextTokenId == 2) break;
            const TokenToWord = await tokenizer?.idToToken(nextTokenId);
            transcript += TokenToWord

            currentToken.push(nextTokenId);
        }
            return transcript;


    } catch(err){
        console.error(err)
        throw err;
    }



};

