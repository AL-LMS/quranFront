#!/usr/bin/env bash
# Explicit local-only, fake-SMS AL-LMS M3 V2 browser preview.
# Does not launch PostgreSQL/Docker, contact an SMS provider, or modify prod.
set -Eeuo pipefail
umask 077

FRONT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
BACK_DIR="${AL_LMS_M3_AUTH_V2_BACKEND_DIR:-$FRONT_DIR/../quranBack}"

if [[ ! -f "$BACK_DIR/app/auth_v2/dev_preview.py" ]]; then
  echo "STOP: Expected source-only quranBack checkout. Set AL_LMS_M3_AUTH_V2_BACKEND_DIR." >&2
  exit 1
fi
if [[ ! -x "$FRONT_DIR/node_modules/.bin/vite" ]]; then
  echo "STOP: Frontend dependencies missing. Run npm ci inside quranFront first." >&2
  exit 1
fi
if ! command -v openssl >/dev/null || ! command -v python3 >/dev/null; then
  echo "STOP: openssl and python3 are required for the local-only preview." >&2
  exit 1
fi
if ! (cd -- "$BACK_DIR" && python3 -c 'import fastapi, uvicorn'); then
  echo "STOP: Backend FastAPI/Uvicorn dependencies missing." >&2
  exit 1
fi

TEMP_DIR="$(mktemp -d)"
BACK_PID=""
FRONT_PID=""

cleanup() {
  original_status=$?
  trap - EXIT INT TERM
  if [[ -n "$FRONT_PID" ]]; then kill "$FRONT_PID" 2>/dev/null || true; fi
  if [[ -n "$BACK_PID" ]]; then kill "$BACK_PID" 2>/dev/null || true; fi
  if [[ -n "$FRONT_PID" ]]; then wait "$FRONT_PID" 2>/dev/null || true; fi
  if [[ -n "$BACK_PID" ]]; then wait "$BACK_PID" 2>/dev/null || true; fi
  # Only these exact files inside the newly created private temporary folder.
  rm -f -- "$TEMP_DIR/cert.pem" "$TEMP_DIR/key.pem" "$TEMP_DIR/fake-sms.txt"
  rmdir -- "$TEMP_DIR"
  exit "$original_status"
}
trap cleanup EXIT
trap 'exit 130' INT TERM

openssl req -x509 -nodes -newkey rsa:2048 -sha256 -days 1 \
  -keyout "$TEMP_DIR/key.pem" \
  -out "$TEMP_DIR/cert.pem" \
  -subj "/CN=127.0.0.1" \
  -addext "subjectAltName=IP:127.0.0.1" >/dev/null 2>&1

export AL_LMS_M3_AUTH_V2_LOCAL="synthetic-only"
export AL_LMS_M3_AUTH_V2_TLS_CERT="$TEMP_DIR/cert.pem"
export AL_LMS_M3_AUTH_V2_TLS_KEY="$TEMP_DIR/key.pem"
export VITE_ENABLE_M3_AUTH_V2_PREVIEW="true"

(
  cd -- "$BACK_DIR"
  exec python3 -m app.auth_v2.dev_preview \
    --inbox "$TEMP_DIR/fake-sms.txt" \
    --tls-cert "$TEMP_DIR/cert.pem" \
    --tls-key "$TEMP_DIR/key.pem"
) &
BACK_PID=$!

(
  cd -- "$FRONT_DIR"
  exec ./node_modules/.bin/vite --host 127.0.0.1 --port 15173 --strictPort
) &
FRONT_PID=$!

echo "Synthetic-only Persian auth preview: https://127.0.0.1:15173/__preview/m3-auth/signup"
echo "Use only the fictional test numbers: 09120000001, 09120000002, 09120000003"
echo "Read fake OTPs from the private inbox after requesting a code: $TEMP_DIR/fake-sms.txt"
echo "Local self-signed certificate: browser may ask you to trust it for this session."
echo "Press Ctrl+C to stop both servers and delete generated local TLS/inbox files."

# When either child exits, stop the other and remove this synthetic-only state.
wait -n "$BACK_PID" "$FRONT_PID"
