# Boundary Guard AI

AI-powered boundary monitoring for your space. Keep your pets safe with real-time object detection and instant alerts when animals enter restricted zones.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.1.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178c6.svg)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.22.0-ff6f00.svg)

## 🚀 Features

- **🎥 Live Detection**: Real-time object detection using your webcam and COCO-SSD AI model
- **🎯 Custom Zones**: Draw and resize no-go zones with interactive canvas
- **🔔 Smart Alerts**: Desktop notifications and custom audio alerts with cooldown
- **🐾 Animal Selection**: Monitor specific animals (cat, dog, bird, and 7 more)
- **🔒 Privacy-First**: 100% client-side processing - no data leaves your device
- **⚡ Fast Performance**: Optimized with lite_mobilenet_v2 for 500ms detection intervals

## 📋 Prerequisites

- Node.js 18+
- Modern browser with webcam support (Chrome, Firefox, Edge, Safari)
- Webcam/camera device

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/dannycahyo/zone-guardian.git
cd zone-guardian
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## 📖 Usage

### Quick Start

1. **Allow camera access** when prompted by your browser
2. **Select animals** you want to monitor (e.g., cat, dog)
3. **Draw a zone** by clicking and dragging on the canvas
4. **(Optional)** Upload alert sound and enable desktop notifications
5. **Click "Start Monitoring"** to begin real-time detection

### Detailed Instructions

#### Setting Up Alerts

**Desktop Notifications:**
- Click "Enable Notifications" in Alert Settings
- Grant permission when browser prompts
- If denied, alerts will fall back to audio-only

**Custom Audio:**
- Click "Upload Audio File" in Alert Settings
- Select any audio file (MP3, WAV, OGG, etc.)
- Audio plays instantly when breach detected

**Alert Cooldown:**
- Default: 5 seconds between alerts
- Prevents notification spam from continuous breaches

#### Drawing Zones

- **Create**: Click and drag on the canvas to draw a rectangle
- **Resize**: Drag any of the 8 handles (4 corners + 4 edges)
- **Clear**: Click "Clear Zone" to redraw
- **Lock**: Zone locked during active monitoring

#### Monitoring

**Start Requirements:**
- ✅ At least one animal selected
- ✅ Zone drawn
- ✅ Camera ready
- ✅ AI model loaded

**During Monitoring:**
- Detection runs every 500ms
- Real-time detection status shown
- Breach alerts trigger notification + audio

## 🏗️ Architecture

### Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| Framework | React 19 | Component-based UI |
| Routing | React Router 7 | File-based routing with SSR |
| Styling | Tailwind CSS 4 | Utility-first styling |
| AI Runtime | TensorFlow.js | Browser ML inference |
| AI Model | COCO-SSD | Object detection with bounding boxes |
| Camera | react-webcam | Webcam access |
| State | React Context + useReducer | Global state management |
| Language | TypeScript 5 | Type safety |

### Project Structure

```
zone-guardian/
├── app/
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn/ui components
│   │   ├── CameraFeed.tsx
│   │   ├── ZoneDrawer.tsx
│   │   ├── AnimalSelector.tsx
│   │   ├── MonitoringControls.tsx
│   │   ├── AlertSettings.tsx
│   │   └── ErrorBoundary.tsx
│   ├── contexts/           # React Context
│   │   ├── MonitoringContext.tsx
│   │   └── monitoringReducer.ts
│   ├── hooks/              # Custom hooks
│   │   ├── useObjectDetection.ts
│   │   └── useAlertManager.ts
│   ├── routes/             # Route components
│   │   ├── home.tsx
│   │   └── monitor.tsx
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── root.tsx            # App root with providers
│   └── routes.ts           # Route configuration
├── docs/
│   ├── PRD.md              # Product requirements
│   └── TRD.md              # Technical requirements
└── public/                 # Static assets
```

### Key Components

**useObjectDetection Hook:**
- Loads COCO-SSD model (lite_mobilenet_v2)
- Runs detection loop at 500ms intervals
- Filters predictions by selected animals
- Checks bounding box intersection with zone
- Triggers breach callback

**useAlertManager Hook:**
- Manages desktop notifications (Browser Notification API)
- Handles custom audio playback (HTML5 Audio)
- Implements 5-second cooldown
- Graceful fallbacks for denied permissions

**MonitoringContext:**
- useReducer-based state management
- Actions: SET_IS_MONITORING, SET_ZONE, TOGGLE_ANIMAL, UPDATE_LAST_ALERT_TIME, etc.
- Avoids useState hell with clean reducer pattern

## 🧪 Development

### Available Scripts

```bash
npm run dev         # Start dev server with HMR
npm run build       # Build for production
npm start           # Run production build
npm run typecheck   # Type check with TypeScript
```

### Type Checking

```bash
npm run typecheck
```

All components are fully typed with TypeScript for better DX and fewer runtime errors.

## 🐛 Troubleshooting

### Camera Issues

**"Camera access denied"**
- Check browser permissions in settings
- Ensure no other app is using the camera
- Try reloading the page

**"No camera found"**
- Connect a webcam device
- Check device drivers
- Try a different browser

### AI Model Issues

**"AI Model Load Failure"**
- Check internet connection (model downloads on first load)
- Clear browser cache and reload
- Check browser console for detailed errors

### Alert Issues

**Notifications not showing**
- Click "Enable Notifications" in Alert Settings
- Check browser notification permissions
- Fallback: Use audio-only alerts

**Audio not playing**
- Upload a valid audio file (MP3, WAV, OGG)
- Check browser audio permissions
- Ensure device volume is not muted

### Performance Issues

**Slow detection**
- Detection runs at 500ms intervals (normal)
- Close other heavy browser tabs
- Try a more powerful device

**High CPU usage**
- Expected behavior (AI model is CPU-intensive)
- Stop monitoring when not needed
- Use lighter browser (Chrome recommended)

## 🚀 Production Build

```bash
# Build for production
npm run build

# Test production build locally
npm start
```

The build outputs:
- `build/client/` - Static assets (served by CDN)
- `build/server/` - Server-side code (runs on Node.js)

## 📦 Deployment

### Recommended Platforms

- **Vercel** (easiest, zero config)
- **Netlify**
- **Railway**
- **Fly.io**

### Deploy to Vercel

```bash
npm i -g vercel
vercel deploy
```

## 🔐 Privacy & Security

- **Zero Server Processing**: All AI inference runs in your browser
- **No Data Upload**: Video never leaves your device
- **No Tracking**: No analytics, no cookies, no tracking
- **Open Source**: Full source code available for audit

## 🤝 Contributing

Contributions welcome! Please read our [contributing guidelines](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TensorFlow.js](https://www.tensorflow.org/js) for browser ML
- [COCO-SSD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) for object detection
- [React Router](https://reactrouter.com/) for the framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Shadcn/ui](https://ui.shadcn.com/) for UI components

## 📧 Contact

**Danny Dwi Cahyono**
- GitHub: [@dannycahyo](https://github.com/dannycahyo)
- Project: [zone-guardian](https://github.com/dannycahyo/zone-guardian)

---

Built with ❤️ using React Router, TensorFlow.js, and TypeScript.
