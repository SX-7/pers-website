#!/bin/bash
python -m venv .venv
source .venv/bin/activate
pip install -r app/requirements.txt --require-virtualenv --disable-pip-version-check
export DEVELOPMENT_ENV="True"
echo ""
echo "Remember to also run:"
echo "tailwindcss -i ./app/static/css/style.css -o ./app/static/css/tailwind.css --watch"
echo "for hot reload of css!"
echo ""
flask --app app/main.py run --reload