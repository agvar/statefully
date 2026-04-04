import { Modal, TouchableOpacity,StyleSheet,Text,View,TextInput } from "react-native";
import { useState } from "react";
import { Colors } from "@/constants/theme";

interface TextThoughtInputProps{
    visible: boolean;
    onSubmit: (text: string) => void;
    onCancel :() => void;
}

export default function({visible,onSubmit,onCancel}:TextThoughtInputProps) {
    const [text,setText] = useState(null);

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
                onPress={() => { if (text.trim()) { onSubmit(text.trim()); setText(''); } }}
                disabled={!text.trim()}
            >
                <Text style={styles.submitText}>Continue →</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    </TouchableOpacity>
</Modal>
    )
}