from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import db, jwt, bcrypt
from routes.workspace_routes import workspace_bp

def create_app():

    app = Flask(__name__)

    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    from routes.auth_routes import auth_bp

    app.register_blueprint(
        auth_bp,
        url_prefix="/api/auth"
    )

    app.register_blueprint(
    workspace_bp,
    url_prefix="/api/workspaces"
)

    return app


app = create_app()

if __name__ == "__main__":

    with app.app_context():
        db.create_all()

    app.run(debug=True)