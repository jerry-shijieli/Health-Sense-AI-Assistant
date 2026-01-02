# Health Monitor App - Design Guidelines

## Architecture Decisions

### Authentication
**Auth Required** - This app requires user authentication because:
- Health data must be synced across devices (phone and watch)
- AI analysis requires backend integration with ChatGPT/Gemini APIs
- User's health history needs persistent storage

**Implementation:**
- Use Apple Sign-In (primary) for iOS
- Include Google Sign-In for Android
- Mock auth flow in prototype using local state
- Login screen with:
  - SSO buttons (Apple/Google)
  - Privacy policy & terms of service links (health data handling)
- Account screen accessible from Settings tab:
  - User profile with customizable avatar (generate 3 health-themed avatars: yoga pose, runner silhouette, meditation figure)
  - Display name
  - Log out (with confirmation)
  - Delete account (Settings > Account > Delete Account, double confirmation warning about data loss)

### Navigation
**Tab Navigation** (5 tabs with center action):
1. **Home** - Health dashboard and daily summary
2. **Activity** - Movement and exercise tracking
3. **Analyze** (Center FAB) - Core action to trigger AI analysis
4. **Insights** - Historical trends and AI recommendations
5. **Settings** - Configuration, sync, and account

### Screen Specifications

#### 1. Home (Dashboard)
- **Purpose:** Quick overview of today's health metrics
- **Layout:**
  - Transparent header with greeting and date
  - Left: Profile avatar (navigates to Settings)
  - Right: Notification icon
  - Main: ScrollView with card-based metric widgets
  - Top inset: headerHeight + Spacing.xl
  - Bottom inset: tabBarHeight + Spacing.xl
- **Components:**
  - Metric cards: Steps, Heart Rate, Sleep, Active Minutes
  - Progress rings for daily goals
  - "Last Analyzed" timestamp with refresh button
  - Quick action card: "Run Analysis Now"

#### 2. Activity
- **Purpose:** Detailed movement and exercise data
- **Layout:**
  - Default navigation header with title "Activity"
  - Right button: Filter/Date picker icon
  - Main: ScrollView with timeline
  - Top inset: Spacing.xl
  - Bottom inset: tabBarHeight + Spacing.xl
- **Components:**
  - Date selector (horizontal scroll, last 7 days)
  - Activity timeline (walking, running, cycling with duration/distance)
  - Charts: Steps by hour, active minutes by day
  - Export data button (bottom)

#### 3. Analyze (Modal)
- **Purpose:** Trigger AI analysis and configure settings
- **Layout:**
  - Custom modal header with "AI Analysis" title
  - Left: Close button
  - Main: Scrollable form
  - Submit button: Fixed at bottom with safe area
  - Bottom inset: insets.bottom + Spacing.xl
- **Components:**
  - AI Provider selector (ChatGPT/Gemini toggle)
  - Analysis frequency: Daily/Hourly radio buttons
  - Data scope: Today/Last 7 days/Last 30 days
  - "Analyze Now" primary button (full-width, floating shadow)
  - Loading state with progress indicator

#### 4. Insights
- **Purpose:** View AI-generated health recommendations and trends
- **Layout:**
  - Transparent header with title "Insights"
  - Right: Share icon
  - Main: ScrollView
  - Top inset: headerHeight + Spacing.xl
  - Bottom inset: tabBarHeight + Spacing.xl
- **Components:**
  - Latest AI analysis card (highlighted, with timestamp)
  - Recommendation list (categorized: Sleep, Exercise, Nutrition)
  - Trend charts (weekly/monthly toggle)
  - History: Expandable list of past analyses

#### 5. Settings
- **Purpose:** App configuration and account management
- **Layout:**
  - Default navigation header with title "Settings"
  - Main: ScrollView with grouped list
  - Top inset: Spacing.xl
  - Bottom inset: tabBarHeight + Spacing.xl
- **Components:**
  - Profile section: Avatar, name, edit button
  - Health Data Sync: Phone/Watch connection status
  - Analysis Settings: Default frequency, AI provider
  - Notifications: Toggle for analysis completion alerts
  - Data Permissions: Link to system health settings
  - Account: Log out, Delete account (nested)
  - App Info: Version, Privacy Policy, Terms

#### Supporting Screens

**Onboarding (Stack-only flow):**
1. Welcome screen with app value proposition
2. Health permissions request (with explanation)
3. Analysis preferences setup
4. Auth screen (Apple/Google Sign-In)

**Analysis Results (Native Modal):**
- Full-screen modal showing detailed AI output
- Header: Close button, Share button
- Scrollable markdown-style content
- Action buttons: Save to favorites, Set reminder

## Design System

### Color Palette
- **Primary:** Vibrant blue (#007AFF) - Trust, health technology
- **Success:** Green (#34C759) - Goals met, positive trends
- **Warning:** Amber (#FF9500) - Attention needed
- **Danger:** Red (#FF3B30) - Health alerts
- **Background:** System adaptive (White/Dark)
- **Surface:** Light gray (#F2F2F7) / Dark gray (#1C1C1E)
- **Text Primary:** Black (#000000) / White (#FFFFFF)
- **Text Secondary:** Gray (#8E8E93)

### Typography
- **Title Large:** SF Pro Display, 34pt, Bold
- **Title:** SF Pro Display, 28pt, Semibold
- **Headline:** SF Pro Display, 17pt, Semibold
- **Body:** SF Pro Text, 17pt, Regular
- **Caption:** SF Pro Text, 12pt, Regular

### Visual Design
- Use Feather icons for: activity, heart, moon (sleep), trending-up (insights), settings
- Metric cards: Rounded corners (12pt), subtle elevation (no shadow), white/dark surface
- Progress rings: Circular progress with gradient fill
- Charts: Minimalist line/bar charts with Primary color
- Floating "Analyze" FAB:
  - Size: 56x56pt circle
  - Primary color background
  - White icon (zap or cpu)
  - Shadow: offset (0, 2), opacity 0.10, radius 2
- All touchable elements: Scale down to 0.95 on press
- Toggle switches: System native appearance

### Critical Assets
1. **Health-themed avatars (3):** Yoga pose silhouette, runner silhouette, meditation figure (minimalist, single-color illustrations)
2. **Empty state illustrations (2):** 
   - "No activity data" - Simple outline of phone and watch
   - "No analysis yet" - AI chip icon with question mark
3. **App icon:** Heart rate pulse line inside rounded square (generate)

### Interaction Design
- Pull-to-refresh on Home and Insights screens
- Haptic feedback when analysis completes
- Skeleton loading states for metric cards
- Smooth animated transitions between tabs
- Toast notifications for analysis completion

### Accessibility
- All interactive elements: Minimum 44x44pt touch targets
- VoiceOver labels for all icons and charts
- Dynamic Type support for all text
- High contrast mode support
- Alternative text descriptions for health metrics
- Reduce motion: Disable chart animations