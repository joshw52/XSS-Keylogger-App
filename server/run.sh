#!/bin/bash

# Clean up previous runs
rm -rf __pycache__/ instance/ migrations/ venv/

# Run database setup
python3 manage.py

# Start Flask app
FLASK_APP=routes.py FLASK_DEBUG=1 FLASK_ENV=development flask run --host=0.0.0.0
