import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { ThemedText } from "@/components/ThemedText";
import { MetricCard } from "@/components/MetricCard";
import { ProgressRing } from "@/components/ProgressRing";
import {
  healthStorage,
  DailyHealthData,
  HealthGoals,
  AnalysisSettings,
} from "@/lib/health-storage";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [refreshing, setRefreshing] = useState(false);
  const [healthData, setHealthData] = useState<DailyHealthData | null>(null);
  const [goals, setGoals] = useState<HealthGoals | null>(null);
  const [settings, setSettings] = useState<AnalysisSettings | null>(null);

  const loadData = useCallback(async () => {
    const [data, goalsData, settingsData] = await Promise.all([
      healthStorage.getTodayData(),
      healthStorage.getGoals(),
      healthStorage.getSettings(),
    ]);

    if (!data) {
      const mockData = healthStorage.generateMockHealthData();
      await healthStorage.updateTodayData(mockData);
      setHealthData(mockData);
    } else {
      setHealthData(data);
    }
    setGoals(goalsData);
    setSettings(settingsData);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const mockData = healthStorage.generateMockHealthData();
    await healthStorage.updateTodayData(mockData);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const getLastAnalyzedText = () => {
    if (!settings?.lastAnalysisTime) return "Not analyzed yet";
    const date = new Date(settings.lastAnalysisTime);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return "Analyzed just now";
    if (diffHours < 24) return `Analyzed ${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `Analyzed ${diffDays}d ago`;
  };

  const stepsProgress = healthData && goals ? healthData.steps / goals.steps : 0;
  const activeProgress =
    healthData && goals ? healthData.activeMinutes / goals.activeMinutes : 0;
  const sleepProgress =
    healthData && goals ? healthData.sleepHours / goals.sleepHours : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing["3xl"],
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <ThemedText type="h2">{getGreeting()}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {formatDate()}
          </ThemedText>
        </View>
      </View>

      <View
        style={[styles.progressSection, { backgroundColor: theme.backgroundDefault }]}
      >
        <ThemedText type="h4" style={styles.sectionTitle}>
          Daily Progress
        </ThemedText>
        <View style={styles.ringsContainer}>
          <ProgressRing
            progress={stepsProgress}
            color={theme.primary}
            label="Steps"
            value={healthData?.steps.toLocaleString() || "0"}
            size={100}
          />
          <ProgressRing
            progress={activeProgress}
            color={theme.success}
            label="Active"
            value={healthData?.activeMinutes || 0}
            unit="min"
            size={100}
          />
          <ProgressRing
            progress={sleepProgress}
            color="#5856D6"
            label="Sleep"
            value={healthData?.sleepHours.toFixed(1) || "0"}
            unit="hrs"
            size={100}
          />
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <MetricCard
          icon="heart"
          iconColor="#FF3B30"
          title="Heart Rate"
          value={healthData?.heartRate.avg || 0}
          unit="bpm"
          subtitle={`${healthData?.heartRate.min || 0}-${healthData?.heartRate.max || 0} range`}
        />
        <MetricCard
          icon="map-pin"
          iconColor={theme.primary}
          title="Distance"
          value={healthData?.distance.toFixed(1) || "0"}
          unit="km"
        />
      </View>

      <View style={styles.metricsGrid}>
        <MetricCard
          icon="zap"
          iconColor={theme.warning}
          title="Calories"
          value={healthData?.calories.toLocaleString() || "0"}
          unit="kcal"
        />
        <MetricCard
          icon="moon"
          iconColor="#5856D6"
          title="Sleep"
          value={healthData?.sleepHours.toFixed(1) || "0"}
          unit="hours"
        />
      </View>

      <Pressable
        onPress={() => navigation.navigate("AnalyzeModal")}
        style={({ pressed }) => [
          styles.analyzeCard,
          { backgroundColor: theme.primary, opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <View style={styles.analyzeContent}>
          <View style={styles.analyzeIcon}>
            <Feather name="cpu" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.analyzeText}>
            <ThemedText type="body" style={{ color: "#FFFFFF", fontWeight: "600" }}>
              Run AI Analysis
            </ThemedText>
            <ThemedText type="small" style={{ color: "rgba(255,255,255,0.8)" }}>
              {getLastAnalyzedText()}
            </ThemedText>
          </View>
        </View>
        <Feather name="chevron-right" size={24} color="#FFFFFF" />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  progressSection: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  ringsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  metricsGrid: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  analyzeCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.md,
  },
  analyzeContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  analyzeIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  analyzeText: {
    gap: 2,
  },
});
