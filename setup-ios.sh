#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# FitQuest RPG – iOS Setup Skript
# Ausführen auf dem Mac: bash setup-ios.sh
# ─────────────────────────────────────────────────────────────────────────────
set -e

CYAN='\033[0;36m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
step() { echo -e "\n${CYAN}▶ $1${NC}"; }
ok()   { echo -e "${GREEN}✓ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; }

echo -e "${CYAN}"
echo "  ███████╗██╗████████╗ ██████╗ ██╗   ██╗███████╗███████╗████████╗"
echo "  ██╔════╝██║╚══██╔══╝██╔═══██╗██║   ██║██╔════╝██╔════╝╚══██╔══╝"
echo "  █████╗  ██║   ██║   ██║   ██║██║   ██║█████╗  ███████╗   ██║   "
echo "  ██╔══╝  ██║   ██║   ██║▄▄ ██║██║   ██║██╔══╝  ╚════██║   ██║   "
echo "  ██║     ██║   ██║   ╚██████╔╝╚██████╔╝███████╗███████║   ██║   "
echo "  ╚═╝     ╚═╝   ╚═╝    ╚══▀▀═╝  ╚═════╝ ╚══════╝╚══════╝   ╚═╝   "
echo -e "${NC}"
echo "  iOS Setup – Apple Health Integration"
echo "  ──────────────────────────────────────"

# ── Voraussetzungen prüfen ────────────────────────────────────────────────────
step "Voraussetzungen prüfen"

if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js nicht gefunden. Installiere von https://nodejs.org${NC}"; exit 1
fi
ok "Node.js $(node -v)"

if ! command -v xcodebuild &> /dev/null; then
  echo -e "${RED}✗ Xcode nicht gefunden. Installiere aus dem App Store.${NC}"; exit 1
fi
ok "Xcode $(xcodebuild -version | head -1)"

if ! command -v pod &> /dev/null; then
  warn "CocoaPods nicht gefunden – wird jetzt installiert..."
  sudo gem install cocoapods
fi
ok "CocoaPods $(pod --version)"

# ── Dependencies installieren ─────────────────────────────────────────────────
step "npm Dependencies installieren"
npm install
npm install @capacitor-community/health-kit @capacitor/splash-screen
ok "Dependencies installiert"

# ── App bauen ─────────────────────────────────────────────────────────────────
step "Web-App bauen (Vite)"
npm run build
ok "Build abgeschlossen → dist/"

# ── Capacitor iOS initialisieren ──────────────────────────────────────────────
step "Capacitor iOS hinzufügen"
if [ ! -d "ios" ]; then
  npx cap add ios
  ok "iOS-Projekt erstellt"
else
  ok "iOS-Projekt bereits vorhanden – übersprungen"
fi

step "Capacitor sync"
npx cap sync ios
ok "Sync abgeschlossen"

# ── Info.plist patchen ────────────────────────────────────────────────────────
step "Info.plist – HealthKit Berechtigungen eintragen"
PLIST="ios/App/App/Info.plist"

patch_plist() {
  local KEY="$1" VALUE="$2" TYPE="$3"
  if ! grep -q "$KEY" "$PLIST" 2>/dev/null; then
    # Vor </dict> einfügen
    sed -i '' "/<\/dict>/{
      s|</dict>|<key>${KEY}</key>\n\t<${TYPE}>${VALUE}</${TYPE}>\n</dict>|
    }" "$PLIST"
    ok "  + $KEY"
  else
    warn "  $KEY bereits vorhanden – übersprungen"
  fi
}

patch_plist "NSHealthShareUsageDescription" \
  "FitQuest liest deine Gesundheitsdaten (Gewicht, Schritte, Herzfrequenz) um deinen Fortschritt zu tracken." \
  "string"

patch_plist "NSHealthUpdateUsageDescription" \
  "FitQuest speichert dein Training und Gewicht in Apple Health." \
  "string"

# Hochformat erzwingen
if ! grep -q "UISupportedInterfaceOrientations" "$PLIST" 2>/dev/null; then
  python3 - "$PLIST" << 'PYEOF'
import plistlib, sys
with open(sys.argv[1], 'rb') as f:
    pl = plistlib.load(f)
pl['UISupportedInterfaceOrientations'] = ['UIInterfaceOrientationPortrait']
with open(sys.argv[1], 'wb') as f:
    plistlib.dump(pl, f)
PYEOF
  ok "  + Hochformat-Einschränkung"
fi

# ── Entitlements kopieren ─────────────────────────────────────────────────────
step "HealthKit Entitlements setzen"
ENTITLEMENTS="ios/App/App/App.entitlements"
if [ ! -f "$ENTITLEMENTS" ]; then
  cp ios-config/App.entitlements "$ENTITLEMENTS"
  ok "App.entitlements erstellt"
else
  ok "App.entitlements bereits vorhanden"
fi

# ── Podfile Abhängigkeit sicherstellen ────────────────────────────────────────
step "CocoaPods Update"
cd ios/App && pod install && cd ../..
ok "Pods installiert"

# ── Xcode öffnen ─────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Setup abgeschlossen! 🎉${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${CYAN}Nächste Schritte in Xcode:${NC}"
echo ""
echo "  1. Xcode wird jetzt geöffnet"
echo "  2. Wähle dein iPhone als Ziel-Gerät"
echo "  3. Signing & Capabilities:"
echo "     → Team: Dein Apple Developer Account"
echo "     → Bundle ID: de.fitquest.app"
echo "     → + Capability → HealthKit ✓"
echo "  4. ▶ Play drücken → App startet auf deinem iPhone"
echo ""
echo -e "  ${YELLOW}Hinweis: Apple Developer Account (kostenlos) reicht für${NC}"
echo -e "  ${YELLOW}persönliche Nutzung auf dem eigenen iPhone.${NC}"
echo ""

npx cap open ios
