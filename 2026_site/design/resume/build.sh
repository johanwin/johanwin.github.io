#!/bin/sh
# Rebuild public/resume.pdf from design/resume/resume.html with headless Chrome.
# Text stays real and selectable (ATS / AI friendly); the PDF is tagged and outlined.
set -e
cd "$(dirname "$0")/../.."
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
"$CHROME" --headless=new --disable-gpu --allow-file-access-from-files \
  --no-pdf-header-footer --export-tagged-pdf --generate-pdf-document-outline \
  --virtual-time-budget=4000 \
  --print-to-pdf="public/resume.pdf" "file://$PWD/design/resume/resume.html" 2>/dev/null
echo "Wrote public/resume.pdf"
