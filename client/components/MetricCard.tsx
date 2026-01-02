import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Pressable } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface MetricCardProps {
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  title: string;
  value: string | number;
  unit: string;
  subtitle?: string;
  progress?: number;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MetricCard({
  icon,
  iconColor,
  title,
  value,
  unit,
  subtitle,
  progress,
  onPress,
}: MetricCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 150 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!onPress}
      style={[
        styles.card,
        { backgroundColor: theme.backgroundDefault },
        animatedStyle,
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
          <Feather name={icon} size={20} color={iconColor} />
        </View>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {title}
        </ThemedText>
      </View>

      <View style={styles.valueContainer}>
        <ThemedText type="h2" style={styles.value}>
          {value}
        </ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {unit}
        </ThemedText>
      </View>

      {progress !== undefined ? (
        <View style={styles.progressContainer}>
          <View
            style={[styles.progressTrack, { backgroundColor: theme.backgroundSecondary }]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: iconColor,
                  width: `${Math.min(progress * 100, 100)}%`,
                },
              ]}
            />
          </View>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {Math.round(progress * 100)}%
          </ThemedText>
        </View>
      ) : null}

      {subtitle ? (
        <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: Spacing.xs }}>
          {subtitle}
        </ThemedText>
      ) : null}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    flex: 1,
    minWidth: 150,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.xs,
  },
  value: {
    fontWeight: "700",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
});
