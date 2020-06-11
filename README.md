# Itorum test app

## About <a name = "about"></a>

Really simple CRM written with Django and React

## Prerequisites

Python 3, Django, virtualenv

## Installing

```
git clone https://github.com/IntAlgambra/itorum.git

cd itorum

virtualenv venv
```
Activate virtual environment on windows:
```
venv\Scripts\activate
```
On Linux:
```
source venv/bin/activate
```
Install python dependencies
```
pip install -r requirements.txt
```
Make and apply migrations
```
cd itorum
python manage.py makemigrations
python manage.py migrate
```
Load test data:
```
python manage.py loaddata users.json
python manage.py loaddata customers.json
python manage.py loaddata orders.json
```

## Usage

Run django dev server:
```
python manage.py runserver
```

To log in use:
```
username: user_3
password: 12345
```

