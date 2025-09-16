# Sample BLE Scan App

A React Native + Expo app for scanning and connecting to Smart Swim Goggles via Bluetooth Low Energy (BLE). Built for iOS device testing and real-time swim metrics tracking.

> ⚠️ **Important**: BLE functionality requires a physical iOS device - it will **not** work in the iOS Simulator or Expo Go.

## 📦 Prerequisites

Make sure you have the following installed:

### Required Software
- **Node.js** (LTS version, e.g., `v20.x`)
- **npm** or **yarn** package manager
- **Expo CLI**
  ```bash
  npm install -g @expo/cli
  ```
- **CocoaPods** (for iOS native modules)
  ```bash
  sudo gem install cocoapods
  ```
- **Xcode** (latest from the App Store)
- **Command Line Tools**
  ```bash
  xcode-select --install
  ```

### Apple Developer Account
- Free Apple ID (works for testing)
- Paid Apple Developer account (optional, for distribution)

## 🛠️ VSCode Setup

### Recommended Extensions
- **ES7+ React/Redux/React-Native snippets** (by dsznajder)
- **Prettier - Code formatter**
- **React Native Tools** (by Microsoft)
- **Expo Tools**
- **TypeScript React (tsx) snippets**

### Settings Configuration
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 📲 iOS Device Setup

> ⚠️ **Critical**: BLE does **not** work in the iOS Simulator — you must use a real iPhone.

### Apple Developer Configuration
1. Sign into [Apple Developer](https://developer.apple.com) with your Apple ID
2. In Xcode, set the team to your **Personal Team** (free Apple ID works)
3. Connect your iPhone via USB cable

### Device Trust Setup
1. On your iPhone, go to:
   - **Settings → General → VPN & Device Management**
2. Trust the developer certificate for your Apple ID
3. Confirm trust when prompted

> 👉 **Note**: Free Apple IDs require re-signing every 7 days.

## 🚀 Getting Started

### 1. Clone and Install
```bash
git clone https://github.com/your-org/my-ble-app.git
cd my-ble-app
npm install
```

### 2. Install iOS Dependencies
```bash
cd ios
pod install
cd ..
```

### 3. Configure Bundle Identifier
Edit `app.json` or `app.config.js`:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourname.bleapp2025"
    }
  }
}
```

### 4. Build and Run on Device
```bash
# Clean build (recommended for first run)
npx expo prebuild --clean

# Install on connected iPhone
npx expo run:ios --device
```

### 5. Start Development Server
```bash
# For ongoing development
npx expo start --dev-client
```

## 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server |
| `npm run ios` | Run on iOS device |
| `npx expo prebuild --clean` | Clean rebuild native code |
| `npx expo install --fix` | Fix package compatibility |
| `cd ios && pod install` | Update iOS dependencies |

## 🐛 Troubleshooting

### Common Issues

#### "Unable to Install" Error
```bash
# Clean everything and rebuild
rm -rf ios/
npx expo prebuild --clean
npx expo run:ios --device
```

#### Provisioning Profile Errors
1. Open Xcode: `open ios/mybleapp.xcworkspace`
2. Select project → Target → **Signing & Capabilities**
3. Uncheck **"Automatically manage signing"**
4. Check **"Automatically manage signing"** again
5. Ensure your Apple ID is selected under **Team**

#### BLE Permissions
Ensure your `app.json` includes:
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSBluetoothAlwaysUsageDescription": "This app uses Bluetooth to connect to smart swim goggles.",
        "NSBluetoothPeripheralUsageDescription": "This app uses Bluetooth to connect to smart swim goggles."
      }
    }
  }
}
```

### Clean Reset (Nuclear Option)
```bash
# Clear all caches and rebuild
rm -rf node_modules/
rm -rf ios/
rm package-lock.json
npm install
npx expo prebuild --clean
npx expo run:ios --device
```

## 🏗️ Project Structure

```
swim-goggles-app/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Screen components
│   ├── services/           # BLE service logic
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Helper functions
├── assets/                 # Images, fonts, etc.
├── ios/                    # Native iOS code (auto-generated)
├── docs/                   # Project documentation
├── app.json               # Expo configuration
└── package.json           # Dependencies
```

## 📱 BLE Implementation

### Basic BLE Scanner
```javascript
import * as Bluetooth from 'expo-bluetooth';

const scanForDevices = async () => {
  try {
    const { status } = await Bluetooth.requestPermissionsAsync();
    if (status !== 'granted') return;
    
    const devices = await Bluetooth.startDeviceScanAsync({
      serviceUUIDs: ['your-swim-goggles-service-uuid']
    });
    
    return devices;
  } catch (error) {
    console.error('BLE scan error:', error);
  }
};
```

## 🔄 Development Workflow

1. **Code changes**: Edit files in your IDE
2. **Hot reload**: Changes appear automatically on device
3. **Native changes**: Rebuild with `npx expo run:ios --device`
4. **Weekly re-sign**: Free accounts need weekly reinstallation

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/awesome-feature`
3. Commit changes: `git commit -m 'Add awesome feature'`
4. Push to branch: `git push origin feature/awesome-feature`
5. Open a Pull Request

## 📞 Support

- **Issues**: Create an issue on GitHub
- **Documentation**: Check the `docs/` folder
- **BLE Troubleshooting**: See troubleshooting section above

---

**Happy Swimming!** 🏊‍♂️💙
