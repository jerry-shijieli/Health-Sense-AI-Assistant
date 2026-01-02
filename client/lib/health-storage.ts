import AsyncStorage from "@react-native-async-storage/async-storage";

export interface HealthMetric {
  id: string;
  type: "steps" | "heartRate" | "sleep" | "activeMinutes" | "calories" | "distance";
  value: number;
  unit: string;
  timestamp: string;
  source: "phone" | "watch";
}

export interface DailyHealthData {
  date: string;
  steps: number;
  heartRate: { avg: number; min: number; max: number };
  sleepHours: number;
  activeMinutes: number;
  calories: number;
  distance: number;
}

export interface HealthGoals {
  steps: number;
  activeMinutes: number;
  sleepHours: number;
  calories: number;
}

export interface AnalysisResult {
  id: string;
  provider: "openai" | "gemini";
  timestamp: string;
  summary: string;
  recommendations: {
    category: "sleep" | "exercise" | "nutrition" | "general";
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }[];
  score: number;
}

export interface AnalysisSettings {
  provider: "openai" | "gemini";
  frequency: "daily" | "hourly";
  dataScope: "today" | "week" | "month";
  lastAnalysisTime: string | null;
  notificationsEnabled: boolean;
}

const KEYS = {
  HEALTH_DATA: "health_data",
  GOALS: "health_goals",
  ANALYSIS_RESULTS: "analysis_results",
  ANALYSIS_SETTINGS: "analysis_settings",
  DEVICE_SYNC: "device_sync_status",
};

const DEFAULT_GOALS: HealthGoals = {
  steps: 10000,
  activeMinutes: 30,
  sleepHours: 8,
  calories: 2000,
};

const DEFAULT_SETTINGS: AnalysisSettings = {
  provider: "openai",
  frequency: "daily",
  dataScope: "today",
  lastAnalysisTime: null,
  notificationsEnabled: true,
};

export const healthStorage = {
  async getHealthData(): Promise<DailyHealthData[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.HEALTH_DATA);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveHealthData(data: DailyHealthData[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.HEALTH_DATA, JSON.stringify(data));
  },

  async getTodayData(): Promise<DailyHealthData | null> {
    const allData = await this.getHealthData();
    const today = new Date().toISOString().split("T")[0];
    return allData.find((d) => d.date === today) || null;
  },

  async updateTodayData(data: Partial<DailyHealthData>): Promise<void> {
    const allData = await this.getHealthData();
    const today = new Date().toISOString().split("T")[0];
    const existingIndex = allData.findIndex((d) => d.date === today);

    const todayData: DailyHealthData = {
      date: today,
      steps: 0,
      heartRate: { avg: 0, min: 0, max: 0 },
      sleepHours: 0,
      activeMinutes: 0,
      calories: 0,
      distance: 0,
      ...(existingIndex >= 0 ? allData[existingIndex] : {}),
      ...data,
    };

    if (existingIndex >= 0) {
      allData[existingIndex] = todayData;
    } else {
      allData.push(todayData);
    }

    await this.saveHealthData(allData);
  },

  async getGoals(): Promise<HealthGoals> {
    try {
      const data = await AsyncStorage.getItem(KEYS.GOALS);
      return data ? JSON.parse(data) : DEFAULT_GOALS;
    } catch {
      return DEFAULT_GOALS;
    }
  },

  async saveGoals(goals: HealthGoals): Promise<void> {
    await AsyncStorage.setItem(KEYS.GOALS, JSON.stringify(goals));
  },

  async getAnalysisResults(): Promise<AnalysisResult[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.ANALYSIS_RESULTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveAnalysisResult(result: AnalysisResult): Promise<void> {
    const results = await this.getAnalysisResults();
    results.unshift(result);
    const trimmed = results.slice(0, 30);
    await AsyncStorage.setItem(KEYS.ANALYSIS_RESULTS, JSON.stringify(trimmed));
  },

  async getSettings(): Promise<AnalysisSettings> {
    try {
      const data = await AsyncStorage.getItem(KEYS.ANALYSIS_SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: Partial<AnalysisSettings>): Promise<void> {
    const current = await this.getSettings();
    await AsyncStorage.setItem(
      KEYS.ANALYSIS_SETTINGS,
      JSON.stringify({ ...current, ...settings })
    );
  },

  async clearAllData(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  },

  generateMockHealthData(): DailyHealthData {
    const today = new Date().toISOString().split("T")[0];
    return {
      date: today,
      steps: Math.floor(Math.random() * 8000) + 4000,
      heartRate: {
        avg: Math.floor(Math.random() * 20) + 65,
        min: Math.floor(Math.random() * 10) + 55,
        max: Math.floor(Math.random() * 30) + 90,
      },
      sleepHours: Math.round((Math.random() * 3 + 5) * 10) / 10,
      activeMinutes: Math.floor(Math.random() * 40) + 15,
      calories: Math.floor(Math.random() * 800) + 1400,
      distance: Math.round((Math.random() * 4 + 2) * 10) / 10,
    };
  },

  generateWeekData(): DailyHealthData[] {
    const data: DailyHealthData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const mockData = this.generateMockHealthData();
      data.push({ ...mockData, date: date.toISOString().split("T")[0] });
    }
    return data;
  },
};
