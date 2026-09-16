

from pathlib import Path
from datetime import timedelta

import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# ------------------------------------------------------------------
# DEPLOYMENT: production settings environment variable diye control hobe
# Local dev: kichu set korte hobe na â€” ager motoi cholbe
# ------------------------------------------------------------------
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-)(02euk67d_lk(!wimyqo*q@f*z*n8bj!kwpie!1#2==9qa5(g')
DEBUG = os.environ.get('DJANGO_DEBUG', 'True') == 'True'

RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS', '').split(',') if os.environ.get('DJANGO_ALLOWED_HOSTS') else []
if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)

# CORS: frontend URL environment variable theke asbe (comma diye multiple)
CORS_ALLOWED_ORIGINS = [o for o in os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',') if o]
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS.copy()

AUTH_USER_MODEL = 'Ecommerce.User'
# Application definition

INSTALLED_APPS = [

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'drf_yasg',
    'django_filters',
    'Ecommerce',
    'corsheaders',

]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # CommonMiddleware er upore rakhte hobe
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # static file serve korbe production e
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Compress static files (whitenoise)
STORAGES = {
    'default': {
        'BACKEND': 'django.core.files.storage.FileSystemStorage',
    },
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
    },
}

# Media files (user-uploaded images, e.g. product images)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'



# SSLCommerz Sandbox Credentials
SSLCOMMERZ_STORE_ID = 'testbox'  # Sandbox Store ID
SSLCOMMERZ_STORE_PASSWORD = 'qwerty'  # Sandbox Password
SSLCOMMERZ_IS_SANDBOX = True  # Testing Mode
SSLCOMMERZ_CALLBACK_BASE_URL = 'https://outsource-sulk-coping.ngrok-free.dev'


# JWT TOKEN AR KAHINI
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS': 'Ecommerce.pagination.StandardResultsSetPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
    ),
}



SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),   # à§§ à¦˜à¦£à§à¦Ÿà¦¾ à¦ªà¦° à¦à¦•à§à¦¸à§‡à¦¸ à¦Ÿà§‹à¦•à§‡à¦¨ à¦®à§‡à§Ÿà¦¾à§‹à¦¦à§‹à¦¤à§à¦¤à§€à¦°à§à¦£ à¦¹à¦¬à§‡
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),       # à§­ à¦¦à¦¿à¦¨ à¦ªà¦° à¦°à¦¿à¦«à§à¦°à§‡à¦¶ à¦Ÿà§‹à¦•à§‡à¦¨ à¦®à§‡à§Ÿà¦¾à¦¦à§‹à¦¤à§à¦¤à§€à¦°à§à¦£ à¦¹à¦¬à§‡
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),                  # Headers-à¦ 'Bearer <token>' à¦ªà¦¾à¦ à¦¾à¦¤à§‡ à¦¹à¦¬à§‡
}

# Swagger ar kaj
SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
    }
}

# Database: DATABASE_URL thakle sheta use hobe (Render style), nahole local postgres
import dj_database_url
DATABASES = {
    'default': dj_database_url.config(
        default='postgres://postgres@127.0.0.1:5432/eecommerce_db',
        conn_max_age=600,
    )
}
