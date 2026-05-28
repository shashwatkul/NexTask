import os

from flask import Flask
from flask_cors import CORS
from datetime import timedelta

from config import Config
from extensions import db, jwt, bcrypt
from routes.workspace_routes import workspace_bp
from routes.project_routes import project_bp
from routes.task_routes import task_bp
from routes.dashboard_routes import dashboard_bp
from routes.comment_routes import comment_bp
from routes.activity_routes import activity_bp
from routes.profile_routes import profile_bp

from routes.ai_routes import ai_bp
from dotenv import load_dotenv
load_dotenv()
print(
    os.getenv(
        "JWT_SECRET_KEY"
    )
)

def create_app():

    app = Flask(__name__)

    app.config.from_object(Config)
    app.config["JWT_SECRET_KEY"] = os.getenv(
    "JWT_SECRET_KEY"
)

    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2)

    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=7)

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
    
    app.register_blueprint(
    project_bp,
    url_prefix="/api/projects"
)
    
    app.register_blueprint(
    task_bp,
    url_prefix="/api/tasks"
)
    
    app.register_blueprint(
    dashboard_bp,
    url_prefix="/api/dashboard"
)
    app.register_blueprint(
    comment_bp,
    url_prefix="/api/comments"
)

    app.register_blueprint(
    activity_bp,
    url_prefix="/api/activity"
)
    app.register_blueprint(
    profile_bp,
    url_prefix="/api/profile"
)
    
    app.register_blueprint(
    ai_bp,
    url_prefix="/api/ai"
    
)
    print(
    os.getenv(
        "OPENAI_API_KEY"
    )
)

    return app


app = create_app()

if __name__ == "__main__":

    with app.app_context():
        db.create_all()

    app.run(debug=True)