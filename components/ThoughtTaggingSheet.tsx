import { Intensity,EnergyState } from "@/types";

interface ThoughtTaggingSheetprops {
    visible: boolean;
    transcrption: string| null;
    onConfirm:(intensity: Intensity, energyState:EnergyState) => void;
    onCancel:()=>void;
}