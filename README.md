# Module Context: Juegos — Frontend

## Metadata del Proyecto
- **Scope:** `juegos/front/`
- **Puerto:** `3000` (Next.js dev) — confirmar con el equipo de wallet si hay conflicto
- **Framework:** Next.js 14 (App Router), React, TypeScript
- **Estilos:** Tailwind CSS
- **Estado global:** Zustand
- **Animaciones:** Framer Motion
- **Módulos relacionados:** Games Backend (puerto 3001), Wallet Service (puerto 3000)

## Estado Actual
- **Ruleta UI:** ✅ Completa — rueda animada, mesa de apuestas, selector de fichas
- **Blackjack UI:** ⏳ Página registrada en home, sin implementar
- **Wallet Store:** ✅ Conectado al Games Backend
- **Historial UI:** ❌ No implementado en este módulo

---

## Estructura de Carpetas

```
juegos/front/
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Layout global con Navbar
│   │   ├── page.tsx                 # Home — lista de juegos disponibles
│   │   └── roulette/
│   │       └── page.tsx             # Página principal de la ruleta (orquestador)
│   ├── components/
│   │   ├── Navbar.tsx               # Barra de navegación con saldo en tiempo real
│   │   └── roulette/
│   │       ├── RouletteWheel.tsx    # Rueda animada con Framer Motion
│   │       ├── BettingTable.tsx     # Mesa de apuestas (tablero 3×12 + apuestas externas)
│   │       └── ChipSelector.tsx     # Selector de valor de ficha
│   ├── core/
│   │   └── engines/
│   │       └── roulette.engine.ts   # Utilidades de UI (colores, formato de números)
│   ├── store/
│   │   └── wallet.store.ts          # Estado global del saldo del usuario (Zustand)
│   └── pkg/
│       └── utils.ts                 # cn() para clases condicionales con Tailwind
├── .env.local                       # Variables de entorno locales (no commitear)
└── package.json
```

---

## Variables de Entorno

Crear `frontend/.env.local` (no commitear):

```env
NEXT_PUBLIC_GAMES_API_URL=http://localhost:3001
```

| Variable                    | Descripción                          | Default                     |
|-----------------------------|--------------------------------------|-----------------------------|
| `NEXT_PUBLIC_GAMES_API_URL` | URL base del Games Backend           | `http://localhost:3001`     |

> **Importante:** En Next.js, solo las variables con prefijo `NEXT_PUBLIC_` son accesibles en el cliente.

---

## Componentes

### `roulette/page.tsx` — Orquestador principal
Maneja todo el estado de una sesión de ruleta. Es el único componente con lógica de red.

**Estado interno:**
```typescript
selectedChip: number       // valor de ficha seleccionada (5, 10, 25, 50, 100, 500)
bets: Bet[]                // apuestas acumuladas antes de girar
isSpinning: boolean        // bloquea la UI durante la animación
winningNumber: number|null // número ganador recibido del backend (-1 = 00)
pendingResult: any         // resultado guardado hasta que termina la animación
lastResult: any            // resultado mostrado al usuario tras la animación
spinError: string|null     // mensaje de error de red visible al usuario
```

**Flujo de una jugada:**
```
Usuario hace clic en GIRAR
    │
    ├─► setIsSpinning(true), setSpinError(null)
    ├─► POST /games/bet → { userId, amount, gameType: 'roulette', selection: bets }
    │       │
    │       ├─ Si error: setSpinError(msg), setIsSpinning(false) ← libera UI
    │       └─ Si ok:    setPendingResult(data), setWinningNumber(data.winningSelection)
    │
    ▼
RouletteWheel anima hasta el número ganador
    │
    └─► onSpinComplete() callback
            ├─► setIsSpinning(false)
            ├─► setLastResult(pendingResult)
            └─► fetchBalance() ← actualiza saldo
```

---

### `RouletteWheel.tsx` — Rueda animada

