import { Modal, TouchableOpacity,StyleSheet,Text,TextInput} from "react-native";
import { useState } from "react";
import { Colors, Typography, Spacing, BorderRadius} from "@/constants/theme";

interface TextThoughtInputProps{
    visible: boolean;
    onSubmit: (text: string) => void;
    onCancel :() => void;
}

export default function TypeThoughtSheet({visible,onSubmit,onCancel}:TextThoughtInputProps) {
    const [text,setText] = useState<string>('');

    return(
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
    <TouchableOpacity style={styles.overlay} onPress={onCancel} activeOpacity={1}>
        <TouchableOpacity style={styles.sheet} activeOpacity={1} onPress={() => {}}>
            <Text style={styles.label}>What's on your mind?</Text>
            <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder="Type your thought..."
                placeholderTextColor={Colors.text.dark.secondary}
                multiline
                autoFocus
                maxLength={300}
            />
            <TouchableOpacity
                style={[styles.submitButton, !text.trim() && styles.submitDisabled]}
                onPress={() => { if (text.trim()) { 
                    onSubmit(text.trim()); setText(''); 
                } }}
                disabled={!text.trim()}
            >
                <Text style={styles.submitText}>Continue →</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    </TouchableOpacity>
</Modal>
    )
}

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
    label: {
        fontSize: Typography.size.sm,
        color: Colors.text.dark.secondary,
        marginBottom: Spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input:{
        color: Colors.text.dark.primary,
        fontSize: Typography.size.base,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        minHeight: 80,              // room for multiline
        textAlignVertical: 'top',   // Android: text starts at top not center
        marginBottom: Spacing.md,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        marginTop: Spacing.md,
    },
    submitDisabled: {
        backgroundColor: Colors.text.dark.tertiary,   // dim when not ready
    },
    submitText: {
        color: Colors.text.dark.primary,
        fontSize: Typography.size.base,
        fontWeight: Typography.weight.semibold,
    },
}
    
)