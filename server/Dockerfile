# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=routes.py
ENV FLASK_ENV=development
ENV FLASK_DEBUG=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create directories for database and migrations
RUN mkdir -p instance migrations

# Expose port 5000
EXPOSE 5000

# Run database setup and start the application
CMD ["sh", "-c", "python3 manage.py && flask run --host=0.0.0.0 --port=5000"]
