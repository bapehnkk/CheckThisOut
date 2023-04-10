# Backend
#### Used by Django Rest Framework

## Installation

Recommend Python 3.10.

### Install Python dependencies

Create a virtual environment:
```
python3 -m pip install virtualenv
```

Installing a virtual environment in the current directory:
```
python3 -m virtualenv venv
```

To activate that, just type:
```
source venv/scripts/activate
```

To activate that, just type:
```
python3 -m pip install -r /path/to/requirements.txt
```

## Launch of the project

### Create DB migrations
```
python3 manage.py makemigrations 
python3 manage.py migrate 
```
### Create superuser
```
python3 manage.py createsuperuser
```

### Run Django server
```
python3 manage.py runserver 
```
