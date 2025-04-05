# ใช้ base image ที่มี Python 3.10 แบบเล็ก ประหยัดพื้นที่
FROM python:3.10-slim

# ติดตั้ง system dependencies ที่จำเป็นสำหรับ OpenCV
RUN apt-get update && apt-get install -y \
    build-essential \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# ตั้ง working directory
WORKDIR /app

# คัดลอกไฟล์ทั้งหมดเข้าไปใน container
COPY . .

# ติดตั้ง Python packages
RUN pip install --no-cache-dir -r requirements.txt

# เปิด port 5000 (Flask default)
EXPOSE 5000

# คำสั่งรันแอป Flask
CMD ["python", "src/app.py"]
