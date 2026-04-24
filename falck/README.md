# Falck

Task management app built with Angular 21 (standalone, signals, new control flow). Solves the **EMI Modern Angular** challenge.

## Stack

- Angular 21 (standalone, signals, `@if`/`@for`/`@defer`)
- Reactive Forms con `NonNullableFormBuilder` + `FormArray` tipado
- `HttpClient` + functional error interceptor
- Vitest + jsdom para tests
- `json-server` como mock API

## Requisitos

- Node 22 LTS (ver `.nvmrc`)
- npm >= 10

## Correr en local

```bash
npm install
npm run dev
```

Levanta en paralelo:

- **API** (json-server) → `http://localhost:3000`
- **Web** (Angular) → `http://localhost:4200`

O por separado:

```bash
npm run api     # solo mock API
npm start       # solo frontend (asume API ya corriendo)
```

## Scripts

| Script            | Uso                                                |
| ----------------- | -------------------------------------------------- |
| `npm start`       | Dev server (`http://localhost:4200`)               |
| `npm run api`     | json-server con `db.json` (`:3000`)                |
| `npm run dev`     | API + Web en paralelo (`concurrently`)             |
| `npm run build`   | Build de produccion                                |
| `npm run lint`    | ESLint (TS + HTML + a11y)                          |
| `npm test`        | Tests en watch                                     |
| `npm run test:ci` | Tests one-shot (CI)                                |

## Estructura

```
src/app/
├── core/
│   ├── errors/          ApiError + type guard
│   ├── interceptors/    errorInterceptor funcional
│   ├── models/          Task, TaskState, TaskDraft (tipos readonly)
│   ├── services/        ErrorLogger (puerto)
│   └── tokens/          API_BASE_URL InjectionToken
├── features/tasks/
│   ├── components/
│   │   ├── task/              TaskComponent (atomico, OnPush)
│   │   ├── task-list/         TaskListComponent (container)
│   │   └── task-form/         TaskFormComponent (reactive forms)
│   ├── data/
│   │   ├── task.service.ts    HTTP adapter
│   │   └── task.store.ts      Signal store (state + computed)
│   └── pages/tasks-page/      TasksPageComponent (shell + @defer)
└── shared/
    └── validators/             minLengthArray (FormArray validator)
```

## Proceso paso a paso

Ver `../paso-a-paso-del-challenge.md` (raiz del repo) para la narracion tecnica completa iteracion por iteracion.
