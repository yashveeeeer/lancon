# Backend/Dockerfile
FROM python:3.12-slim


# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose backend port
EXPOSE 8000

# Start the backend
CMD ["uvicorn", "main:app", "--host", "0.0.0.0.", "--port", "8000"]