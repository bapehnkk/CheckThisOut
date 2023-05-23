# Backend services

## Django

```shell
.\venv\Scripts\activate.bat
python manage.py runserver
```
## Redis 

```shell
docker run --name redis-celery -p 6379:6379 -d redis
```
To check if Redis is running, you can run the command:

```shell
docker exec redis-celery redis-cli ping
```

## Celery

```shell
.\venv\Scripts\activate.bat
celery -A config worker --loglevel=info
```