**Props:**
```typescript
spinning: boolean          // activa la animación
winningNumber: number|null // número destino (-1 para 00)
onSpinComplete: () => void // callback al terminar la animación
```

**Comportamiento importante:**
- Solo anima cuando `spinning === true` Y `winningNumber !== null` simultáneamente.
- `setRotation` acumula rotaciones en vez de resetear — evita que en la segunda jugada la rueda gire hacia atrás.
- El número `-1` (backend) se muestra como `00` en la UI.
- `onAnimationComplete` tiene guardia `if (!spinning) return` para evitar dispararse en renders innecesarios.

**Orden de números en la rueda (europeo):**
```typescript
const ROULETTE_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36,
  11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9,
  22, 18, 29, 7, 28, 12, 35, 3, 26, -1  // -1 = 00
];
```

---

### `BettingTable.tsx` — Mesa de apuestas

Layout real de tablero de ruleta: **3 filas × 12 columnas** + columna del 0.

```
Col:  [  0  ] [ 3 ][ 6 ][ 9 ]...[ 36 ]   ← fila 1 (top)
      [  0  ] [ 2 ][ 5 ][ 8 ]...[ 35 ]   ← fila 2 (middle)
      [  0  ] [ 1 ][ 4 ][ 7 ]...[ 34 ]   ← fila 3 (bottom)
      [  1st 12  ][  2nd 12  ][  3rd 12  ]
      [ 1-18 ][ EVEN ][ RED ][ BLK ][ ODD ][ 19-36 ]
```

**Tipos de apuesta que emite `onPlaceBet`:**
```typescript
{ type: 'straight', value: 17 }          // número exacto
{ type: 'outside',  value: 'red' }       // color
{ type: 'outside',  value: 'even' }      // paridad
{ type: 'outside',  value: '1-18' }      // mitad
{ type: 'dozen',    value: '1st-12' }    // docena
```

---

### `ChipSelector.tsx` — Selector de fichas

Valores disponibles: `[5, 10, 25, 50, 100, 500]`

La ficha seleccionada se aplica a cada clic en la mesa. Si ya existe una apuesta en ese espacio, acumula el valor encima.

---

### `Navbar.tsx` — Barra de navegación

Hace polling del saldo cada 5 segundos con `setInterval` para mantenerlo actualizado en tiempo real. En producción esto debería reemplazarse con el WebSocket del Wallet (`join_wallet_room` → evento `balance_updated`).

---

### `roulette.engine.ts` — Utilidades de UI

Este archivo **no calcula resultados** — eso lo hace el backend. Solo provee funciones de presentación compartidas entre componentes:

```typescript
export const RED_NUMBERS: number[]
export function getNumberColor(num: number): 'red' | 'black' | 'green'
export function getNumberBgClass(num: number): string   // clase Tailwind
export function formatRouletteNumber(num: number): string  // -1 → '00'
```

Importar desde `@/core/engines/roulette.engine` en cualquier componente que necesite colorear números.

---

### `wallet.store.ts` — Estado global del saldo

```typescript
// Estado
chips: number        // fichas actuales del usuario
balance: number      // alias de chips (compatibilidad)
isLoading: boolean
error: string | null
userId: string       // hardcodeado hasta integración con Auth

// Acciones
fetchBalance()       // GET /wallet/balance/:userId vía Games Backend
setUserId(id)        // para cuando Auth entregue el userId real
```

**Importante:** El store llama al **Games Backend** (3001) como proxy, no directamente al Wallet Service (3000). Esto centraliza las llamadas y evita problemas de CORS entre el frontend y múltiples servicios.

---

## Plan de Integración con Otras Branches

### Con Auth (rama: auth)
**Estado:** ⏳ Pendiente — `userId` actualmente hardcodeado como `'user2'`.

**Qué necesita este módulo del equipo de Auth:**
- El `userId` del usuario autenticado (viene en el JWT como campo `sub` o `id`).
- Un helper o hook para leer el token (`useAuth()` o similar).

**Cambio necesario cuando Auth esté listo (1 archivo, 1 línea):**

```typescript
// wallet.store.ts — cambiar:
userId: 'user2',

// Por (dependiendo de cómo Auth exponga el userId):
userId: authStore.userId,  // si hay un store de auth
// o
userId: jwtDecode(localStorage.getItem('access_token')).sub,
```

**Coordinación requerida:**
- Preguntar al equipo de Auth: ¿el `userId` viene en el JWT? ¿Qué campo? ¿`sub`, `id`, `userId`?
- Preguntar: ¿exponen un hook/store para leer el usuario autenticado?
- El resto de este módulo no cambia — el `userId` ya fluye correctamente desde el store hacia todas las llamadas.

---

### Con Wallet (rama: wallet)
**Estado:** ✅ Funcional.

Este frontend **no llama directamente al Wallet Service**. Todas las operaciones de saldo pasan por el Games Backend como intermediario:

```
Frontend (3000) → Games Backend (3001) → Wallet Service (3000)
```

**El equipo de Wallet tiene un WebSocket Gateway** (`/wallet` namespace, evento `balance_updated`) que actualizaría el saldo en tiempo real. El Navbar actualmente usa polling cada 5 segundos como alternativa temporal.

**Para conectar el WebSocket del Wallet (mejora futura):**
```typescript
// En Navbar.tsx, reemplazar el setInterval por:
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/wallet');
socket.emit('join_wallet_room', { userId });
socket.on('balance_updated', ({ chips }) => setBalance(chips));
```

Esto requiere instalar `socket.io-client` en este proyecto.

---

### Con Historial (rama: historial)
**Estado:** ❌ No implementado en el frontend de juegos.

El historial de movimientos ya se registra automáticamente desde el Games Backend — cada jugada queda guardada en la colección `History` de Firestore vía el equipo de Historial.

**Si se quiere mostrar el historial en este frontend:**
- El equipo de Historial expone `GET /history/:user_id` que devuelve transacciones mapeadas.
- Se necesitaría crear una página `/historial` y un hook `useHistory(userId)`.
- Ver `MODULE_CONTEXT.md` del equipo de Historial para el schema de respuesta.

---

## Checklist de Estado

### Funcional ahora
- [x] Rueda animada que gira hasta el número correcto
- [x] Mesa de apuestas en layout real de tablero (3×12)
- [x] Apuestas múltiples acumulables (straight + outside + dozen en la misma jugada)
- [x] Selector de fichas (5, 10, 25, 50, 100, 500)
- [x] Saldo actualizado tras cada jugada
- [x] Mensaje de error visible si el backend no responde
- [x] Alerta visual si la apuesta supera el saldo
- [x] UI bloqueada durante el giro (no se puede apostar mientras gira)
- [x] Botón de recarga manual de fichas (para pruebas)

### Pendiente
- [ ] Reemplazar `userId: 'user2'` con userId real de Auth
- [ ] Conectar WebSocket del Wallet para saldo en tiempo real (reemplazar polling)
- [ ] Implementar UI de Blackjack
- [ ] Página de historial de jugadas
- [ ] Proteger rutas con guard de Auth cuando esté disponible

---

## Notas para Integradores

**Si el saldo siempre muestra 0:**
1. Verificar que `front/.env.local` exista con `NEXT_PUBLIC_GAMES_API_URL=http://localhost:3001`
2. Verificar que el Games Backend esté corriendo en el 3001
3. Abrir `http://localhost:3001/wallet/balance/user2` en el navegador — debe devolver `{ balance: 9500 }`

**Si la rueda no gira después de apostar:**
- Revisar la consola del navegador (F12) — si hay un error de red, `spinError` debería mostrarse en pantalla
- Verificar que el Games Backend (`3001`) esté activo

**Si el número ganador es -1:**
- Es el `00` de la ruleta americana — la UI lo muestra como `00`, comportamiento correcto
