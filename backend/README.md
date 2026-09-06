# VoiceBridge Backend

## Run

From the repository root:

```bash
npm run server:dev
```

The API listens on `http://localhost:4000`.

## Endpoints

- `GET /api/health`
- `POST /api/registrations`
- `GET /api/registrations`
- `POST /api/analyze`
- `GET /api/grievances`
- `POST /api/grievances`

The demo backend stores grievances in `backend/data/grievances.json` and registrations in `backend/data/voicebridge.sqlite`. Registration passwords are hashed before storage. Gemini credentials stay in the root `.env` file and are never sent to the browser.
