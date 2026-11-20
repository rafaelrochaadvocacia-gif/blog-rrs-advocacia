#!/usr/bin/env bash
# Envia a capa (.webp) para a URL de upload gerada pelo Wix e mostra o hash local.
# Uso: scripts/upload_capa.sh "<uploadUrl>" areas/<AREA>/capas/capa-<slug>.webp
# A <uploadUrl> vem de POST /site-media/v1/files/generate-upload-url (passo P7).
set -euo pipefail
url="${1:?uso: upload_capa.sh <uploadUrl> <arquivo.webp>}"
arq="${2:?uso: upload_capa.sh <uploadUrl> <arquivo.webp>}"
case "$url" in https://upload.wixmp.com/upload/*) ;; *) echo "URL recusada: só upload.wixmp.com" >&2; exit 2;; esac
case "$arq" in areas/*/capas/capa-*.webp) ;; *) echo "Arquivo recusado: use areas/<AREA>/capas/capa-<slug>.webp" >&2; exit 2;; esac
[ -f "$arq" ] || { echo "Arquivo não encontrado: $arq" >&2; exit 2; }
nome="$(basename "$arq")"
curl -sS -m 120 -X PUT -H "Content-Type: image/webp" --data-binary @"$arq" "${url}?filename=${nome}"
echo
echo "md5 local: $(md5sum "$arq" | cut -d' ' -f1)"
