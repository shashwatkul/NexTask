from extensions import db

class Project(db.Model):

    __tablename__ = "projects"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    description = db.Column(
        db.Text
    )

    workspace_id = db.Column(
        db.Integer,
        db.ForeignKey("workspaces.id")
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )