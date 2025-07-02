FROM python:3.11-alpine

WORKDIR /app

RUN apk update && apk upgrade && \
    apk add --no-cache \
    build-base \
    python3-dev \
    musl-dev \
    linux-headers \
    pcre-dev \
    openssl-dev

RUN python -m pip install --upgrade pip

COPY requirements.txt .
RUN python -m pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

CMD ["python", "manage.py", "runserver", "0.0.0.0:80"]
