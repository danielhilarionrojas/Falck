# Paso a paso del challenge

Avance del reto Falck (Modern Angular). Cada seccion = una iteracion con comandos, decisiones y resultado.

---

## Paso 1 - Creacion del proyecto `falck`

Scaffold con Angular CLI 21.2.8 (ultima estable). Arranca con defaults modernos: standalone, signals, new control flow, strict TS/templates, Prettier, Vitest.

### Comandos

```bash
npx --yes @angular/cli@latest new falck \
  --style=scss --ssr=false --package-manager=npm \
  --skip-git --routing --defaults

cd falck
npx --yes ng add @angular-eslint/schematics@latest --skip-confirmation
npm run lint
```

### Decisiones

- `--ssr=false`: SPA con mock API, SSR no aporta al reto.
- `--skip-git`: el repo git esta en la raiz `Falck/`, no en el subproyecto.
- `ng add @angular-eslint/schematics`: genera flat config (`eslint.config.js`) con presets TS + HTML (a11y incluida) y registra `npm run lint`.
- `.nvmrc` con `22` y `engines` en `package.json` para fijar runtime (Node 22 LTS).

### Resultado

- `npm run lint` pasa sin errores.
- Stack listo: standalone + signals + control flow + strict + ESLint + Prettier + Vitest.
- Base preparada para mock API y feature de tasks en los siguientes pasos.

> Nota: entorno actual corre Node 23 (rama impar). Para produccion usar Node 22 LTS.
