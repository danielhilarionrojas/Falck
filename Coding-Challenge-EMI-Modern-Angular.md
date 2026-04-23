Coding Challenge EMI: Modern Angular

Task Management Application

Welcome to the Technical Assessment. This challenge is designed to evaluate your proficiency with the Modern Angular ecosystem. We focus on reactive patterns, performance, and clean architecture.

## Task 1: Project Setup (Suggested)

Initialize a new Angular project using the Angular CLI. While you may use an existing boilerplate, we suggest setting it up from scratch to demonstrate your preferred initial configuration.

## Technical Requirements

### 1. Atomic Components & Signals

- Create a reusable TaskComponent.
- Display task details: title, description, due date, state, and an expandable notes section.

### 2. Reactive List & New Control Flow

- Implement TaskListComponent using the New Control Flow syntax (`@for`, `@if`, `@empty`).
- Manage the state of the list using a Signal or SignalStore.
- Implement pagination (5 tasks per page) using `computed()` signals to derive the current view.

### 3. Modern Forms & Validations

- Develop a TaskForm using Reactive Forms.
- Implement a dynamic "Notes" array where at least one field is strictly required.

### 4. Architecture & Data Access

- Use `inject()` for Dependency Injection (DI) instead of constructor-based injection.
- Consume the provided `db.json` to mock data.
- Handle asynchronous data by converting Observables to Signals using `toSignal()` where appropriate.

## Senior Challenges

### 5. Unit Testing with Signals

- Write unit tests for the TaskListComponent logic.
- Ensure tests cover Signal state transitions and computed values.

### 6. Performance & UX

- Implement Deferred Loading using `@defer` blocks for heavy components or non-critical UI sections.
- Handle API errors gracefully using a functional HttpInterceptor.

## Evaluation Criteria

- Effective use of `computed()` and `effect()`.
- Knowledge of `track` in `@for` loops for DOM performance.
- Clean code, separation of concerns, and type safety (TypeScript).
