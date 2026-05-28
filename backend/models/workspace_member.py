from extensions import db

class WorkspaceMember(db.Model):

    __tablename__ = "workspace_members"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    workspace_id = db.Column(
        db.Integer,
        db.ForeignKey("workspaces.id"),
        nullable=False
    )

    role = db.Column(
        db.String(20),
        default="Member"
    )

    joined_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )