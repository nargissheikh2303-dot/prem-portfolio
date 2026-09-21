#!/bin/bash
cd "$(dirname "$0")"
command -v node >/dev/null && node build-images.js
echo "Serving on http://localhost:5500  —  press Ctrl+C to stop"
(sleep 1 && open http://localhost:5500) &
python3 -m http.server 5500
