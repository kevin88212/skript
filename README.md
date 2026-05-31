# Obstbauer Haller – Interne Bestellapp

Interne Web-App zur digitalen Bestellverwaltung für Filialmitarbeiter von Obstbauer Haller.

## Technik-Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS 3**
- **PostgreSQL** + **Prisma ORM**
- **NextAuth.js** (JWT-basierte Authentifizierung mit Rollen)

---

## Lokale Entwicklung starten

### 1. Voraussetzungen

- Node.js 18+
- PostgreSQL-Datenbank läuft lokal

### 2. Abhängigkeiten installieren

```bash
npm install
```

### 3. Umgebungsvariablen konfigurieren

```bash
cp .env.example .env
```

`.env` anpassen:

```env
DATABASE_URL="postgresql://BENUTZER:PASSWORT@localhost:5432/obstbauer_haller"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="ein-langer-zufaelliger-schluessel-min-32-zeichen"
```

### 4. Datenbank anlegen und Schema anwenden

```bash
# Datenbank-Schema anlegen
npm run db:push

# Oder mit Migrations-History (empfohlen für Produktion):
npm run db:migrate

# Prisma Client generieren
npm run db:generate
```

### 5. Seed-Daten einspielen

```bash
npm run db:seed
```

Dies legt an:
- 3 Filialen (Hauptfiliale, Filiale Mitte, Filiale Nord)
- 4 Testbenutzer
- 8 Kategorien (Gemüse, Früchte, Eier, Fisch, Käse/MoPro, Säfte, Wein, Spirituosen)
- ~80 Beispielartikel

### 6. Entwicklungsserver starten

```bash
npm run dev
```

App läuft unter: **http://localhost:3000**

---

## Test-Zugangsdaten

| Rolle | E-Mail | Passwort |
|-------|--------|----------|
| Admin | admin@obstbauer-haller.de | admin123 |
| Hauptfiliale | hauptfiliale@obstbauer-haller.de | hauptfiliale123 |
| Mitarbeiter (Filiale Mitte) | mitte@obstbauer-haller.de | mitarbeiter123 |
| Mitarbeiter (Filiale Nord) | nord@obstbauer-haller.de | mitarbeiter123 |

---

## Rollen & Berechtigungen

| Funktion | Mitarbeiter | Hauptfiliale | Admin |
|----------|:-----------:|:------------:|:-----:|
| Neue Bestellung erstellen | ✅ | ✅ | ✅ |
| Eigene Bestellungen ansehen | ✅ | ✅ | ✅ |
| Alle Bestellungen ansehen | ❌ | ✅ | ✅ |
| Bestellstatus ändern | ❌ | ✅ | ✅ |
| Sammelliste abrufen | ❌ | ✅ | ✅ |
| Artikel verwalten | ❌ | ❌ | ✅ |
| Kategorien verwalten | ❌ | ❌ | ✅ |
| Benutzer verwalten | ❌ | ❌ | ✅ |
| Filialen verwalten | ❌ | ❌ | ✅ |

---

## Seiten-Übersicht

| Seite | Pfad | Zugang |
|-------|------|--------|
| Login | `/login` | Alle |
| Dashboard | `/dashboard` | Alle |
| Neue Bestellung | `/orders/new` | Mitarbeiter, Admin |
| Meine Bestellungen | `/orders` | Mitarbeiter |
| Bestelldetail | `/orders/[id]` | Eigene Bestellung |
| Alle Bestellungen | `/admin/orders` | Admin, Hauptfiliale |
| Sammelliste | `/admin/collection-list` | Admin, Hauptfiliale |
| Artikelverwaltung | `/admin/products` | Admin |
| Kategorienverwaltung | `/admin/categories` | Admin |
| Benutzerverwaltung | `/admin/users` | Admin |
| Filialverwaltung | `/admin/branches` | Admin |

---

## Nützliche Befehle

```bash
npm run dev          # Entwicklungsserver starten
npm run build        # Produktions-Build erstellen
npm run db:studio    # Prisma Studio (Datenbank-UI)
npm run db:seed      # Seed-Daten einspielen
npm run db:reset     # DB zurücksetzen und neu seeden
```

---

## Warengruppen in der App

- Gemüse
- Früchte
- Eier
- Fisch
- Käse / MoPro
- Säfte
- Wein
- Spirituosen
