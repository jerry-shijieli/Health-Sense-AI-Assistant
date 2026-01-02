import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface InsightCardProps {
  category: "sleep" | "exercise" | "nutrition" | "general";
  title: string;
  description: string;
  priority?: "high" | "medium" | "low";
  timestamp?: string;
  onPress?: () => void;
}

const categoryIcons: Record<string, keyof typeof Feather.glyphMap> = {
  sleep: "moon",
  exercise: "activity",
  nutrition: "coffee",
  general: "info",
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function InsightCard({
  category,
  title,
  description,
  priority = "medium",
  timestamp,
  onPress,
}: InsightCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const getPriorityColor = () => {
    switch (priority) {
      case "high":
        return theme.danger;
      case "medium":
        return theme.warning;
      case "low":
        return theme.success;
      default:
        return theme.primary;
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case "sleep":
        return "#5856D6";
      case "exercise":
        return theme.success;
      case "nutrition":
        return theme.warning;
      default:
        return theme.primary;
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const categoryColor = getCategoryColor();

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
        <View style={[styles.iconContainer, { backgroundColor: `${categoryColor}15` }]}>
          <Feather
            name={categoryIcons[category]}
            size={18}
            color={categoryColor}
          />
        </View>
        <View style={styles.headerText}>
          <ThemedText type="small" style={{ color: categoryColor, fontWeight: "600" }}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </ThemedText>
          {timestamp ? (
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {timestamp}
            </ThemedText>
          ) : null}
        </View>
        <View
          style={[
            styles.priorityDot,
            { backgroundColor: getPriorityColor() },
          ]}
        />
      </View>

      <ThemedText type="body" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText type="small" style={{ color: theme.textSecondary }}>
        {description}
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontWeight: "600",
  },
});
