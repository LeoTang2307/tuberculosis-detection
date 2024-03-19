FROM python:3.11

WORKDIR /app/backend

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

CMD ["python", "main.py"]

EXPOSE 8000