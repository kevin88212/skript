# FitQuest RPG – Native iOS App bauen

## Voraussetzungen
- Mac mit macOS 13+
- Xcode 15+ (aus dem App Store)
- Node.js 18+
- Apple Developer Account (kostenlos für TestFlight, 99€/Jahr für App Store)

## 1. Repository klonen & Dependencies installieren

```bash
git clone https://github.com/kevin88212/skript.git fitquest
cd fitquest
npm install
```

## 2. HealthKit Plugin installieren

```bash
npm install @capacitor-community/health-kit
```

## 3. App bauen

```bash
npm run build
```

## 4. iOS-Projekt initialisieren

```bash
npx cap add ios
npx cap sync
```

## 5. Info.plist – HealthKit Berechtigungen

Öffne `ios/App/App/Info.plist` und füge hinzu:

```xml
<key>NSHealthShareUsageDescription</key>
<string>FitQuest liest dein Gewicht, Schritte und Herzfrequenz aus Apple Health.</string>
<key>NSHealthUpdateUsageDescription</key>
<string>FitQuest schreibt dein Workout-Gewicht in Apple Health.</string>
```

## 6. In Xcode öffnen

```bash
npx cap open ios
```

In Xcode:
1. Signing & Capabilities → dein Apple Developer Account
2. + Capability → **HealthKit** hinzufügen
3. Bundle Identifier: `de.fitquest.app` (oder eigener)

## 7. App auf iPhone deployen

- iPhone per USB verbinden
- In Xcode: dein iPhone als Ziel wählen → ▶ Play
- Oder: Product → Archive → TestFlight

## Apple Health Daten die gelesen werden
- ✅ Schritte (täglich)
- ✅ Aktive Kalorien
- ✅ Herzfrequenz (Ruhepuls)
- ✅ Gewicht (neuester Wert)
- ✅ Laufdistanz
