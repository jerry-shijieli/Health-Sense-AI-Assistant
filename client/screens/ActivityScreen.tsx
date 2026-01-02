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
import { Feather } from "@expo/vector-icons";

import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { ThemedText } from "@/components/ThemedText";
import { healthStorage, DailyHealthData } from "@/lib/health-storage";

function DaySelector({
  days,
  selectedIndex,
  onSelect,
}: {
  days: DailyHealthData[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  const { theme } = useTheme();

  const formatDay = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split("T")[0]) return "Today";
    if (dateStr === yesterday.toISOString().split("T")[0]) return "Yesterday";
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.getDate().toString();
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.daysContainer}
    >
      {days.map((day, index) => {
        const isSelected = index === selectedIndex;
        return (
          <Pressable
            key={day.date}
            onPress={() => onSelect(index)}
            style={[
              styles.dayItem,
              {
                backgroundColor: isSelected
                  ? theme.primary
                  : theme.backgroundDefault,
              },
            ]}
          >
            <ThemedText
              type="small"
              style={{
                color: isSelected ? "#FFFFFF" : theme.textSecondary,
                fontWeight: "500",
              }}
            >
              {formatDay(day.date)}
            </ThemedText>
            <ThemedText
              type="h4"
              style={{ color: isSelected ? "#FFFFFF" : theme.text }}
            >
              {formatDate(day.date)}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function ActivityItem({
  icon,
  iconColor,
  title,
  value,
  subtitle,
}: {
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  title: string;
  value: string;
  subtitle: string;
}) {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.activityItem, { backgroundColor: theme.backgroundDefault }]}
    >
      <View style={[styles.activityIcon, { backgroundColor: `${iconColor}15` }]}>
        <Feather name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.activityContent}>
        <ThemedText type="body" style={{ fontWeight: "600" }}>
          {title}
        </ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {subtitle}
        </ThemedText>
      </View>
      <ThemedText type="body" style={{ fontWeight: "600" }}>
        {value}
      </ThemedText>
    </View>
  );
}

function HourlyChart({ data }: { data: DailyHealthData | null }) {
  const { theme } = useTheme();
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const maxSteps = Math.max(
    ...hours.map(() => Math.floor(Math.random() * 1000) + 100),
    1000
  );

  const getBarHeight = () => {
    return Math.floor(Math.random() * 60) + 10;
  };

  return (
    <View
      style={[styles.chartContainer, { backgroundColor: theme.backgroundDefault }]}
    >
      <ThemedText type="body" style={[styles.chartTitle, { fontWeight: "600" }]}>
        Steps by Hour
      </ThemedText>
      <View style={styles.chart}>
        {hours.filter((_, i) => i % 2 === 0).map((hour) => (
          <View key={hour} style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                {
                  height: getBarHeight(),
                  backgroundColor: theme.primary,
                },
              ]}
            />
            <ThemedText
              type="small"
              style={{ color: theme.textSecondary, fontSize: 10 }}
            >
              {hour}
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();

  const [refreshing, setRefreshing] = useState(false);
  const [weekData, setWeekData] = useState<DailyHealthData[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(6);

  const loadData = useCallback(async () => {
    let data = await healthStorage.getHealthData();
    if (data.length < 7) {
      data = healthStorage.generateWeekData();
      await healthStorage.saveHealthData(data);
    }
    setWeekData(data.slice(-7));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const newData = healthStorage.generateWeekData();
    await healthStorage.saveHealthData(newData);
    setWeekData(newData);
    setRefreshing(false);
  }, []);

  const selectedDay = weekData[selectedDayIndex];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing["3xl"],
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ThemedText type="h2" style={styles.title}>
        Activity
      </ThemedText>

      <DaySelector
        days={weekData}
        selectedIndex={selectedDayIndex}
        onSelect={setSelectedDayIndex}
      />

      <View style={styles.activitiesSection}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Daily Summary
        </ThemedText>

        <ActivityItem
          icon="navigation"
          iconColor={theme.primary}
          title="Walking"
          value={`${selectedDay?.steps.toLocaleString() || 0} steps`}
          subtitle={`${selectedDay?.distance.toFixed(1) || 0} km`}
        />

        <ActivityItem
          icon="zap"
          iconColor={theme.success}
          title="Active Time"
          value={`${selectedDay?.activeMinutes || 0} min`}
          subtitle="Exercise & movement"
        />

        <ActivityItem
          icon="heart"
          iconColor="#FF3B30"
          title="Heart Rate"
          value={`${selectedDay?.heartRate.avg || 0} bpm`}
          subtitle={`Range: ${selectedDay?.heartRate.min || 0}-${selectedDay?.heartRate.max || 0}`}
        />

        <ActivityItem
          icon="moon"
          iconColor="#5856D6"
          title="Sleep"
          value={`${selectedDay?.sleepHours.toFixed(1) || 0} hrs`}
          subtitle="Last night"
        />

        <ActivityItem
          icon="flame"
          iconColor={theme.warning}
          title="Calories"
          value={`${selectedDay?.calories.toLocaleString() || 0}`}
          subtitle="kcal burned"
        />
      </View>

      <View style={{ paddingHorizontal: Spacing.lg }}>
        <HourlyChart data={selectedDay} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  daysContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  dayItem: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    minWidth: 70,
  },
  activitiesSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  activityContent: {
    flex: 1,
    gap: 2,
  },
  chartContainer: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  chartTitle: {
    marginBottom: Spacing.lg,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 80,
  },
  barContainer: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  bar: {
    width: 12,
    borderRadius: 6,
  },
});
