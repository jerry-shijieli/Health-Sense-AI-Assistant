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
import { InsightCard } from "@/components/InsightCard";
import { healthStorage, AnalysisResult } from "@/lib/health-storage";

function EmptyState() {
  const { theme } = useTheme();

  return (
    <View style={styles.emptyState}>
      <View
        style={[
          styles.emptyIcon,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <Feather name="cpu" size={48} color={theme.textSecondary} />
      </View>
      <ThemedText type="h4" style={{ textAlign: "center" }}>
        No Analysis Yet
      </ThemedText>
      <ThemedText
        type="body"
        style={{ color: theme.textSecondary, textAlign: "center" }}
      >
        Tap the Analyze button to get AI-powered health insights and personalized recommendations.
      </ThemedText>
    </View>
  );
}

function HealthScore({ score }: { score: number }) {
  const { theme } = useTheme();

  const getScoreColor = () => {
    if (score >= 80) return theme.success;
    if (score >= 60) return theme.warning;
    return theme.danger;
  };

  const getScoreLabel = () => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Attention";
  };

  return (
    <View
      style={[styles.scoreCard, { backgroundColor: theme.backgroundDefault }]}
    >
      <View style={styles.scoreHeader}>
        <ThemedText type="body" style={{ fontWeight: "600" }}>
          Health Score
        </ThemedText>
        <View
          style={[styles.scoreBadge, { backgroundColor: `${getScoreColor()}20` }]}
        >
          <ThemedText type="small" style={{ color: getScoreColor(), fontWeight: "600" }}>
            {getScoreLabel()}
          </ThemedText>
        </View>
      </View>
      <View style={styles.scoreDisplay}>
        <ThemedText type="h1" style={{ color: getScoreColor() }}>
          {score}
        </ThemedText>
        <ThemedText type="body" style={{ color: theme.textSecondary }}>
          /100
        </ThemedText>
      </View>
      <View style={styles.scoreBar}>
        <View
          style={[
            styles.scoreProgress,
            { width: `${score}%`, backgroundColor: getScoreColor() },
          ]}
        />
      </View>
    </View>
  );
}

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();

  const [refreshing, setRefreshing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const data = await healthStorage.getAnalysisResults();
    setResults(data);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const latestResult = results[0];
  const pastResults = results.slice(1, 5);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ThemedText type="h2" style={styles.title}>
        Insights
      </ThemedText>

      {results.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {latestResult ? <HealthScore score={latestResult.score} /> : null}

          {latestResult ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText type="h4">Latest Analysis</ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  {formatTimestamp(latestResult.timestamp)}
                </ThemedText>
              </View>

              <View
                style={[
                  styles.summaryCard,
                  { backgroundColor: theme.backgroundDefault },
                ]}
              >
                <View style={styles.summaryHeader}>
                  <Feather name="file-text" size={20} color={theme.primary} />
                  <ThemedText type="body" style={{ fontWeight: "600" }}>
                    Summary
                  </ThemedText>
                </View>
                <ThemedText type="body" style={{ color: theme.textSecondary }}>
                  {latestResult.summary}
                </ThemedText>
              </View>

              <ThemedText type="body" style={[styles.recommendationsTitle, { fontWeight: "600" }]}>
                Recommendations
              </ThemedText>

              {latestResult.recommendations.map((rec, index) => (
                <InsightCard
                  key={index}
                  category={rec.category}
                  title={rec.title}
                  description={rec.description}
                  priority={rec.priority}
                />
              ))}
            </View>
          ) : null}

          {pastResults.length > 0 ? (
            <View style={styles.section}>
              <ThemedText type="h4" style={styles.sectionTitle}>
                History
              </ThemedText>

              {pastResults.map((result) => (
                <Pressable
                  key={result.id}
                  onPress={() =>
                    setExpandedId(expandedId === result.id ? null : result.id)
                  }
                  style={[
                    styles.historyItem,
                    { backgroundColor: theme.backgroundDefault },
                  ]}
                >
                  <View style={styles.historyHeader}>
                    <View style={styles.historyInfo}>
                      <ThemedText type="body" style={{ fontWeight: "600" }}>
                        Score: {result.score}/100
                      </ThemedText>
                      <ThemedText
                        type="small"
                        style={{ color: theme.textSecondary }}
                      >
                        {formatTimestamp(result.timestamp)}
                      </ThemedText>
                    </View>
                    <View style={styles.historyMeta}>
                      <View
                        style={[
                          styles.providerBadge,
                          { backgroundColor: theme.backgroundSecondary },
                        ]}
                      >
                        <ThemedText type="small">
                          {result.provider === "openai" ? "ChatGPT" : "Gemini"}
                        </ThemedText>
                      </View>
                      <Feather
                        name={
                          expandedId === result.id ? "chevron-up" : "chevron-down"
                        }
                        size={20}
                        color={theme.textSecondary}
                      />
                    </View>
                  </View>

                  {expandedId === result.id ? (
                    <View style={styles.historyExpanded}>
                      <ThemedText
                        type="small"
                        style={{ color: theme.textSecondary }}
                      >
                        {result.summary}
                      </ThemedText>
                    </View>
                  ) : null}
                </Pressable>
              ))}
            </View>
          ) : null}
        </>
      )}
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
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing["5xl"],
    gap: Spacing.lg,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  scoreCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  scoreBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  scoreDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: Spacing.lg,
  },
  scoreBar: {
    height: 8,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  scoreProgress: {
    height: "100%",
    borderRadius: 4,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  summaryCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  recommendationsTitle: {
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  historyItem: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyInfo: {
    gap: 2,
  },
  historyMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  providerBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  historyExpanded: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
});
