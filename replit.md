# HealthPulse

## Overview

HealthPulse is a cross-platform health monitoring mobile application built with React Native and Expo. The app tracks daily health metrics (steps, heart rate, sleep, active minutes, calories, distance), provides AI-powered health analysis using OpenAI or Google Gemini, and displays personalized wellness insights. The architecture follows a client-server model where the Expo mobile app communicates with an Express backend for AI analysis and data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React Native with Expo SDK 54 (new architecture enabled)
- **Navigation**: React Navigation v7 with native stack and bottom tabs
  - Tab navigation: Home, Activity, Analyze (center FAB), Insights, Settings
  - Modal presentation for AI analysis screen
- **State Management**: TanStack React Query for server state, local React state for UI
- **Styling**: React Native StyleSheet with custom theming system supporting light/dark modes
- **Animations**: React Native Reanimated for fluid interactions
- **Storage**: AsyncStorage for local health data persistence

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for health analysis
- **AI Integration**: Dual provider support (OpenAI and Google Gemini) via environment-configured API keys

### Data Storage
- **Schema**: Drizzle ORM with PostgreSQL dialect
- **Tables**: Users table with UUID primary keys, plus conversation/message tables for chat functionality
- **Client Storage**: AsyncStorage for health metrics, goals, analysis results, and settings
- **Current Implementation**: MemStorage class for in-memory user data (database connection available but storage abstracted)

### Key Design Patterns
- **Path Aliases**: `@/` maps to `./client`, `@shared/` maps to `./shared`
- **Component Architecture**: Themed components (ThemedText, ThemedView) with consistent styling
- **Error Handling**: ErrorBoundary wrapper with fallback UI
- **Platform Compatibility**: Web-compatible components with platform-specific fallbacks

### Build Configuration
- **Bundler**: Metro for React Native, esbuild for server production builds
- **Development**: Parallel Expo dev server and Express server with proxy support
- **Production**: Static web export capability with custom build script

## External Dependencies

### AI Services
- **OpenAI API**: Primary AI provider for health analysis (configured via `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL`)
- **Google Gemini**: Alternative AI provider via `@google/genai` package

### Database
- **PostgreSQL**: Configured via `DATABASE_URL` environment variable
- **Drizzle ORM**: Schema management and migrations in `./migrations` directory

### Expo Modules
- expo-blur, expo-haptics, expo-image, expo-splash-screen, expo-web-browser
- expo-glass-effect for iOS liquid glass effects (iOS 26+)

### Key Libraries
- `react-native-gesture-handler`: Touch interactions
- `react-native-reanimated`: Animations
- `react-native-keyboard-controller`: Keyboard handling
- `react-native-svg`: Chart/progress ring rendering
- `@tanstack/react-query`: Data fetching and caching

### Replit Integrations
Pre-built modules in `server/replit_integrations/`:
- **batch**: Rate-limited batch processing with retries
- **chat**: Conversation persistence and OpenAI chat completions
- **image**: Image generation via OpenAI gpt-image-1 model