# GIMO WEB

Landing de GIMO construida con:

- **Next.js (App Router + TypeScript + Tailwind)**
- **Sanity** como CMS (Studio separado con `sanity dev`)
- **Firebase Auth (Google Sign-In)** para autenticación
- **Vercel** para despliegue

## 1) Instalación

```bash
npm install
```

## 2) Variables de entorno

Copia el ejemplo y completa valores:

```bash
copy .env.example .env.local
```

Variables necesarias:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` (normalmente `production`)
- `NEXT_PUBLIC_SANITY_API_VERSION` (ejemplo: `2026-01-01`)
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## 3) Arrancar en local

```bash
npm run dev
```

- Web: `http://localhost:3000`

En otro terminal, para abrir Sanity Studio:

```bash
npm run sanity
```

- Sanity Studio: `http://localhost:3333`

## 4) Configurar Sanity rápido

1. Crea proyecto/dataset en Sanity.
2. Rellena `NEXT_PUBLIC_SANITY_PROJECT_ID` y dataset.
3. Entra al Studio (`http://localhost:3333`) y crea/edita:
   - `siteSettings`
   - `landingPage`

Si no hay contenido en Sanity, la web usa **fallbacks locales** para no romper diseño.

## 5) Firebase Auth con Google (sprint mode 🚀)

1. Ve a [Firebase Console](https://console.firebase.google.com/) y crea proyecto.
2. En **Authentication > Sign-in method**, activa **Google**.
3. En **Project settings > Your apps**, registra app web y copia credenciales.
4. Pega las credenciales en `.env.local` usando las variables `NEXT_PUBLIC_FIREBASE_*`.
5. En Firebase Auth, añade tus dominios autorizados:
   - `localhost`
   - tu dominio de Vercel (`*.vercel.app` o dominio custom)

Con eso el botón **Sign in Google** del navbar funcionará.

## 6) Deploy en Vercel

1. Importa el repo en Vercel.
2. Añade las mismas variables de entorno de `.env.local` en **Project Settings > Environment Variables**.
3. Deploy.

## Scripts

- `npm run dev` → desarrollo
- `npm run build` → build producción
- `npm run start` → arranque producción
- `npm run lint` → lint
- `npm run sanity` → sanity dev (CLI)
- `npm run sanity:deploy` → deploy de Sanity Studio
