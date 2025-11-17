#!/usr/bin/env bash
set -euo pipefail

# Generate a self-signed cert/key pair for code-server in the lab plugin.
# Output: plugins/teacher-course-lab/certs/local-cert.pem and local-key.pem

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CERT_DIR="$ROOT/certs"
CERT_FILE="$CERT_DIR/local-cert.pem"
KEY_FILE="$CERT_DIR/local-key.pem"

mkdir -p "$CERT_DIR"

if command -v openssl >/dev/null 2>&1; then
  echo "🔐 Generating self-signed cert in $CERT_DIR"
  openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
    -keyout "$KEY_FILE" \
    -out "$CERT_FILE" \
    -subj "/CN=localhost"
  echo "✅ Cert created:"
  ls -l "$CERT_FILE" "$KEY_FILE"
else
  echo "❌ openssl not found. Please install it and re-run this script."
  exit 1
fi

echo
echo "Set these env vars (or rely on the defaults already wired in spawner.mjs):"
echo "  TCLAB_CS_PROTOCOL=https"
echo "  TCLAB_CS_TLS_CERT=$CERT_FILE"
echo "  TCLAB_CS_TLS_KEY=$KEY_FILE"
echo
echo "Then restart your lab session."
