#!/bin/bash

rm -rf __pycache__/ instance/ migrations/ venv/
python3 manage.py
FLASK_APP=routes.py FLASK_DEBUG=1 FLASK_ENV=development flask run
