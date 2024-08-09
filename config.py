class Config(object):
    DEBUG = False
    TESTING = False
    CACHE_TYPE="RedisCache"
    CACHE_DEFAULT_TIMER= 300


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///kisalay.db'
    SECRET_KEY = "thisissecter"
    SECURITY_PASSWORD_SALT = "thisissaltt"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'
    SECURITY_PASSWORD_HASH= 'bcrypt'


    CELERY_BROKER_URL = 'redis://localhost:6379/0'
    CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'



    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_SENDER_EMAIL = '21f1003331@ds.study.iitm.ac.in'
    MAIL_SENDER_PASSWORD = 'kVHrj?Pw8$cs'

    
    CACHE_TYPE = "RedisCache"
    CACHE_REDIS_HOST = "localhost"
    CACHE_REDIS_PORT = 6379
    CACHE_REDIS_DB = 3
   