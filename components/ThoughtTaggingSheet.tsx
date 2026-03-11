import { Intensity,EnergyState } from "@/types";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity ,Text, View, Modal} from "react-native";
import { Colors, Typography, Spacing, BorderRadius, Shadows } from "@/constants/theme";

interface ThoughtTaggingSheetprops {
    visible: boolean;
    transcription: string| null;
    onConfirm:(intensity: Intensity, energyState:EnergyState) => void;
    onCancel:()=>void;
}

export default function ThoughtTaggingSheet({visible,transcription,onConfirm,onCancel}:ThoughtTaggingSheetprops) {
    const [selectedIntensity,setSelectedIntensity] = useState<Intensity | null>(null);
    const [selectedEnergyState,setSelectedEnergyState] = useState<EnergyState | null>(null);
    const INTENSITY_ARRAY :Intensity[] = ['mild','noticeable','strong','intense','overwhelming'];

    useEffect( ()=>{
        if(!visible) {
            setSelectedIntensity(null);
            setSelectedEnergyState(null);
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
                <View style= {styles.overlay}>
                    <View style={styles.sheet}>
                        <Text style={styles.transcriptionLabel}> You said:</Text>
                        <Text style={styles.transcriptionLabel}> {transcription}</Text>

                        {/*intensity pills */}
                        {( INTENSITY_ARRAY.map( intensity => (
                            <TouchableOpacity
                                key= {intensity}
                                style={[styles.pill ,selectedIntensity === intensity && styles.pillActive ]}
                                onPress = {()=> {setSelectedIntensity(intensity)}}
                            >
                                <Text>{intensity}</Text>
                            </TouchableOpacity>
                        ))
                        )}

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
                            <View>
                                <TouchableOpacity
                                onPress={() => onConfirm(selectedIntensity!, selectedEnergyState!)}
                                disabled={selectedIntensity === null || selectedEnergyState === null}
                                >
                                    <Text>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity
                                onPress={() => onCancel()}
                                >
                                    <Text>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                            
                        </View>
                        
                    </View>

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
    pill:{},
    pillActive:{},
    EnergyPickerSection: {
        alignItems: 'center',
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
}
    
)