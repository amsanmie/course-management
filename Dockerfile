FROM python:3.7-alpine

COPY ./requirements.txt /requirements.txt

RUN pip install -r requirements.txt
RUN pip install connexion'[swagger-ui]'

WORKDIR /

COPY . /

CMD ["python3", "server.py"]
