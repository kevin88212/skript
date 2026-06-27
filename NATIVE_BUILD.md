# Funke – Native iOS App bauen

## Voraussetzungen
- Mac mit macOS 13+
- Xcode 15+ (aus dem App Store)
- Node.js 18+
- Apple Developer Account (kostenlos für TestFlight, 99€/Jahr für App Store)

## 1. Repository klonen & Dependencies installieren

```bash
git clone https://github.com/kevin88212/skript.git funke
cd funke
npm install
```

## 2. App bauen

```bash
npm run build
```

## 3. iOS-Projekt initialisieren

```bash
npx cap add ios
npx cap sync
```

## 4. In Xcode öffnen

```bash
npx cap open ios
```

In Xcode:
1. Signing & Capabilities → dein Apple Developer Account
2. Bundle Identifier: `de.funke.app` (oder eigener)

## 5. App auf iPhone deployen

- iPhone per USB verbinden
- In Xcode: dein iPhone als Ziel wählen → ▶ Play
- Oder: Product → Archive → TestFlight
