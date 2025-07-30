import os
from flask_migrate import init, migrate, stamp, upgrade

from app import create_app, db
from models import Log, Payload, User

def deploy():
	app = create_app()
	app.app_context().push()
	db.create_all()

	# Only initialize migrations if the directory doesn't exist
	migrations_dir = os.path.join(os.getcwd(), 'migrations')
	if not os.path.exists(migrations_dir):
		init()
		stamp()
	
	migrate()
	upgrade()
	
deploy()
