import { EmotionState } from "@/types";
import { EMOTION_EMOJI } from "@/types";
import { View, Text,StyleSheet, TouchableOpacity} from "react-native";
import { Colors ,Typography, Spacing, BorderRadius} from "@/constants/theme";

interface emotionPillRowProps {
    selected: EmotionState | null ;
    onSelect : (emotion:EmotionState) =>void;
    size?: 'sm' | 'md' ;
}

export default function EmotionPillRow({selected,onSelect,size='md'}:emotionPillRowProps) {
    const isSmall = size === 'sm';
    return(
                            <View style={styles.pillRow}>
                                {( Object.entries(EMOTION_EMOJI) as [EmotionState,string][]).
                                    map( ([emotion, emoji ])=> (
                                    <TouchableOpacity
                                        key= {emotion}
                                        style={[styles.pill ,
                                            isSmall && styles.pillSm,
                                            selected === emotion 
                                        && { backgroundColor: Colors.emotionGlow[emotion], 
                                             borderColor: Colors.emotion[emotion],
                                             shadowColor: Colors.emotion[emotion], // glow color
                                             shadowOpacity: 0.6,                                             // glow intensity
                                             shadowRadius: 8,                                                // glow spread
                                             shadowOffset: { width: 0, height: 0 },                         // centered glow
                                             elevation: 6,                                                  //Android
                                               }
                                         ]}
                                        onPress = {()=> onSelect(emotion) }
                                    >
                                        <Text style={[
                                            styles.pillText,
                                            isSmall && styles.pillTextSm,
                                            selected === emotion  && styles.pillTextActive]}>
                                            {emoji}{emotion}
                                        </Text>
                                    </TouchableOpacity>
                                ))
                                }
                            </View>
    );
}
    const styles = StyleSheet.create({
    pillRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginVertical: Spacing.sm,
    },
    pill: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        borderColor: Colors.border.dark,
        marginHorizontal: 4,
        marginBottom: 4,
    },
    pillSm: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
    },
    pillText: {
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.medium,
        color: Colors.text.dark.secondary,
    },
    pillTextSm: {
        fontSize: Typography.size.xs,
    },
    pillTextActive: {
        color: Colors.text.dark.primary,
    },
});
