#!/usr/bin/env bash
set -euo pipefail
REMOTE="suez"          # atalho do ~/.ssh/config (ou suez@192.109.11.49)
DEST="suezacademy.ao/"   # pasta no servidor

npm run build
rsync -avz --delete --exclude='.well-known' --exclude='cgi-bin' --exclude='.htaccess' \
  out/ "$REMOTE:$DEST"
echo "✅ Publicado em $DEST"