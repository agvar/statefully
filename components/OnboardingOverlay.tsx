import { useState } from "react"
import { Modal } from "react-native"

export  function OnBoardingOverlay(){ 
    const [step, setStep] = useState(0);
    
         return(
                <Modal
                    transparent={true}
                    animationType='fade'

                >

                </Modal>

    )
}