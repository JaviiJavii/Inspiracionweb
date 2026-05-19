# inspo.find

Buscador de inspiración web con IA. Describe el sitio que buscas y obtén inspiración real + plantillas + herramientas con screenshots en vivo.

## Setup en 3 pasos

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar API Key
Edita `.env.local` y reemplaza con tu key real:
```
ANTHROPIC_API_KEY=sk-ant-...
```
Consigue tu key en: https://console.anthropic.com

### 3. Correr en desarrollo
```bash
npm run dev
```
Abre http://localhost:3000

## Deploy en Vercel

```bash
npm install -g vercel
vercel
```
Agrega `ANTHROPIC_API_KEY` en las variables de entorno de Vercel.

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Anthropic SDK (servidor)
- Microlink / Thum.io para screenshots

## Estructura
```
app/
  api/
    search/route.ts      ← Claude API (server-side)
    screenshot/route.ts  ← Screenshot proxy (server-side)
  page.tsx               ← App principal
  layout.tsx
  globals.css
components/
  Screenshot.tsx         ← Componente de preview con fallback
  ResultCard.tsx         ← Card de resultado
  DetailModal.tsx        ← Modal de detalle
lib/
  types.ts               ← TypeScript types
  useLocalStorage.ts     ← Hook persistencia
```
