import React from "react";
import { View, StyleSheet, Switch, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface SettingsRowProps {
  icon?: keyof typeof Feather.glyphMap;
  iconColor?: string;
  title: string;
  subtitle?: string;
  value?: string;
  showArrow?: boolean;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
  danger?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SettingsRow({
  icon,
  iconColor,
  title,
  subtitle,
  value,
  showArrow = true,
  isSwitch = false,
  switchValue,
  onSwitchChange,
  onPress,
  danger = false,
}: SettingsRowProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress && !isSwitch) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const textColor = danger ? theme.danger : theme.text;
  const actualIconColor = danger ? theme.danger : iconColor || theme.primary;

  return (
    <AnimatedPressable
      onPress={isSwitch ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isSwitch || !onPress}
      style={[
        styles.row,
        { backgroundColor: theme.backgroundDefault },
        animatedStyle,
      ]}
    >
      {icon ? (
        <View style={[styles.iconContainer, { backgroundColor: `${actualIconColor}15` }]}>
          <Feather name={icon} size={20} color={actualIconColor} />
        </View>
      ) : null}

      <View style={styles.content}>
        <ThemedText type="body" style={{ color: textColor }}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>

      {value ? (
        <ThemedText type="small" style={{ color: theme.textSecondary, marginRight: Spacing.sm }}>
          {value}
        </ThemedText>
      ) : null}

      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: theme.backgroundSecondary, true: theme.primary }}
        />
      ) : showArrow && onPress ? (
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      ) : null}
    </AnimatedPressable>
  );
}

export function SettingsSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.section}>
      {title ? (
        <ThemedText
          type="small"
          style={[styles.sectionTitle, { color: theme.textSecondary }]}
        >
          {title}
        </ThemedText>
      ) : null}
      <View style={[styles.sectionContent, { backgroundColor: theme.backgroundDefault }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
    marginLeft: Spacing.lg,
    textTransform: "uppercase",
    fontWeight: "600",
    fontSize: 12,
  },
  sectionContent: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
});
