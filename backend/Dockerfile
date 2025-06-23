FROM python:3.11

WORKDIR /app

RUN python -m pip install --upgrade pip

COPY requirements.txt .
RUN python -m pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

CMD python manage.py runserver 0.0.0.0:80
