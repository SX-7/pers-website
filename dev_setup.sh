#!/bin/bash

echo 'Activate venv, install dev deps'
python -m venv .venv
source .venv/bin/activate
pip install -r app/requirements.txt --require-virtualenv --disable-pip-version-check --progress-bar on --quiet
npm install --no-fund --no-audit
echo ''

echo 'Seting up config files and env vars...'
echo 'plugins:' > .prettierrc
echo '  - "prettier-plugin-tailwindcss"' >> .prettierrc
cp .gitignore .prettierignore
export DEVELOPMENT_ENV="True"

echo 'Starting flask and tailwind...'
echo -e 'Flask will need to be shut down manually, run "\033[4;31mkillall -9 python\033[0m" after CTRL+C!'
echo ''
{ flask --app app/main.py run --reload --extra-files app/static/css/tailwind.css & npx @tailwindcss/cli -i ./app/static/css/style.css -o ./app/static/css/tailwind.css --watch; }