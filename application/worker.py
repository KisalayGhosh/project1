from celery import Celery, Task
from application import create_app

def celery_init_app(app):
    class FlaskTask(Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.import_name, task_cls=FlaskTask)
    celery_app.config_from_object("celeryconfig")  # Ensure you have a celeryconfig.py
    return celery_app

app = create_app()
celery_app = celery_init_app(app)

if __name__ == '__main__':
    app.run(debug=True)
