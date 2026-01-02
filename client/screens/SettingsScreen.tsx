import React, { useEffect, useState, useCallback } from "react";
import { View, ScrollView, StyleSheet, Alert, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { ThemedText } from "@/components/ThemedText";
import { SettingsRow, SettingsSection } from "@/components/SettingsRow";
import { healthStorage, AnalysisSettings, HealthGoals } from "@/lib/health-storage";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();

  const [settings, setSettings] = useState<AnalysisSettings | null>(null);
  const [goals, setGoals] = useState<HealthGoals | null>(null);

  const loadData = useCallback(async () => {
    const [settingsData, goalsData] = await Promise.all([
      healthStorage.getSettings(),
      healthStorage.getGoals(),
    ]);
    setSettings(settingsData);
    setGoals(goalsData);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateSettings = async (update: Partial<AnalysisSettings>) => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    const newSettings = { ...settings, ...update } as AnalysisSettings;
    setSettings(newSettings);
    await healthStorage.saveSettings(update);
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will delete all your health data and analysis history. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Data",
          style: "destructive",
          onPress: async () => {
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
            await healthStorage.clearAllData();
            await loadData();
            Alert.alert("Success", "All data has been cleared.");
          },
        },
      ]
    );
  };

  const toggleProvider = async () => {
    const newProvider = settings?.provider === "openai" ? "gemini" : "openai";
    await updateSettings({ provider: newProvider });
  };

  const toggleFrequency = async () => {
    const newFrequency = settings?.frequency === "daily" ? "hourly" : "daily";
    await updateSettings({ frequency: newFrequency });
  };

  const toggleDataScope = async () => {
    const scopes: ("today" | "week" | "month")[] = ["today", "week", "month"];
    const currentIndex = scopes.indexOf(settings?.dataScope || "today");
    const newScope = scopes[(currentIndex + 1) % scopes.length];
    await updateSettings({ dataScope: newScope });
  };

  const getDataScopeLabel = () => {
    switch (settings?.dataScope) {
      case "week":
        return "Last 7 Days";
      case "month":
        return "Last 30 Days";
      default:
        return "Today Only";
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing["3xl"],
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <ThemedText type="h2" style={styles.title}>
        Settings
      </ThemedText>

      <SettingsSection title="AI Analysis">
        <SettingsRow
          icon="cpu"
          iconColor={theme.primary}
          title="AI Provider"
          value={settings?.provider === "openai" ? "ChatGPT" : "Gemini"}
          onPress={toggleProvider}
        />
        <View style={[styles.divider, { backgroundColor: theme.backgroundSecondary }]} />
        <SettingsRow
          icon="clock"
          iconColor={theme.warning}
          title="Analysis Frequency"
          value={settings?.frequency === "daily" ? "Daily" : "Hourly"}
          onPress={toggleFrequency}
        />
        <View style={[styles.divider, { backgroundColor: theme.backgroundSecondary }]} />
        <SettingsRow
          icon="calendar"
          iconColor="#5856D6"
          title="Data Scope"
          value={getDataScopeLabel()}
          onPress={toggleDataScope}
        />
      </SettingsSection>

      <SettingsSection title="Health Goals">
        <SettingsRow
          icon="navigation"
          iconColor={theme.primary}
          title="Daily Steps Goal"
          value={goals?.steps.toLocaleString()}
          showArrow={false}
        />
        <View style={[styles.divider, { backgroundColor: theme.backgroundSecondary }]} />
        <SettingsRow
          icon="zap"
          iconColor={theme.success}
          title="Active Minutes Goal"
          value={`${goals?.activeMinutes} min`}
          showArrow={false}
        />
        <View style={[styles.divider, { backgroundColor: theme.backgroundSecondary }]} />
        <SettingsRow
          icon="moon"
          iconColor="#5856D6"
          title="Sleep Goal"
          value={`${goals?.sleepHours} hours`}
          showArrow={false}
        />
      </SettingsSection>

      <SettingsSection title="Notifications">
        <SettingsRow
          icon="bell"
          iconColor={theme.warning}
          title="Analysis Alerts"
          subtitle="Get notified when analysis completes"
          isSwitch
          switchValue={settings?.notificationsEnabled}
          onSwitchChange={(value) =>
            updateSettings({ notificationsEnabled: value })
          }
        />
      </SettingsSection>

      <SettingsSection title="Data Sync">
        <SettingsRow
          icon="smartphone"
          iconColor={theme.primary}
          title="Phone"
          subtitle="Connected"
          value="Active"
          showArrow={false}
        />
        <View style={[styles.divider, { backgroundColor: theme.backgroundSecondary }]} />
        <SettingsRow
          icon="watch"
          iconColor={theme.success}
          title="Watch"
          subtitle="Simulated data"
          value="Demo"
          showArrow={false}
        />
      </SettingsSection>

      <SettingsSection title="Data">
        <SettingsRow
          icon="trash-2"
          title="Clear All Data"
          subtitle="Delete health data and history"
          onPress={handleClearData}
          danger
        />
      </SettingsSection>

      <SettingsSection title="About">
        <SettingsRow
          icon="info"
          iconColor={theme.textSecondary}
          title="Version"
          value="1.0.0"
          showArrow={false}
        />
        <View style={[styles.divider, { backgroundColor: theme.backgroundSecondary }]} />
        <SettingsRow
          icon="shield"
          iconColor={theme.textSecondary}
          title="Privacy Policy"
          onPress={() => {}}
        />
        <View style={[styles.divider, { backgroundColor: theme.backgroundSecondary }]} />
        <SettingsRow
          icon="file-text"
          iconColor={theme.textSecondary}
          title="Terms of Service"
          onPress={() => {}}
        />
      </SettingsSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginBottom: Spacing.xl,
  },
  divider: {
    height: 1,
    marginLeft: 60,
  },
});
