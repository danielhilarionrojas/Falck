# Falck · Task Management

Task manager construido con **Angular 21** (standalone, signals, new control flow). Resuelve el reto _EMI Modern Angular_: crear, editar, completar, eliminar y paginar tareas, con formulario reactivo de notas dinamicas y testing unitario.

---

## Stack

- **Angular 21** — standalone components, `signal()`, `computed()`, `effect()`, `@if / @for / @defer`.
- **Reactive Forms** — `NonNullableFormBuilder`, `FormArray` tipado, validator custom.
- **HttpClient** — functional interceptor que normaliza errores a `ApiError`.
- **RxJS** — observables del service, `tap` en el store.
- **Vitest + jsdom** — runner por defecto del CLI 21.
- **ESLint (flat config)** + **Prettier**.
- **json-server 0.17** — mock API.

---

## Requisitos

- Node **22 LTS** (ver `.nvmrc`).
- npm `>= 10`.

---

## Correr el proyecto

```bash
npm install
npm run dev
```

Levanta en paralelo:

- **Web** → http://localhost:4200 (redirige a `/tasks`).
- **API** → http://localhost:3000 (json-server con `db.json`).

El dev server de Angular tiene configurado un proxy `/api -> http://localhost:3000`, asi que el frontend llama a `/api/tasks` y evita CORS.

### Scripts

| Script            | Descripcion                                       |
| ----------------- | ------------------------------------------------- |
| `npm start`       | Dev server Angular (`:4200`).                     |
| `npm run api`     | json-server (`:3000`) sobre `db.json`.            |
| `npm run dev`     | API + Web en paralelo (`concurrently`).           |
| `npm run build`   | Build de produccion.                              |
| `npm run lint`    | ESLint sobre TS + HTML (incluye a11y).            |
| `npm test`        | Tests en watch.                                   |
| `npm run test:ci` | Tests one-shot (sin watch).                       |

---

## Estructura

```
src/app/
├── core/
│   ├── errors/          ApiError + type guard
│   ├── interceptors/    errorInterceptor (funcional)
│   ├── models/          Task, TaskState, TaskDraft (readonly)
│   ├── services/        ErrorLogger (puerto swappable)
│   └── tokens/          API_BASE_URL InjectionToken
│
├── features/tasks/
│   ├── components/
│   │   ├── task/             TaskComponent     (atomic, OnPush)
│   │   ├── task-list/        TaskListComponent (container)
│   │   └── task-form/        TaskFormComponent (reactive forms)
│   ├── data/
│   │   ├── task.service.ts   HTTP adapter
│   │   └── task.store.ts     Signal store (state + computed)
│   └── pages/tasks-page/     TasksPageComponent (shell + @defer)
│
└── shared/
    └── validators/            minLengthArray
```

### Arquitectura en una linea

`Component (OnPush, signals) -> Store (signals + computed) -> Service (HttpClient) -> Interceptor -> API`

- **Tipos** fluyen de vuelta y los errores llegan normalizados como `ApiError`.
- **Estado** vive en el store; los componentes son deliberadamente _tontos_.
- **DI** siempre con `inject()` (el reto lo pide explicitamente).

---

## Decisiones tecnicas destacadas

- **Signal store custom** en `task.store.ts`: signals privados con `asReadonly()`, derivados `totalPages`, `pagedTasks`, `isEmpty`, `pageNumbers`. Paginacion de 5 por pagina como `computed`, tal cual pide el reto.
- **`@for (t of pagedTasks(); track t.id)`** — `track` por id (punto de evaluacion del reto).
- **`TaskDraft = Omit<Task, 'id' | 'stateHistory' | 'completed'>`** — modelo de escritura separado del de lectura. Los formularios no construyen entidades completas.
- **`API_BASE_URL`** como `InjectionToken` → testeable (`provide: API_BASE_URL, useValue: '/api'`).
- **Functional interceptor** — cualquier `HttpErrorResponse` se transforma en `ApiError { status, message, url, cause }` y se loguea en `ErrorLogger`. La UI nunca ve `HttpErrorResponse`.
- **`@defer (on viewport)`** alrededor del form → chunk lazy (~44 kB) descargado al entrar al viewport, con `@placeholder` y `@loading (minimum 200ms)`.
- **Edit flow con `effect()`** — el form tiene `task = input<Task | null>()`; un `effect()` sincroniza el FormGroup cuando cambia el input. Entrar a editar es set del signal, cancelar es set a null. `markForCheck()` asegura que el `FormArray` re-renderice bajo OnPush.
- **Design tokens CSS** — paleta, spacing, radii, shadows, tipografia (Inter) expuestos como `var(--...)` en `styles.scss`. Un solo lugar para rebrandear.
- **A11y** — `aria-busy`, `aria-current`, `aria-label`, `role="status" / "alert"`, `<time datetime>`, focus ring global via `:focus-visible`.

---

## Tests

```bash
npm run test:ci
```

Cobertura:

- **`TaskStore`** — estado inicial, `load()` ok y con error normalizado, `totalPages` y `pagedTasks` con 12 tasks / 3 paginas, clamp de `goToPage`, `create/update/remove`, ajuste de `pageIndex` al borrar la ultima task de la pagina actual.
- **`TaskListComponent`** — empty state, render + paginacion visible, navegacion por click en numero de pagina.
- **`minLengthArray`** — array corto, array suficiente, no-op sobre controles no-`FormArray`.
- **`App`** — componente raiz renderiza `<router-outlet>`.

17 tests en 4 suites, runner Vitest + jsdom.

---

## Troubleshooting

- **Puerto 3000 ocupado**: detener el proceso existente o cambiar `--port` en el script `api` (y replicar en `proxy.conf.json`).
- **CORS en browser** pero `curl` OK: hard refresh (`Cmd+Shift+R`) para limpiar cache de preflight.
- **Tareas no se ven**: confirmar que `json-server` levanto en `:3000`. El log de `npm run dev` debe mostrar `[API] JSON Server started on PORT :3000`.

---

## Mapeo con el reto

| Requisito                                           | Implementacion                                                 |
| --------------------------------------------------- | --------------------------------------------------------------- |
| 1. Atomic Components & Signals                      | `TaskComponent` con `input.required` + `output()` + `computed` |
| 2. Reactive List & New Control Flow                 | `TaskListComponent` con `@for / @if / @empty` y `track id`      |
| 2. Paginacion 5/pagina via `computed()`             | `TaskStore.pagedTasks` + `totalPages`                           |
| 3. Modern Forms & Validations + Notes FormArray     | `TaskFormComponent` tipado + validator `minLengthArray(1)`      |
| 4. `inject()`, consumo de `db.json`, `toSignal()`   | DI solo via `inject()`; json-server sirve `db.json`             |
| 5. Unit Testing with Signals                        | 17 tests; signal transitions + computed cubiertos               |
| 6. Performance & UX (`@defer` + HttpInterceptor)    | `@defer (on viewport)` en form + `errorInterceptor` funcional   |
