import { Colors, Spacing, Typography } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';


interface MetricCircleProps {
    percentage: number;
    label: string;
    value: string;
    color: string;
}

export default function MetricCircle({percentage, label, value,color}: MetricCircleProps){
    return(
        <View style={styles.container}>
            <AnimatedCircularProgress
                size={120}
                width={12}
                fill={percentage}
                tintColor={color}
                backgroundColor={Colors.border.light}
                rotation={0}
                duration={1000}
            >
                {()=>(
                    <View style={styles.content}>
                        <Text style={styles.value}>{value}</Text>
                    </View>
                )
                }
            </AnimatedCircularProgress>
            <Text style={styles.label}>{label}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.light.primary,
  },
  label: {
    fontSize: Typography.size.sm,
    color: Colors.text.light.secondary,
    textAlign: 'center',
  },
});