# Factory Brain v2 (Electron Orchestration) — Test Build

Runnable **Hướng B** scaffold:
- **Electron** = host orchestration + UI dashboard
- **Core Service (local)** = layout/trust/preview/rip API on localhost
- **UXP** = bridge placeholder (not required to test)

## Quick start (Dev)
1) Install Node.js 18+ (recommended 20+)
2) In this folder:
```bash
npm install
npm run dev
```

## Build Windows EXE (Portable)
```powershell
npm run build:win
```

Artifacts in `dist/`:
- `FactoryBrain-v2-Portable-win.zip` (portable zip)
- `FactoryBrain v2 Setup *.exe` (installer)

## Core API
- Health: `http://127.0.0.1:17890/api/health`
