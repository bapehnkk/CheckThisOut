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

### Install FFmpeg on linux with apt

#### Step 1: Update the Repository
Update and upgrade the system packages to get the FFmpeg version currently available in the repository. Execute the following command:

```
sudo apt update && sudo apt upgrade
```


#### Step 2: Install FFmpeg
After upgrading the repository, install FFmpeg by running the following:

```
sudo apt install ffmpeg
```
#### Step 3: Verify the Installation
Confirm that FFmpeg has been installed with:


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
