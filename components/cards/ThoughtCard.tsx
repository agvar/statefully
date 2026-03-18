import { Activity } from "@/types";
import { StyleSheet,View,TouchableOpacity ,Text} from "react-native";
import { Colors, Spacing, BorderRadius, Typography , Shadows} from "@/constants/theme";

interface ThoughtCardProps {
    thought: Activity;
    onAgain?:(id: string)=> void
};

export default function ThoughtCard({thought,onAgain}:ThoughtCardProps) {
     const getEnergyDisplay = () =>{
            if (thought.energyState === 'flow'){
                return { emoji:'✨', text: 'Flow', color:Colors.flow }
            }
            return { emoji:'😰', text: 'Drain', color:Colors.drain }
        };
    const energy = getEnergyDisplay();

    
        return(
            <View style={[styles.container, { backgroundColor: energy.color + '0F', borderLeftColor: energy.color }]}>
                {/* Top Row: Name and Duration*/}
                <View style={styles.topRow}>
                    <Text style={styles.activityName} numberOfLines={1}>
                        💭 {thought.name}
                    </Text>
                    <View style={[styles.badge,{ backgroundColor: energy.color + '0F'}]}>
                        <Text style={styles.badgeEmoji}>{energy.emoji}</Text>
                        <Text style={[styles.badgeText, {color: energy.color}]}>
                            {energy.text}
                        </Text>
                    </View>

                </View>

                {/* Bottom Row: Intensity and recurrence */}
                <View style={styles.bottomRow}>
                    <View style={styles.intensityBadge}>
                        <Text style={styles.intensityBadgeText}>
                            {thought.intensity}
                        </Text>
                    </View>
                    {
                        (thought.recurrenceCount?? 0) > 0 && (
                        <View style= {styles.recurrenceRow}>
                            <Text style={styles.recurrenceText}>↩ ×{thought.recurrenceCount}</Text>
                        <TouchableOpacity
                        style={styles.recurrenceButton}
                        onPress = {() => onAgain?.(thought.id)}
                        > 
                        <Text style={styles.againText}>↩ Again</Text>
                        </TouchableOpacity>
                        </View>
                        )
                    }
                </View>
            </View>
        )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background.cardDark,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        marginHorizontal: Spacing.md,
        marginTop: Spacing.sm,
        ...Shadows.sm,
        borderLeftWidth: 3,
        overflow: 'hidden',       // clips left border inside border radius
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
        
    },
    activityName: {
        flex: 1,
        fontSize: Typography.size.base,
        fontWeight: Typography.weight.medium,
        color: Colors.text.dark.primary,
        marginRight: Spacing.sm,
        fontStyle:'italic'
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between'
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.sm,
        borderRadius: BorderRadius.sm,
    },
    badgeEmoji: {
        fontSize: Typography.size.sm,
        marginRight: 4,
    },
    badgeText: {
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.medium,
    },
    intensityBadge:{
        borderWidth:1,
        borderColor:Colors.border.dark,
        borderRadius:BorderRadius.full,
        padding:Spacing.sm
    },
    intensityBadgeText:{
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.medium,
        color: Colors.text.dark.secondary
    },
    recurrenceRow:{
        flexDirection:'row',
        justifyContent:'space-between',
        gap:Spacing.xs
    },
    recurrenceText:{
        color:Colors.warning
    },
    recurrenceButton:{
        paddingHorizontal: Spacing.sm,
        paddingVertical:Spacing.xs
    },
    againText:{
        color:Colors.warning
    }
});