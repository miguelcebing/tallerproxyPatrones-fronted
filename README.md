# Taller Patrón Proxy — Frontend

Dashboard de observabilidad que consume la API del backend (`tallerproxyPatrones-backend`) para mostrar
métricas en tiempo real de tres microservicios monitoreados por un **Proxy de logging**: inventario,
pedidos y pagos.

> Es un taller de **logging**, no de login: no hay usuarios ni autenticación.

## Tecnologías

| Tecnología | Versión |
|---|---|
| React | 19 |
| Vite | 8 |
| Tailwind CSS | 4 (`@tailwindcss/vite`) |
| HeroUI | 3 (`@heroui/react` + `@heroui/styles`) |
| Recharts | 3 |
| Vitest | 5 |

## Cómo ejecutar en local

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 18 pruebas
npm run build    # genera dist/
```

En desarrollo, Vite redirige `/api/**` a `http://localhost:8080` (ver `vite.config.js`), así que no hace
falta definir variables si el backend corre en ese puerto.

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_BASE_URL` | URL pública del backend, **sin** barra final | `https://tallerproxy-backend.up.railway.app` |

Copia `.env.example` a `.env` para desarrollo. Las variables `VITE_*` se incorporan **en el build**: si
cambian, hay que volver a desplegar.

## Estructura

```
src/
├── api/            client.js (fetch + AbortController), services.js
├── hooks/          usePolling.js (setTimeout encadenado), useDashboardData.js
├── components/     ServiceCard, ResponseTimeChart, LogsTable, LogDetails, FilterBar,
│                   SimulateLoadButton, StatusBadge, ConnectionBanner, EmptyState, LoadingState,
│                   DashboardHeader
├── utils/          format.js, chartData.js, serviceStatus.js
├── styles/         index.css (tokens Tailwind v4 + HeroUI)
├── App.jsx
└── main.jsx
```

## Funcionalidad

- **Tarjetas por servicio** con total de llamadas, tasa de éxito y tiempo promedio. Si la tasa de error
  supera el 15 %, la tarjeta se marca en rojo **y** muestra el texto «Con problemas» (no depende solo del color).
- **Gráfica de líneas** (Recharts) con las últimas 20 llamadas de cada servicio.
- **Tabla de logs** con polling cada 3 segundos, paginación y filas expandibles (`tabIndex`, `Enter`/`Espacio`,
  `aria-expanded`) que muestran entrada, respuesta o error con stack trace.
- **Filtros** por servicio, estado y rango de fechas (`datetime-local` convertido a ISO-8601 UTC).
- **Simular carga** dispara `POST /api/metrics/simulate-load` y refresca el dashboard sin esperar el ciclo.
- Estados de **carga**, **vacío** y **error de conexión** (se conservan los últimos datos y se reintenta).
- Diseño responsive, foco visible y respeto de `prefers-reduced-motion`.

## Decisiones de diseño

- `usePolling` encadena `setTimeout` (no `setInterval`) para evitar peticiones solapadas y cancela con
  `AbortController` al desmontar o al cambiar filtros/página.
- La lógica de datos vive en hooks; los componentes solo pintan.
- El gráfico se carga con `React.lazy` para reducir el bundle inicial.
- HeroUI aporta Card, Button, Chip, Spinner y Skeleton; la tabla usa HTML semántico para controlar la
  expansión accesible de filas.
- Tokens de color en OKLCH definidos en `@theme` (Tailwind v4) y armonizados con `@heroui/styles`.

## Despliegue (Vercel)

1. Importar el repositorio `tallerproxyPatrones-fronted` (preset **Vite**).
2. Definir `VITE_API_BASE_URL` con la URL HTTPS del backend en Railway (sin `/` final).
3. Desplegar y actualizar `APP_CORS_ALLOWED_ORIGINS` en el backend con el dominio de Vercel.

URL de producción: _pendiente de configurar_.
