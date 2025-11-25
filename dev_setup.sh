#!/bin/bash
echo 'Activate venvs, install dev deps'
echo ''
python -m venv .venv
source .venv/bin/activate
pip install -r app/requirements.txt --require-virtualenv --disable-pip-version-check
npm install
echo ''
echo 'Seting up config files and env vars...'
echo ''
echo 'plugins:' > .prettierrc
echo '  - "prettier-plugin-tailwindcss"' >> .prettierrc
cp .gitignore .prettierignore
export DEVELOPMENT_ENV="True"
echo ""
echo "Starting flask and tailwind..."
echo ""
{ flask --app app/main.py run --reload & npx tailwindcss -i ./app/static/css/style.css -o ./app/static/css/tailwind.css --watch; }