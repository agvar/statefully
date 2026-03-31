import { Intensity,EnergyState } from "@/types";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity ,Text, View, Modal} from "react-native";
import { Colors, Typography, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { EmotionState } from "@/types";
import EmotionPillRow from "./cards/EmotionPillRow";
const INTENSITY_ARRAY :Intensity[] = ['mild','noticeable','strong','intense','overwhelming'];

interface ThoughtTaggingSheetprops {
    visible: boolean;
    transcription: string| null;
    onConfirm:(intensity: Intensity, energyState:EnergyState, emotionAtCapture?:EmotionState) => void;
    onCancel:()=>void;
}

export default function ThoughtTaggingSheet({visible,transcription,onConfirm,onCancel}:ThoughtTaggingSheetprops) {
    const [selectedIntensity,setSelectedIntensity] = useState<Intensity | null>(null);
    const [selectedEmotion, setSelectedEmotion] = useState<EmotionState | null>(null);
    const [selectedEnergyState,setSelectedEnergyState] = useState<EnergyState | null>(null);


    useEffect( ()=>{
        if(!visible) {
            setSelectedIntensity(null);
            setSelectedEnergyState(null);
            setSelectedEmotion(null);
        }
    },[visible]

    )
    return(
        <Modal
        visible={visible}
        transparent= {true}
        animationType="slide"
        onRequestClose={onCancel}
        >
        <TouchableOpacity style={styles.overlay} onPress={onCancel} activeOpacity={1}>
            <TouchableOpacity style={styles.sheet} activeOpacity={1} onPress={() => {}}>
                <Text style={styles.transcriptionLabel}> You said:</Text>
                <Text style={styles.transcriptionText}> {transcription}</Text>

            <EmotionPillRow
                selected={selectedEmotion}
                onSelect={(emotion) => {
                    setSelectedEmotion(emotion);
                }}
                size="sm"
            />

                {/*intensity pills */}
                <Text style={styles.sectionLabel}>
                    how overwhelming is this thought?
                </Text>
                <View style={styles.pillRow}>
                    {( INTENSITY_ARRAY.map( intensity => (
                        <TouchableOpacity
                            key= {intensity}
                            style={[styles.pill ,selectedIntensity === intensity && styles.pillActive ]}
                            onPress = {()=> {setSelectedIntensity(intensity)}}
                        >
                            <Text style={[styles.pillText,selectedIntensity === intensity && styles.pillTextActive]}>
                                {intensity}
                            </Text>
                        </TouchableOpacity>
                    ))
                    )}
                </View>

                {/*Energy state buttons */}
                <View style={styles.EnergyPickerSection}>
                    <Text style={styles.energyPrompt}>How did that feel?</Text>
                    <View style={styles.energyButtonRow}>

                        {/*Flow button */}
                        <TouchableOpacity
                            style={[styles.energyButton, selectedEnergyState === 'flow' && styles.energyFlowButton]}
                            onPress={() => setSelectedEnergyState('flow')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.energyButtonEmoji}>✨</Text>
                            <Text style={styles.energyButtonText}>Flow</Text>
                        </TouchableOpacity>

                        {/*Drain button */}
                        <TouchableOpacity
                            style={[styles.energyButton, selectedEnergyState === 'drain' && styles.energyDrainButton]}
                            onPress={() => setSelectedEnergyState('drain')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.energyButtonEmoji}>😰</Text>
                            <Text style={styles.energyButtonText}>Drain</Text>
                        </TouchableOpacity>

                    </View>

                </View>

                {/*Confirm /cancel  */}
                <View>
                    <TouchableOpacity
                    style={[styles.confirmButton,
                        (selectedIntensity === null || selectedEnergyState === null) && 
                        styles.confirmButtonDisabled
                    ]}
                    onPress={() => onConfirm(selectedIntensity!, selectedEnergyState!, 
                        selectedEmotion ?? undefined)}
                    disabled={selectedIntensity === null || selectedEnergyState === null}
                    >
                        <Text style={styles.confirmButtonText}>Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => onCancel()}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    
                </View>
                        
        </TouchableOpacity>
    </TouchableOpacity>
    </Modal>
    )

};

const styles = StyleSheet.create({
    overlay:{
        flex: 1,
        justifyContent:'flex-end',
        backgroundColor:'rgba(0,0,0,0.5)'
    },
    sheet:{
        backgroundColor: Colors.background.dark,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding : Spacing.lg,
    },
    sectionLabel: {
        fontSize: Typography.size.sm,
        color: Colors.text.dark.secondary,
        marginBottom: Spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
},
    pillRow:{
        flexDirection:'row',
        flexWrap: 'wrap',
        justifyContent:'center',
        marginVertical: Spacing.md

    },
    pill:{
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,      // pill shape
        borderWidth: 1,
        borderColor: Colors.border.dark,
        marginHorizontal: 4,  
        marginBottom: 4                 //gap between pills
    },
    pillActive:{
        backgroundColor: Colors.primary,      // filled when selected
        borderColor: Colors.primary,          // border matches background
    },
    pillText:{
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.medium,
        color: Colors.text.dark.secondary,
    },
    pillTextActive:{
        color: Colors.text.dark.primary,
    },
    transcriptionLabel:{
        fontSize: Typography.size.sm,
        color: Colors.text.dark.secondary,
        marginBottom:Spacing.sm
    },
    transcriptionText: {
        fontSize: Typography.size.lg,
        fontWeight: Typography.weight.medium,
        color: Colors.text.dark.primary,
        fontStyle: 'italic',
        marginBottom: Spacing.lg,
},
    EnergyPickerSection: {
        alignItems: 'center',
        color: Colors.text.dark.secondary,
        marginBottom: Spacing.xs,
    },
    energyPrompt: {
            fontSize: Typography.size.base,
            color: Colors.text.dark.secondary,
            marginBottom: Spacing.md,
        },
    energyButtonRow: {
        flexDirection: 'row',
        gap: Spacing.md, // Space between buttons
        width: '100%',
    },
    energyButton: {
        flex: 1, // Equal width for both buttons
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        
        // Subtle shadow for depth
        ...Shadows.sm,
    },
    energyFlowButton: {
        backgroundColor: Colors.flow,
    },
    energyDrainButton: {
        backgroundColor: Colors.drain,
    },
    energyButtonEmoji: {
        fontSize: 32,
        marginBottom: Spacing.xs,
    },
    energyButtonText: {
        fontSize: Typography.size.base,
        fontWeight: Typography.weight.semibold,
        color: Colors.text.dark.primary,
    },
    confirmButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
},
confirmButtonDisabled: {
    backgroundColor: Colors.text.dark.tertiary,   // dim when not ready
},
confirmButtonText: {
    color: Colors.text.dark.primary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
},
cancelButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginTop: Spacing.sm,
},
cancelButtonText: {
    color: Colors.text.dark.secondary,
    fontSize: Typography.size.sm,
},
}
    
)