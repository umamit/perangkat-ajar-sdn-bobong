#!/bin/bash
# Perangkat Ajar SD Negeri Bobong — Skrip Jalankan Lokal
# Usage: ./run.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🎨 Mengompilasi CSS Tailwind..."
node_modules/.bin/tailwindcss -i style.css -o static/css/style.css --minify

echo "📋 Menyalin CSS komponen & responsif..."
cp style-components.css static/css/style-components.css
cp style-responsive.css static/css/style-responsive.css

echo "✅ CSS siap!"
echo ""
echo "🚀 Menjalankan Flask server di http://127.0.0.1:5000"
venv/bin/python api/index.py
