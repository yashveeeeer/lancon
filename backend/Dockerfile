# Use official NVIDIA CUDA runtime with cuDNN (for GPU acceleration)
FROM nvidia/cuda:12.2.2-cudnn8-runtime-ubuntu22.04

# Prevent prompts during install
ENV DEBIAN_FRONTEND=noninteractive

# Set working directory
WORKDIR /app

# Install Python, pip, ffmpeg, git (needed for whisper)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip ffmpeg git && \
    rm -rf /var/lib/apt/lists/*

# Make 'python' and 'pip' point to python3
RUN ln -sf /usr/bin/python3 /usr/bin/python && \
    ln -sf /usr/bin/pip3 /usr/bin/pip

# Copy and install dependencies
RUN python -m pip install --upgrade pip setuptools wheel

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose backend port
EXPOSE 8000

# Start the backend
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]