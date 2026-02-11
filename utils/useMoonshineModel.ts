import { useEffect, useState } from "react";
import { useExecutorchModule } from "react-native-executorch";

export default function useMoonshineModel() {
    const [isReady, setIsReady] = useState(false);
    const [progress, setProgress] =useState(0);

    useEffect(()=>{
        loadModels();
    },[]);

    const loadModels=()=>{
        const encoder = useExecutorchModule({
            modelSource: require('./assets/models/moonshine_tiny_xnnpack_encoder.pte')
        });

        const decoder = useExecutorchModule({
            modelSource: require('./assets/models/moonshine_tiny_xnnpack_decoder.pte')
        });

        const tokenizer = loadTokenizerModule(
            require('./assets/models/moonshine_tiny_tokenizer.json')
        );
        
    }
}