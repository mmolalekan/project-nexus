import os
import dj_database_url
from dotenv import load_dotenv


load_dotenv()  # loads .env
DATABASES = {
    'default': {
        'ENGINE': os.environ.get("ENGINE"),
        'NAME': os.environ.get("NAME"),
        'USER': os.environ.get("USER_NAME"),
        'HOST': os.environ.get("HOST"),
        'PASSWORD': os.environ.get("PASSWORD"),
        'PORT': os.environ.get("PORT"),
    }
}

# database_url = os.environ.get('DATABASE_URL')
# DATABASES['default'] = dj_database_url.parse(database_url) #install dj_database_url

# Documentation
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases
