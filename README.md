# HealthPulse

**AI-Powered Health Monitoring Mobile Application**

HealthPulse is a cross-platform mobile application built with React Native and Expo that enables users to track their daily health metrics, receive AI-powered health analysis, and get personalized wellness recommendations. The app supports both OpenAI (ChatGPT) and Google Gemini as AI providers, offering users flexibility in their AI-assisted health journey.

---

## Table of Contents

1. [Product Overview](#product-overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Technology Stack](#technology-stack)
5. [Getting Started](#getting-started)
6. [Configuration](#configuration)
7. [API Documentation](#api-documentation)
8. [Deployment](#deployment)
9. [App Store Publishing](#app-store-publishing)
10. [Security Considerations](#security-considerations)
11. [Contributing](#contributing)
12. [License](#license)

---

## Product Overview

### Vision

HealthPulse democratizes AI-powered health insights by providing users with an intuitive mobile interface to track their daily wellness metrics and receive personalized recommendations powered by state-of-the-art language models.

### Target Audience

- Health-conscious individuals seeking data-driven wellness insights
- Fitness enthusiasts wanting to optimize their daily routines
- Users interested in leveraging AI for personalized health recommendations

### Key Value Propositions

1. **Dual AI Provider Support**: Choose between OpenAI (GPT-4o) and Google Gemini for health analysis
2. **Configurable Analysis Frequency**: Daily or hourly automated health assessments
3. **Flexible Data Scope**: Analyze today's data, 7-day trends, or 30-day patterns
4. **Cross-Platform Compatibility**: Runs on iOS, Android, and web browsers
5. **Offline-First Architecture**: Local data persistence with AsyncStorage

---

## Features

### Dashboard (Home Screen)
- Real-time health metrics overview with animated progress rings
- Daily goals tracking for steps, active minutes, and sleep
- Metric cards displaying heart rate, distance, and calories
- Quick-access "Last Analyzed" status with refresh capability

### Activity Tracking
- Day-by-day activity selector for historical viewing
- Detailed daily summaries with comprehensive metrics
- Hourly step distribution charts
- Movement pattern visualization

### AI-Powered Analysis
- One-tap AI health analysis via center floating action button (FAB)
- Provider selection (ChatGPT or Gemini) at analysis time
- Health score calculation (0-100) based on multiple metrics
- Categorized recommendations: Sleep, Exercise, Nutrition, General
- Priority-based action items (High, Medium, Low)

### Insights Dashboard
- Historical AI analysis results
- Trend visualization and recommendations history
- Health score tracking over time

### Settings & Configuration
- AI provider preference (OpenAI/Gemini)
- Analysis frequency (Daily/Hourly)
- Data scope configuration (Today/7 Days/30 Days)
- Profile management and preferences

---

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Mobile Client                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Expo/RN   │  │   React     │  │     AsyncStorage        │  │
│  │   Runtime   │──│  Navigation │──│  (Local Persistence)    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│         │                                                        │
│         │  HTTP/REST                                             │
│         ▼                                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Express Backend (Port 5000)                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   REST API  │  │   AI Route  │  │   Static File Server    │  │
│  │   Handler   │──│  /api/analyze│──│   (Expo Manifests)      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│         │                 │                                      │
│         │                 ▼                                      │
│  ┌──────┴─────────────────────────────────────────────────────┐ │
│  │              Replit AI Integrations                         │ │
│  │  ┌───────────────┐         ┌───────────────────────────┐   │ │
│  │  │   OpenAI      │         │       Google Gemini       │   │ │
│  │  │   GPT-4o      │         │   gemini-2.5-flash        │   │ │
│  │  └───────────────┘         └───────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
healthpulse/
├── client/                    # React Native mobile application
│   ├── components/            # Reusable UI components
│   │   ├── Button.tsx         # Custom button component
│   │   ├── Card.tsx           # Card container component
│   │   ├── InsightCard.tsx    # AI insight display card
│   │   ├── MetricCard.tsx     # Health metric card
│   │   ├── ProgressRing.tsx   # Circular progress indicator
│   │   ├── SettingsRow.tsx    # Settings list row component
│   │   └── ...
│   ├── constants/             # App constants and theme
│   │   └── theme.ts           # Color palette and spacing
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   │   ├── health-storage.ts  # AsyncStorage health data manager
│   │   └── query-client.ts    # TanStack Query configuration
│   ├── navigation/            # Navigation configuration
│   │   ├── MainTabNavigator.tsx   # Bottom tab navigation
│   │   └── RootStackNavigator.tsx # Root stack with modals
│   ├── screens/               # Application screens
│   │   ├── HomeScreen.tsx     # Dashboard/home screen
│   │   ├── ActivityScreen.tsx # Activity tracking screen
│   │   ├── InsightsScreen.tsx # AI insights screen
│   │   ├── SettingsScreen.tsx # Settings screen
│   │   └── AnalyzeModal.tsx   # AI analysis modal
│   └── index.js               # App entry point
├── server/                    # Express backend
│   ├── replit_integrations/   # AI integration modules
│   ├── templates/             # HTML templates
│   │   └── landing-page.html  # Landing page for web
│   ├── index.ts               # Server entry point
│   └── routes.ts              # API route definitions
├── shared/                    # Shared types and schemas
│   └── schema.ts              # Drizzle ORM schema
├── assets/                    # Static assets
│   └── images/                # App icons and images
├── scripts/                   # Build scripts
├── app.json                   # Expo configuration
├── package.json               # Dependencies
└── tsconfig.json              # TypeScript configuration
```

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.81.5 | Cross-platform mobile framework |
| Expo SDK | 54 | Development toolchain and native APIs |
| React Navigation | 7.x | Navigation framework |
| TanStack React Query | 5.x | Server state management |
| React Native Reanimated | 4.x | Fluid animations |
| AsyncStorage | 2.x | Local data persistence |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x | Runtime environment |
| Express | 4.x | Web framework |
| TypeScript | 5.x | Type safety |
| OpenAI SDK | 6.x | AI provider client |
| Drizzle ORM | 0.39.x | Database ORM (optional) |

### AI Services
| Provider | Model | Use Case |
|----------|-------|----------|
| OpenAI | gpt-4o | Primary health analysis |
| Google Gemini | gemini-2.5-flash | Alternative AI provider |

---

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager
- Expo Go app (for mobile testing)
- Replit account (for AI Integrations)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd healthpulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (see [Configuration](#configuration))

4. **Start the development server**
   ```bash
   # Start both Expo and Express servers
   npm run server:dev & npm run expo:dev
   ```

5. **Access the application**
   - Web: http://localhost:8081
   - Mobile: Scan QR code with Expo Go app
   - API: http://localhost:5000

### Development Workflow

```bash
# Start Express backend (port 5000)
npm run server:dev

# Start Expo development server (port 8081)
npm run expo:dev

# Run both simultaneously (recommended)
npm run server:dev && npm run expo:dev
```

---

## Configuration

### Environment Variables

The application uses Replit AI Integrations which automatically manage API keys and authentication. The following environment variables are required:

#### AI Integration Variables (Auto-configured on Replit)

| Variable | Description | Required |
|----------|-------------|----------|
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | OpenAI API base URL | Yes |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | OpenAI API key | Yes |
| `AI_INTEGRATIONS_GEMINI_BASE_URL` | Gemini API base URL | Yes |
| `AI_INTEGRATIONS_GEMINI_API_KEY` | Gemini API key | Yes |

#### Database Variables (Optional)

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | No |
| `PGHOST` | PostgreSQL host | No |
| `PGPORT` | PostgreSQL port | No |
| `PGUSER` | PostgreSQL username | No |
| `PGPASSWORD` | PostgreSQL password | No |
| `PGDATABASE` | PostgreSQL database name | No |

#### Application Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SESSION_SECRET` | Session encryption key | Yes |
| `REPLIT_DEV_DOMAIN` | Development domain (auto-set) | Auto |
| `REPLIT_DOMAINS` | Production domains (auto-set) | Auto |

### AI Provider Configuration

#### OpenAI (GPT-4o)

The OpenAI integration uses the standard OpenAI SDK with Replit's managed credentials:

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [...],
  response_format: { type: "json_object" },
});
```

#### Google Gemini (gemini-2.5-flash)

Gemini uses the OpenAI SDK with a compatible endpoint for consistency:

```typescript
import OpenAI from "openai";

const gemini = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
});

const response = await gemini.chat.completions.create({
  model: "gemini-2.5-flash",
  messages: [...],
  response_format: { type: "json_object" },
});
```

### Local Development (Non-Replit)

For local development outside Replit, you'll need to obtain your own API keys:

1. **OpenAI API Key**
   - Visit https://platform.openai.com/api-keys
   - Create a new API key
   - Set `AI_INTEGRATIONS_OPENAI_API_KEY` environment variable
   - Set `AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1`

2. **Google Gemini API Key**
   - Visit https://makersuite.google.com/app/apikey
   - Create a new API key
   - Set `AI_INTEGRATIONS_GEMINI_API_KEY` environment variable
   - Set `AI_INTEGRATIONS_GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai`

---

## API Documentation

### Base URL

- Development: `http://localhost:5000`
- Production: `https://<your-domain>.replit.app`

### Endpoints

#### POST /api/analyze

Performs AI-powered health analysis on provided health data.

**Request Body:**
```json
{
  "provider": "openai" | "gemini",
  "healthData": [
    {
      "date": "2026-01-02",
      "steps": 8500,
      "heartRate": {
        "avg": 72,
        "min": 58,
        "max": 120
      },
      "sleepHours": 7.5,
      "activeMinutes": 35,
      "calories": 2200,
      "distance": 6.2
    }
  ],
  "dataScope": "today" | "week" | "month"
}
```

**Response:**
```json
{
  "summary": "Your overall health is in a good range with consistent activity levels...",
  "score": 85,
  "recommendations": [
    {
      "category": "exercise",
      "title": "Increase Daily Steps",
      "description": "Aim to increase your step count to 10,000 steps per day...",
      "priority": "medium"
    }
  ],
  "provider": "openai",
  "analyzedAt": "2026-01-02T12:30:00.000Z"
}
```

**Error Response:**
```json
{
  "error": "Analysis failed",
  "message": "Error description"
}
```

---

## Deployment

### Replit Deployment (Recommended)

HealthPulse is optimized for deployment on Replit:

1. **Automatic Deployment**
   - Push your code to the Replit repository
   - Click "Deploy" in the Replit interface
   - Select "Autoscale" deployment type

2. **Environment Configuration**
   - AI Integrations are automatically configured
   - Database provisioning is automatic if needed
   - SSL/TLS certificates are managed by Replit

3. **Post-Deployment**
   - Your app will be available at `https://<app-name>.replit.app`
   - Health checks are automatically configured
   - Auto-scaling handles traffic spikes

### Manual Cloud Deployment

For deployment to other cloud platforms:

#### Backend Deployment (Express Server)

**Build the production server:**
```bash
npm run server:build
```

**Deploy to cloud provider:**

The built server is in `server_dist/index.js`. Deploy using:

- **AWS EC2/ECS**: Use Docker or direct Node.js deployment
- **Google Cloud Run**: Containerize with provided Dockerfile
- **Heroku**: Use buildpack deployment
- **DigitalOcean App Platform**: Connect repository

**Required environment variables for production:**
```env
NODE_ENV=production
PORT=5000
AI_INTEGRATIONS_OPENAI_API_KEY=<your-openai-key>
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1
AI_INTEGRATIONS_GEMINI_API_KEY=<your-gemini-key>
AI_INTEGRATIONS_GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
SESSION_SECRET=<random-secure-string>
```

#### Static Build for Web

```bash
npm run expo:static:build
```

The static build outputs to `static-build/` directory, which can be deployed to any static hosting service (Vercel, Netlify, Cloudflare Pages).

---

## App Store Publishing

### Prerequisites for App Store Publishing

1. **Apple Developer Account** ($99/year)
   - Enroll at https://developer.apple.com/programs/
   - Required for iOS App Store distribution

2. **Google Play Developer Account** ($25 one-time)
   - Register at https://play.google.com/console/signup
   - Required for Android Play Store distribution

3. **Expo Application Services (EAS)** (Free tier available)
   - Sign up at https://expo.dev
   - Install EAS CLI: `npm install -g eas-cli`

### iOS App Store Publishing

#### Step 1: Configure EAS Build

```bash
# Login to Expo
eas login

# Initialize EAS in your project
eas build:configure
```

#### Step 2: Update app.json for iOS

Ensure your `app.json` has the correct iOS configuration:

```json
{
  "expo": {
    "name": "HealthPulse",
    "slug": "health-pulse",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.healthpulse.app",
      "supportsTablet": true,
      "buildNumber": "1",
      "infoPlist": {
        "NSHealthShareUsageDescription": "HealthPulse needs access to your health data to provide personalized insights.",
        "NSHealthUpdateUsageDescription": "HealthPulse needs to update your health data for accurate tracking."
      }
    }
  }
}
```

#### Step 3: Create iOS Build

```bash
# Create production iOS build
eas build --platform ios --profile production
```

#### Step 4: Submit to App Store

```bash
# Submit to App Store Connect
eas submit --platform ios
```

#### Step 5: App Store Connect Configuration

1. Log in to https://appstoreconnect.apple.com
2. Create a new app with bundle ID `com.healthpulse.app`
3. Configure:
   - App Information (name, category: Health & Fitness)
   - Pricing and Availability
   - Privacy Policy URL (required)
   - App Review Information
   - Screenshots (iPhone 6.7", 6.5", 5.5"; iPad Pro)
4. Submit for Review

### Android Play Store Publishing

#### Step 1: Update app.json for Android

```json
{
  "expo": {
    "android": {
      "package": "com.healthpulse.app",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundColor": "#007AFF"
      },
      "permissions": [
        "android.permission.ACTIVITY_RECOGNITION",
        "android.permission.ACCESS_FINE_LOCATION"
      ]
    }
  }
}
```

#### Step 2: Create Android Build

```bash
# Create production Android build (AAB format for Play Store)
eas build --platform android --profile production
```

#### Step 3: Submit to Play Store

```bash
# Submit to Google Play Console
eas submit --platform android
```

#### Step 4: Google Play Console Configuration

1. Log in to https://play.google.com/console
2. Create a new application
3. Configure:
   - Store listing (title, description, screenshots)
   - Content rating questionnaire
   - Privacy policy URL
   - Target audience and content
   - App category: Health & Fitness
4. Upload AAB file from EAS build
5. Submit for review

### Version Management

Update versions before each release:

```json
// app.json
{
  "expo": {
    "version": "1.1.0",          // Semantic version (visible to users)
    "ios": {
      "buildNumber": "2"          // Increment for each iOS build
    },
    "android": {
      "versionCode": 2            // Increment for each Android build
    }
  }
}
```

### EAS Build Profiles

Create `eas.json` for build configurations:

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## Security Considerations

### API Key Management

- **Never commit API keys** to version control
- Use environment variables for all sensitive configuration
- Replit AI Integrations handles key rotation automatically
- For self-hosted deployments, implement secret management (AWS Secrets Manager, HashiCorp Vault)

### Data Privacy

- Health data is stored locally on the device using AsyncStorage
- No health data is persisted on the server
- AI analysis requests contain only aggregated metrics
- Implement data encryption for production deployments

### Authentication (Future Enhancement)

The current MVP uses local storage. For production:
- Implement Apple Sign-In for iOS
- Implement Google Sign-In for Android
- Use secure token-based authentication
- Implement session management with secure cookies

### HTTPS/TLS

- All production traffic must use HTTPS
- Replit deployments include automatic SSL certificates
- For self-hosted, use Let's Encrypt or cloud provider certificates

---

## Contributing

### Development Guidelines

1. **Code Style**
   - Follow TypeScript best practices
   - Use ESLint and Prettier for code formatting
   - Run `npm run lint:fix` before committing

2. **Component Guidelines**
   - Use ThemedText and ThemedView for consistent theming
   - Follow React Native patterns (no HTML primitives)
   - All text must be wrapped in `<Text>` components

3. **Testing**
   - Test on both iOS and Android via Expo Go
   - Verify web compatibility
   - Test AI analysis with both providers

### Pull Request Process

1. Create a feature branch from `main`
2. Implement changes following code guidelines
3. Run linting and type checks: `npm run lint && npm run check:types`
4. Submit PR with clear description
5. Address code review feedback

---

## License

This project is proprietary software. All rights reserved.

---

## Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team

---

**Built with Expo and React Native**

*Last updated: January 2026*
